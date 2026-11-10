import { generateRandomToken, hashPassword, hashToken, verifyPassword } from "./crypto";
import { ensureTables } from "./db";

import type { AuthUser, UserSession } from "../../app.d";

const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 30; // 30 days

export async function createSession(db: D1Database, userId: string): Promise<string> {
  await ensureTables(db);
  const token = generateRandomToken();
  const sessionId = await hashToken(token);
  const expiresAt = Date.now() + SESSION_DURATION_MS;

  await db
    .prepare("INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)")
    .bind(sessionId, userId, expiresAt)
    .run();

  return token;
}

export async function validateSessionToken(
  db: D1Database,
  token: string
): Promise<{ user: AuthUser | null; session: UserSession | null }> {
  await ensureTables(db);
  const sessionId = await hashToken(token);

  const sessionRow = await db
    .prepare("SELECT id, user_id, expires_at FROM sessions WHERE id = ?")
    .bind(sessionId)
    .first<{ id: string; user_id: string; expires_at: number }>();

  if (!sessionRow) {
    return { user: null, session: null };
  }

  if (Date.now() >= sessionRow.expires_at) {
    await db.prepare("DELETE FROM sessions WHERE id = ?").bind(sessionId).run();
    return { user: null, session: null };
  }

  const userRow = await db
    .prepare("SELECT id, email, name, role, created_at FROM users WHERE id = ?")
    .bind(sessionRow.user_id)
    .first<{
      id: string;
      email: string;
      name: string;
      role: "admin" | "editor";
      created_at: number;
    }>();

  if (!userRow) {
    await db.prepare("DELETE FROM sessions WHERE id = ?").bind(sessionId).run();
    return { user: null, session: null };
  }

  const session: UserSession = {
    id: sessionRow.id,
    userId: sessionRow.user_id,
    expiresAt: sessionRow.expires_at
  };

  const user: AuthUser = {
    id: userRow.id,
    email: userRow.email,
    name: userRow.name,
    role: userRow.role,
    createdAt: userRow.created_at
  };

  return { user, session };
}

export async function invalidateSession(db: D1Database, sessionId: string): Promise<void> {
  await db.prepare("DELETE FROM sessions WHERE id = ?").bind(sessionId).run();
}

export async function authenticateUser(
  db: D1Database,
  email: string,
  pass: string
): Promise<AuthUser | null> {
  await ensureTables(db);
  await seedInitialAdmin(db);

  const row = await db
    .prepare("SELECT id, email, password_hash, name, role, created_at FROM users WHERE email = ?")
    .bind(email.trim().toLowerCase())
    .first<{
      id: string;
      email: string;
      password_hash: string;
      name: string;
      role: "admin" | "editor";
      created_at: number;
    }>();

  if (!row) return null;

  const valid = await verifyPassword(pass, row.password_hash);
  if (!valid) return null;

  return {
    id: row.id,
    email: row.email,
    name: row.name,
    role: row.role,
    createdAt: row.created_at
  };
}

export async function seedInitialAdmin(db: D1Database): Promise<void> {
  await ensureTables(db);
  const row = await db.prepare("SELECT COUNT(*) as count FROM users").first<{ count: number }>();

  if (!row || Number(row.count) === 0) {
    const adminId = "user-admin-default";
    const email = "admin@nawra.com";
    const passwordHash = await hashPassword("admin123");
    const name = "Administrator Nawra";
    const role = "admin";
    const createdAt = Date.now();

    await db
      .prepare(
        "INSERT INTO users (id, email, password_hash, name, role, created_at) VALUES (?, ?, ?, ?, ?, ?)"
      )
      .bind(adminId, email, passwordHash, name, role, createdAt)
      .run();
  }
}
