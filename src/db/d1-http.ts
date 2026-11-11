import fs from "node:fs";
import path from "node:path";
import process from "node:process";

export interface D1HttpConfig {
  accountId?: string;
  databaseId?: string;
  token?: string;
  email?: string;
}

function loadEnvFile(): void {
  if (process.env.CLOUDFLARE_ACCOUNT_ID && process.env.CLOUDFLARE_D1_TOKEN) return;
  try {
    const envPath = path.resolve(process.cwd(), ".env");
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, "utf-8");
      for (const line of content.split("\n")) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) continue;
        const eqIdx = trimmed.indexOf("=");
        if (eqIdx > 0) {
          const key = trimmed.slice(0, eqIdx).trim();
          const val = trimmed
            .slice(eqIdx + 1)
            .trim()
            .replace(/^["']|["']$/g, "");
          if (!process.env[key]) {
            process.env[key] = val;
          }
        }
      }
    }
  } catch {
    // Abaikan jika pembacaan file .env tidak dimungkinkan
  }
}

function getEnvConfig(): D1HttpConfig {
  loadEnvFile();
  return {
    accountId: process.env.CLOUDFLARE_ACCOUNT_ID,
    databaseId: process.env.CLOUDFLARE_DATABASE_ID,
    token: process.env.CLOUDFLARE_D1_TOKEN,
    email: process.env.CLOUDFLARE_EMAIL
  };
}

export class D1HttpClient {
  private config: D1HttpConfig;

  constructor(config?: D1HttpConfig) {
    this.config = config || getEnvConfig();
  }

  private async executeQuery(sql: string, params: unknown[] = []) {
    const { accountId, databaseId, token, email } = this.config;
    if (!accountId || !databaseId || !token) {
      throw new Error(
        "Kredensial Cloudflare D1 belum diset di .env (CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_DATABASE_ID, CLOUDFLARE_D1_TOKEN)."
      );
    }

    const headers: Record<string, string> = {
      "Content-Type": "application/json"
    };

    if (token.startsWith("cfk_")) {
      headers["X-Auth-Key"] = token;
      if (email) headers["X-Auth-Email"] = email;
    } else {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${databaseId}/query`;
    const res = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify({ sql, params })
    });

    const data = (await res.json()) as {
      success: boolean;
      errors?: Array<{ code: number; message: string }>;
      result?: Array<{ results: unknown[]; meta?: unknown }>;
    };

    if (!data.success) {
      const errStr =
        data.errors?.map((e) => `[${e.code}] ${e.message}`).join(", ") || "Unknown D1 error";
      throw new Error(`Cloudflare D1 Query Error: ${errStr}`);
    }

    const firstResult = data.result?.[0];
    return {
      results: firstResult?.results || [],
      meta: firstResult?.meta
    };
  }

  prepare(sql: string) {
    const createStmt = (boundParams: unknown[] = []) => ({
      bind: (...args: unknown[]) => createStmt(args),
      all: async <T = unknown>(): Promise<{ results: T[] }> => {
        const { results } = await this.executeQuery(sql, boundParams);
        return { results: results as T[] };
      },
      first: async <T = unknown>(): Promise<T | null> => {
        const { results } = await this.executeQuery(sql, boundParams);
        return (results[0] as T) ?? null;
      },
      run: async () => {
        const { meta } = await this.executeQuery(sql, boundParams);
        return { success: true, meta };
      },
      raw: async <T = unknown>(): Promise<T[]> => {
        const { results } = await this.executeQuery(sql, boundParams);
        return results.map((r) => Object.values(r as object)) as T[];
      }
    });

    return createStmt();
  }

  async batch(statements: Array<{ run: () => Promise<unknown> }>) {
    return Promise.all(statements.map((s) => s.run()));
  }

  async exec(sql: string) {
    await this.executeQuery(sql);
    return { count: 0, duration: 0 };
  }
}

export const d1HttpClientInstance = new D1HttpClient();
