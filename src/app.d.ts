// App-wide types and Cloudflare D1 environment declarations

export interface UserSession {
  id: string;
  userId: string;
  expiresAt: number;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: "admin" | "editor";
  createdAt: number;
}

declare global {
  interface D1PreparedStatement {
    bind(...values: unknown[]): D1PreparedStatement;
    first<T = unknown>(colName?: string): Promise<T | null>;
    run(): Promise<{ success: boolean; meta?: unknown }>;
    all<T = unknown>(): Promise<{ results: T[]; success: boolean; meta?: unknown }>;
  }

  interface D1Database {
    prepare(query: string): D1PreparedStatement;
    dump(): Promise<ArrayBuffer>;
    batch<T = unknown>(statements: D1PreparedStatement[]): Promise<{ results: T[] }[]>;
    exec(query: string): Promise<{ count: number; duration: number }>;
  }

  namespace App {
    // interface Error {}
    interface Locals {
      user: AuthUser | null;
      session: UserSession | null;
    }
    // interface PageData {}
    // interface PageState {}
    interface Platform {
      env: {
        DB?: D1Database;
        ASSETS?: Fetcher;
      };
      cf: CfProperties;
      ctx: ExecutionContext;
    }
  }
}

export {};
