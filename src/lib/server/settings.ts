import { eq } from "drizzle-orm";

import { getDb } from "#db/index";
import { settings } from "#db/schema";

let cachedJwtSecret: string | null = null;

export function generateRandomSecret(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

export async function getJwtSecret(): Promise<string> {
  if (process.env.JWT_SECRET) {
    return process.env.JWT_SECRET;
  }

  if (cachedJwtSecret) return cachedJwtSecret;

  try {
    const db = getDb();
    const existing = await db.query.settings.findFirst({
      where: eq(settings.id, "jwt_secret")
    });

    if (existing?.value) {
      cachedJwtSecret = existing.value;
      return existing.value;
    }

    const newSecret = generateRandomSecret();
    const now = Date.now();
    await db.insert(settings).values({
      id: "jwt_secret",
      value: newSecret,
      createdAt: now,
      updatedAt: now
    });

    cachedJwtSecret = newSecret;
    return newSecret;
  } catch {
    return "nawra-cms-fallback-secret-key-32-chars!";
  }
}

export async function getSetting(id: string): Promise<string | null> {
  const db = getDb();
  const row = await db.query.settings.findFirst({
    where: eq(settings.id, id)
  });
  return row?.value ?? null;
}

export async function setSetting(id: string, value: string): Promise<void> {
  const db = getDb();
  const now = Date.now();
  const existing = await db.query.settings.findFirst({
    where: eq(settings.id, id)
  });

  if (existing) {
    await db.update(settings).set({ value, updatedAt: now }).where(eq(settings.id, id));
  } else {
    await db.insert(settings).values({ id, value, createdAt: now, updatedAt: now });
  }

  if (id === "jwt_secret") {
    cachedJwtSecret = value;
  }
}
