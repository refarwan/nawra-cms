import { eq, or } from "drizzle-orm";

import { refreshTokens, users } from "../../db/schema";
import { hashPassword, verifyPassword } from "./crypto";
import { ensureTables } from "./db";
import { decodeJwt, signJwt, verifyJwt } from "./jwt";

import type { AuthUser } from "../../app.d";
import type { AppDb } from "./db";

export interface JwtAccessTokenPayload {
  sub: string;
  username?: string;
  email: string;
  name: string;
  role: "admin" | "editor";
  iat: number;
  exp: number;
}

export interface JwtRefreshTokenPayload {
  sub: string;
  jti: string;
  iat: number;
  exp: number;
}

const ACCESS_TOKEN_EXP_SECONDS = 15 * 60; // 15 minutes
const REFRESH_TOKEN_EXP_MS = 1000 * 60 * 60 * 24 * 30; // 30 days

export async function generateTokens(
  user: AuthUser,
  secret?: string
): Promise<{ accessToken: string; refreshToken: string; jti: string; expiresAt: number }> {
  const now = Math.floor(Date.now() / 1000);
  const jti = "rt-" + crypto.randomUUID();
  const expiresAt = Date.now() + REFRESH_TOKEN_EXP_MS;

  const accessToken = await signJwt(
    {
      sub: user.id,
      username: user.username,
      email: user.email,
      name: user.name,
      role: user.role,
      iat: now,
      exp: now + ACCESS_TOKEN_EXP_SECONDS
    },
    secret
  );

  const refreshToken = await signJwt(
    {
      sub: user.id,
      jti,
      iat: now,
      exp: Math.floor(expiresAt / 1000)
    },
    secret
  );

  return { accessToken, refreshToken, jti, expiresAt };
}

export async function loginUser(
  db: AppDb,
  identifier: string,
  pass: string,
  secret?: string,
  d1?: D1Database
): Promise<{ user: AuthUser; accessToken: string; refreshToken: string } | null> {
  await ensureTables(d1);
  await seedInitialAdmin(db, d1);

  const clean = identifier.trim().toLowerCase();
  const row = await db.query.users.findFirst({
    where: or(eq(users.email, clean), eq(users.username, clean))
  });

  if (!row) return null;

  const valid = await verifyPassword(pass, row.password);
  if (!valid) return null;

  const user: AuthUser = {
    id: row.id,
    username: row.username,
    email: row.email,
    name: row.name || row.username,
    role: row.role,
    createdAt: row.createdAt
  };

  const { accessToken, refreshToken, jti, expiresAt } = await generateTokens(user, secret);

  await db.insert(refreshTokens).values({
    id: jti,
    userId: user.id,
    expiresAt,
    createdAt: Date.now()
  });

  return { user, accessToken, refreshToken };
}

export async function refreshUserToken(
  db: AppDb,
  refreshToken: string,
  secret?: string,
  d1?: D1Database
): Promise<{ user: AuthUser; accessToken: string } | null> {
  const decoded = await verifyJwt<JwtRefreshTokenPayload>(refreshToken, secret);
  if (!decoded || !decoded.jti || !decoded.sub) return null;

  await ensureTables(d1);

  const tokenRecord = await db.query.refreshTokens.findFirst({
    where: eq(refreshTokens.id, decoded.jti)
  });

  if (!tokenRecord || Date.now() >= tokenRecord.expiresAt) {
    if (tokenRecord) {
      await db.delete(refreshTokens).where(eq(refreshTokens.id, decoded.jti));
    }
    return null;
  }

  const userRow = await db.query.users.findFirst({
    where: eq(users.id, tokenRecord.userId)
  });

  if (!userRow) {
    await db.delete(refreshTokens).where(eq(refreshTokens.id, decoded.jti));
    return null;
  }

  const user: AuthUser = {
    id: userRow.id,
    username: userRow.username,
    email: userRow.email,
    name: userRow.name || userRow.username,
    role: userRow.role,
    createdAt: userRow.createdAt
  };

  const now = Math.floor(Date.now() / 1000);
  const newAccessToken = await signJwt(
    {
      sub: user.id,
      username: user.username,
      email: user.email,
      name: user.name,
      role: user.role,
      iat: now,
      exp: now + ACCESS_TOKEN_EXP_SECONDS
    },
    secret
  );

  return { user, accessToken: newAccessToken };
}

export async function revokeRefreshToken(
  db: AppDb,
  refreshToken: string,
  d1?: D1Database
): Promise<void> {
  const decoded = decodeJwt<JwtRefreshTokenPayload>(refreshToken);
  if (!decoded || !decoded.jti) return;

  await ensureTables(d1);
  await db.delete(refreshTokens).where(eq(refreshTokens.id, decoded.jti));
}

export async function seedInitialAdmin(db: AppDb, d1?: D1Database): Promise<void> {
  await ensureTables(d1);
  const firstUser = await db.query.users.findFirst();

  if (!firstUser) {
    const password = await hashPassword("admin123");
    const now = Date.now();
    await db.insert(users).values({
      id: crypto.randomUUID(),
      username: "admin",
      email: "admin@nawra.com",
      password,
      name: "Administrator Nawra",
      role: "admin",
      createdAt: now,
      updatedAt: now
    });
  } else if (!firstUser.username) {
    await db.update(users).set({ username: "admin" }).where(eq(users.id, firstUser.id));
  }
}
