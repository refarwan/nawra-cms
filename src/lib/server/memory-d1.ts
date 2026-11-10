// In-memory fallback implementing Cloudflare D1Database for local dev

type Row = Record<string, unknown>;

export class MemoryD1 {
  users = new Map<string, Row>();
  sessions = new Map<string, Row>();
  headers = new Map<string, Row>();
  footers = new Map<string, Row>();

  private handleAll(sql: string, args: unknown[]) {
    const s = sql.toLowerCase();
    const where = s.includes("where ") ? s.slice(s.indexOf("where ") + 6) : "";

    if (s.includes('from "users"') || s.includes("from users")) {
      if (where.includes("email") || where.includes('"email"')) {
        const email = String(args[0]).toLowerCase();
        for (const u of this.users.values()) {
          if (String(u.email).toLowerCase() === email) return { results: [u] };
        }
        return { results: [] };
      }
      if (where.includes("id") || where.includes('"id"')) {
        const u = this.users.get(String(args[0]));
        return { results: u ? [u] : [] };
      }
      if (s.includes("count")) {
        return { results: [{ count: this.users.size }] };
      }
      return { results: Array.from(this.users.values()) };
    }

    if (s.includes('from "sessions"') || s.includes("from sessions")) {
      if (where.includes("id") || where.includes('"id"')) {
        const sess = this.sessions.get(String(args[0]));
        return { results: sess ? [sess] : [] };
      }
      return { results: Array.from(this.sessions.values()) };
    }

    if (s.includes('from "headers"') || s.includes("from headers")) {
      let list = Array.from(this.headers.values());
      if (where.includes("is_active") || where.includes('"is_active"')) {
        const target = Number(args[0] ?? 1);
        list = list.filter((h) => Number(h.is_active) === target);
      }
      list.sort((a, b) => Number(b.created_at) - Number(a.created_at));
      return { results: list };
    }

    if (s.includes('from "footers"') || s.includes("from footers")) {
      let list = Array.from(this.footers.values());
      if (where.includes("is_active") || where.includes('"is_active"')) {
        const target = Number(args[0] ?? 1);
        list = list.filter((f) => Number(f.is_active) === target);
      }
      list.sort((a, b) => Number(b.created_at) - Number(a.created_at));
      return { results: list };
    }

    return { results: [] };
  }

  private handleRun(sql: string, args: unknown[]) {
    const s = sql.toLowerCase();
    const where = s.includes("where ") ? s.slice(s.indexOf("where ") + 6) : "";

    if (s.includes('insert into "users"') || s.includes("insert into users")) {
      const [id, email, password_hash, name, role, created_at] = args;
      this.users.set(String(id), {
        id: String(id),
        email: String(email),
        password_hash: String(password_hash),
        name: String(name),
        role: role || "admin",
        created_at: Number(created_at)
      });
    } else if (s.includes('insert into "sessions"') || s.includes("insert into sessions")) {
      const [id, user_id, expires_at] = args;
      this.sessions.set(String(id), {
        id: String(id),
        user_id: String(user_id),
        expires_at: Number(expires_at)
      });
    } else if (s.includes('delete from "sessions"') || s.includes("delete from sessions")) {
      this.sessions.delete(String(args[0]));
    } else if (s.includes('insert into "headers"') || s.includes("insert into headers")) {
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
    } else if (s.includes('update "headers"') || s.includes("update headers")) {
      if (where.includes("id") || where.includes('"id"')) {
        for (const h of this.headers.values()) h.is_active = 0;
        const target = this.headers.get(String(args[1] || args[0]));
        if (target) target.is_active = Number(args[0] ?? 1);
      } else {
        const val = Number(args[0] ?? 0);
        for (const h of this.headers.values()) h.is_active = val;
      }
    } else if (s.includes('delete from "headers"') || s.includes("delete from headers")) {
      this.headers.delete(String(args[0]));
    } else if (s.includes('insert into "footers"') || s.includes("insert into footers")) {
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
    } else if (s.includes('update "footers"') || s.includes("update footers")) {
      if (where.includes("id") || where.includes('"id"')) {
        for (const f of this.footers.values()) f.is_active = 0;
        const target = this.footers.get(String(args[1] || args[0]));
        if (target) target.is_active = Number(args[0] ?? 1);
      } else {
        const val = Number(args[0] ?? 0);
        for (const f of this.footers.values()) f.is_active = val;
      }
    } else if (s.includes('delete from "footers"') || s.includes("delete from footers")) {
      this.footers.delete(String(args[0]));
    }
    return { success: true };
  }

  prepare(sql: string) {
    const createStmt = (args: unknown[] = []) => ({
      bind: (...newArgs: unknown[]) => createStmt(newArgs),
      first: async <T = unknown>(): Promise<T | null> => {
        const res = this.handleAll(sql, args);
        return (res.results[0] as T) || null;
      },
      all: async <T = unknown>(): Promise<{ results: T[] }> => {
        const res = this.handleAll(sql, args);
        return { results: res.results as T[] };
      },
      run: async () => this.handleRun(sql, args),
      raw: async <T = unknown>(): Promise<T[]> => {
        const res = this.handleAll(sql, args);
        return res.results.map((r) => Object.values(r)) as T[];
      }
    });
    return createStmt();
  }

  async batch(statements: Array<{ run: () => Promise<unknown> }>) {
    return Promise.all(statements.map((s) => s.run()));
  }

  async exec() {
    return { count: 0, duration: 0 };
  }
}

export const memoryD1Instance = new MemoryD1();
