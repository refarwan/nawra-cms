// App-wide types and Cloudflare D1 environment declarations

export interface UserSession {
  id: string;
  userId: string;
  expiresAt: number;
}

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  name: string;
  avatarUrl?: string;
  role: "admin" | "editor";
  createdAt: number;
  updatedAt?: number;
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

  interface R2ObjectBody {
    key: string;
    size: number;
    etag: string;
    httpMetadata?: { contentType?: string; cacheControl?: string };
    body: ReadableStream<Uint8Array>;
    arrayBuffer(): Promise<ArrayBuffer>;
  }

  interface R2Bucket {
    get(key: string): Promise<R2ObjectBody | null>;
    put(
      key: string,
      value: ReadableStream | ArrayBuffer | ArrayBufferView | string | Blob,
      options?: { httpMetadata?: { contentType?: string; cacheControl?: string } }
    ): Promise<{ key: string; size: number; etag: string }>;
    delete(keys: string | string[]): Promise<void>;
  }

  namespace App {
    // interface Error {}
    interface Locals {
      user: AuthUser | null;
      session: UserSession | null;
      accessToken: string | null;
    }
    // interface PageData {}
    // interface PageState {}
    interface Platform {
      env: {
        DB?: D1Database;
        MEDIA_BUCKET?: R2Bucket;
        ASSETS?: Fetcher;
        JWT_SECRET?: string;
      };
      cf?: CfProperties;
      ctx?: ExecutionContext;
    }
  }

  var __sveltekit_cloudflare_platform: App.Platform | undefined;
}

export {};
