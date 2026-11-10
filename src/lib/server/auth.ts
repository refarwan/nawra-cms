import { eq } from "drizzle-orm";

import { generateRandomToken, hashPassword, hashToken, verifyPassword } from "./crypto";
import { ensureTables } from "./db";
import { sessions, users } from "./schema";

import type { AuthUser, UserSession } from "../../app.d";
import type { AppDb } from "./db";

const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 30; // 30 days

export async function createSession(db: AppDb, userId: string, d1?: D1Database): Promise<string> {
  await ensureTables(d1);
  const token = generateRandomToken();
  const sessionId = await hashToken(token);
  const expiresAt = Date.now() + SESSION_DURATION_MS;

  await db.insert(sessions).values({
    id: sessionId,
    userId,
    expiresAt
  });

  return token;
}

export async function validateSessionToken(
  db: AppDb,
  token: string,
  d1?: D1Database
): Promise<{ user: AuthUser | null; session: UserSession | null }> {
  await ensureTables(d1);
  const sessionId = await hashToken(token);

  const sessionRow = await db.query.sessions.findFirst({
    where: eq(sessions.id, sessionId)
  });

  if (!sessionRow) {
    return { user: null, session: null };
  }

  if (Date.now() >= sessionRow.expiresAt) {
    await db.delete(sessions).where(eq(sessions.id, sessionId));
    return { user: null, session: null };
  }

  const userRow = await db.query.users.findFirst({
    where: eq(users.id, sessionRow.userId)
  });

  if (!userRow) {
    await db.delete(sessions).where(eq(sessions.id, sessionId));
    return { user: null, session: null };
  }

  const session: UserSession = {
    id: sessionRow.id,
    userId: sessionRow.userId,
    expiresAt: sessionRow.expiresAt
  };

  const user: AuthUser = {
    id: userRow.id,
    email: userRow.email,
    name: userRow.name,
    role: userRow.role,
    createdAt: userRow.createdAt
  };

  return { user, session };
}

export async function invalidateSession(db: AppDb, sessionId: string): Promise<void> {
  await db.delete(sessions).where(eq(sessions.id, sessionId));
}

export async function authenticateUser(
  db: AppDb,
  email: string,
  pass: string,
  d1?: D1Database
): Promise<AuthUser | null> {
  await ensureTables(d1);
  await seedInitialAdmin(db, d1);

  const targetEmail = email.trim().toLowerCase();
  const row = await db.query.users.findFirst({
    where: eq(users.email, targetEmail)
  });

  if (!row) return null;

  const valid = await verifyPassword(pass, row.passwordHash);
  if (!valid) return null;

  return {
    id: row.id,
    email: row.email,
    name: row.name,
    role: row.role,
    createdAt: row.createdAt
  };
}

export async function seedInitialAdmin(db: AppDb, d1?: D1Database): Promise<void> {
  await ensureTables(d1);
  const firstUser = await db.query.users.findFirst();

  if (!firstUser) {
    const passwordHash = await hashPassword("admin123");
    await db.insert(users).values({
      id: "user-admin-default",
      email: "admin@nawra.com",
      passwordHash,
      name: "Administrator Nawra",
      role: "admin",
      createdAt: Date.now()
    });
  }
}
