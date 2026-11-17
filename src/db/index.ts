import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

import * as schema from "./schema";

import type { Client } from "@libsql/client";

let clientInstance: Client | null = null;
let dbInstance: ReturnType<typeof drizzle<typeof schema>> | null = null;

export function getLibsqlClient(): Client {
  if (clientInstance) return clientInstance;

  const url = process.env.TURSO_DATABASE_URL || "file:local.db";
  const authToken = process.env.TURSO_AUTH_TOKEN || undefined;

  clientInstance = createClient({
    url,
    authToken
  });

  return clientInstance;
}

export function getDb() {
  if (dbInstance) return dbInstance;
  const client = getLibsqlClient();
  dbInstance = drizzle(client, { schema });
  return dbInstance;
}

export type AppDb = ReturnType<typeof getDb>;
