import { drizzle } from "drizzle-orm/d1";

import { memoryD1Instance } from "./memory-d1";
import * as schema from "./schema";

export function getDb(d1?: D1Database) {
  const client = d1 || (memoryD1Instance as unknown as D1Database);
  return drizzle(client, { schema });
}

export type AppDb = ReturnType<typeof getDb>;

let initialized = false;

export async function ensureTables(d1?: D1Database): Promise<void> {
  if (initialized) return;

  const client = d1 || (memoryD1Instance as unknown as D1Database);
  try {
    for (const stmt of schema.TABLE_STATEMENTS) {
      await client.prepare(stmt).run();
    }
    initialized = true;
  } catch (err) {
    console.error("D1 schema init error:", err);
  }
}
