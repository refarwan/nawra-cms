import { SCHEMA_SQL } from "./schema";

import type { FooterRecord, HeaderRecord, SessionRecord, UserRecord } from "./schema";

// Database layer for Cloudflare D1 with local fallback support

class MemoryDB {
  users = new Map<string, UserRecord>();
  sessions = new Map<string, SessionRecord>();
  headers = new Map<string, HeaderRecord>();
  footers = new Map<string, FooterRecord>();

  prepare(sql: string) {
    return {
      bind: (...args: unknown[]) => ({
        first: async <T = unknown>(): Promise<T | null> => {
          if (sql.includes("FROM users WHERE email = ?")) {
            const target = String(args[0]).toLowerCase();
            for (const u of this.users.values()) {
              if (u.email.toLowerCase() === target) return u as T;
            }
            return null;
          }
          if (sql.includes("FROM users WHERE id = ?")) {
            return (this.users.get(String(args[0])) as T) || null;
          }
          if (sql.includes("FROM sessions WHERE id = ?")) {
            return (this.sessions.get(String(args[0])) as T) || null;
          }
          if (sql.includes("SELECT COUNT(*) as count FROM users")) {
            return { count: this.users.size } as T;
          }
          if (sql.includes("SELECT * FROM headers WHERE is_active = 1")) {
            for (const h of this.headers.values()) {
              if (h.is_active === 1) return h as T;
            }
            return null;
          }
          if (sql.includes("SELECT * FROM footers WHERE is_active = 1")) {
            for (const f of this.footers.values()) {
              if (f.is_active === 1) return f as T;
            }
            return null;
          }
          return null;
        },
        all: async <T = unknown>(): Promise<{ results: T[] }> => {
          if (sql.includes("FROM headers")) {
            const list = Array.from(this.headers.values()).sort(
              (a, b) => b.created_at - a.created_at
            );
            return { results: list as T[] };
          }
          if (sql.includes("FROM footers")) {
            const list = Array.from(this.footers.values()).sort(
              (a, b) => b.created_at - a.created_at
            );
            return { results: list as T[] };
          }
          return { results: [] };
        },
        run: async () => {
          if (sql.includes("INSERT INTO users")) {
            const [id, email, password_hash, name, role, created_at] = args;
            this.users.set(String(id), {
              id: String(id),
              email: String(email),
              password_hash: String(password_hash),
              name: String(name),
              role: role as "admin" | "editor",
              created_at: Number(created_at)
            });
          } else if (sql.includes("INSERT INTO sessions")) {
            const [id, user_id, expires_at] = args;
            this.sessions.set(String(id), {
              id: String(id),
              user_id: String(user_id),
              expires_at: Number(expires_at)
            });
          } else if (sql.includes("DELETE FROM sessions WHERE id = ?")) {
            this.sessions.delete(String(args[0]));
          } else if (sql.includes("INSERT INTO headers")) {
            const [id, title, content, is_active, created_at, updated_at] = args;
            if (Number(is_active) === 1) {
              for (const h of this.headers.values()) h.is_active = 0;
            }
            this.headers.set(String(id), {
              id: String(id),
              title: String(title),
              content: String(content),
              is_active: Number(is_active),
              created_at: Number(created_at),
              updated_at: Number(updated_at)
            });
          } else if (sql.includes("UPDATE headers SET is_active = 0")) {
            for (const h of this.headers.values()) h.is_active = 0;
          } else if (sql.includes("UPDATE headers SET is_active = 1 WHERE id = ?")) {
            for (const h of this.headers.values()) h.is_active = 0;
            const h = this.headers.get(String(args[0]));
            if (h) h.is_active = 1;
          } else if (sql.includes("DELETE FROM headers WHERE id = ?")) {
            this.headers.delete(String(args[0]));
          } else if (sql.includes("INSERT INTO footers")) {
            const [id, title, content, is_active, created_at, updated_at] = args;
            if (Number(is_active) === 1) {
              for (const f of this.footers.values()) f.is_active = 0;
            }
            this.footers.set(String(id), {
              id: String(id),
              title: String(title),
              content: String(content),
              is_active: Number(is_active),
              created_at: Number(created_at),
              updated_at: Number(updated_at)
            });
          } else if (sql.includes("UPDATE footers SET is_active = 0")) {
            for (const f of this.footers.values()) f.is_active = 0;
          } else if (sql.includes("UPDATE footers SET is_active = 1 WHERE id = ?")) {
            for (const f of this.footers.values()) f.is_active = 0;
            const f = this.footers.get(String(args[0]));
            if (f) f.is_active = 1;
          } else if (sql.includes("DELETE FROM footers WHERE id = ?")) {
            this.footers.delete(String(args[0]));
          }
          return { success: true };
        }
      })
    };
  }

  async exec() {
    return { success: true };
  }
}

const memoryDbInstance = new MemoryDB();

export function getDb(d1?: D1Database): D1Database {
  return d1 || (memoryDbInstance as unknown as D1Database);
}

let initialized = false;

export async function ensureTables(db: D1Database): Promise<void> {
  if (initialized) return;

  try {
    await db.exec(SCHEMA_SQL);
    initialized = true;
  } catch (err) {
    console.error("D1 schema init error:", err);
  }
}

export type { HeaderRecord, FooterRecord, UserRecord, SessionRecord };
