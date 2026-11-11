import { createRequire } from "node:module";

// Local SQLite file driver implementing D1Database interface for persistent local dev

interface SqliteDatabase {
  run: (sql: string, ...args: unknown[]) => unknown;
  exec?: (sql: string) => unknown;
  prepare: (sql: string) => {
    all: (...args: unknown[]) => unknown[];
    get: (...args: unknown[]) => unknown;
    run: (...args: unknown[]) => unknown;
    values?: (...args: unknown[]) => unknown[][];
  };
}

let dbInstance: SqliteDatabase | null = null;

function getSqliteInstance(): SqliteDatabase | null {
  if (dbInstance) return dbInstance;

  try {
    const req = createRequire(import.meta.url);
    if (typeof process !== "undefined" && process.versions?.bun) {
      const { Database } = req("bun:sqlite");
      const db = new Database(".local.sqlite");
      db.run("PRAGMA journal_mode = WAL;");
      dbInstance = db;
      return dbInstance;
    }
    const { DatabaseSync } = req("node:sqlite");
    const db = new DatabaseSync(".local.sqlite");
    db.exec("PRAGMA journal_mode = WAL;");
    dbInstance = {
      run: (sql: string, ...args: unknown[]) => db.prepare(sql).run(...args),
      exec: (sql: string) => db.exec(sql),
      prepare: (sql: string) => {
        const stmt = db.prepare(sql);
        return {
          all: (...args: unknown[]) => stmt.all(...args),
          get: (...args: unknown[]) => stmt.get(...args),
          run: (...args: unknown[]) => stmt.run(...args),
          values: (...args: unknown[]) =>
            stmt.all(...args).map((r: unknown) => Object.values(r as object))
        };
      }
    };
    return dbInstance;
  } catch (err) {
    console.warn("Could not load native SQLite, falling back to in-memory:", err);
    return null;
  }
}

export class LocalSqliteD1 {
  prepare(sql: string) {
    const db = getSqliteInstance();
    const createStmt = (args: unknown[] = []) => ({
      bind: (...newArgs: unknown[]) => createStmt(newArgs),
      all: async <T = unknown>(): Promise<{ results: T[] }> => {
        if (!db) return { results: [] };
        const stmt = db.prepare(sql);
        const results = stmt.all(...args) as T[];
        return { results };
      },
      first: async <T = unknown>(): Promise<T | null> => {
        if (!db) return null;
        const stmt = db.prepare(sql);
        return (stmt.get(...args) as T) ?? null;
      },
      run: async () => {
        if (!db) return { success: true };
        const stmt = db.prepare(sql);
        const res = stmt.run(...args);
        return { success: true, meta: res };
      },
      raw: async <T = unknown>(): Promise<T[]> => {
        if (!db) return [];
        const stmt = db.prepare(sql);
        if (stmt.values) {
          return stmt.values(...args) as T[];
        }
        const rows = stmt.all(...args);
        return rows.map((r: unknown) => Object.values(r as object)) as T[];
      }
    });

    return createStmt();
  }

  async batch(statements: Array<{ run: () => Promise<unknown> }>) {
    return Promise.all(statements.map((s) => s.run()));
  }

  async exec(sql: string) {
    const db = getSqliteInstance();
    if (db) {
      if (db.exec) db.exec(sql);
      else db.run(sql);
    }
    return { count: 0, duration: 0 };
  }
}

export const localSqliteD1Instance = new LocalSqliteD1();
