import { drizzle } from "drizzle-orm/d1";

import { d1HttpClientInstance } from "./d1-http";
import * as schema from "./schema";

export function getDb(d1?: D1Database) {
  const client = d1 || (d1HttpClientInstance as unknown as D1Database);
  return drizzle(client, { schema });
}

export const db = getDb();

export type AppDb = ReturnType<typeof getDb>;
