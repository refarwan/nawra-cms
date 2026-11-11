import { drizzle } from "drizzle-orm/d1";

import { localSqliteD1Instance } from "./local-d1";
import * as schema from "./schema";

export function getDb(d1?: D1Database) {
  const client = d1 || (localSqliteD1Instance as unknown as D1Database);
  return drizzle(client, { schema });
}

export type AppDb = ReturnType<typeof getDb>;

let initialized = false;

export async function ensureTables(d1?: D1Database): Promise<void> {
  if (initialized) return;

  const client = d1 || (localSqliteD1Instance as unknown as D1Database);
  try {
    for (const stmt of schema.TABLE_STATEMENTS) {
      await client.prepare(stmt).run();
    }
    try {
      await client.prepare("ALTER TABLE users ADD COLUMN username TEXT").run();
    } catch {
      // Kolom username mungkin sudah ada
    }
    try {
      await client
        .prepare(
          "UPDATE users SET username = 'admin' WHERE (username IS NULL OR username = '') AND email = 'admin@nawra.com'"
        )
        .run();
      await client
        .prepare(
          "UPDATE users SET username = lower(substr(email, 1, instr(email, '@') - 1)) WHERE username IS NULL OR username = ''"
        )
        .run();
    } catch {
      // Abaikan jika pembaruan username default belum diperlukan
    }
    initialized = true;
  } catch (err) {
    console.error("D1 schema init error:", err);
  }
}
