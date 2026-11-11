import { env } from "cloudflare:workers";
import { drizzle } from "drizzle-orm/d1";

import * as schema from "./schema";

export function getD1Binding(d1?: D1Database): D1Database | undefined {
  if (d1) return d1;
  try {
    if (env?.DB) return env.DB;
  } catch {
    // Ignore if cloudflare:workers is accessed outside request context
  }
  return globalThis.__sveltekit_cloudflare_platform?.env?.DB;
}

export function getDb(d1?: D1Database) {
  const client = getD1Binding(d1);
  if (!client) {
    throw new Error("Binding Cloudflare D1 (DB) tidak tersedia pada platform.env.DB.");
  }
  return drizzle(client, { schema });
}

export type AppDb = ReturnType<typeof getDb>;
