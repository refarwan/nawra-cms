import { getD1Binding } from "../../db/index";
import {
  registerDefaultAdmin,
  registerDefaultHeaderAndFooter,
  registerDefaultSettings
} from "./init-defaults";

export interface DatabaseStatus {
  initialized: boolean;
  tablesExist: boolean;
  adminExists: boolean;
  error?: string;
}

const CREATE_TABLES_SQL = [
  `CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT,
    avatar_url TEXT NOT NULL DEFAULT '',
    role TEXT NOT NULL DEFAULT 'editor',
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS refresh_tokens (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires_at INTEGER NOT NULL,
    created_at INTEGER NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS headers (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    content_json TEXT NOT NULL,
    content_html TEXT NOT NULL,
    is_active INTEGER NOT NULL DEFAULT 0,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS footers (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    content_json TEXT NOT NULL,
    content_html TEXT NOT NULL,
    is_active INTEGER NOT NULL DEFAULT 0,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS homepages (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    content_json TEXT NOT NULL,
    content_html TEXT NOT NULL,
    is_active INTEGER NOT NULL DEFAULT 0,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS settings (
    id TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
  )`
];

export async function checkDatabaseStatus(d1?: D1Database): Promise<DatabaseStatus> {
  const client = getD1Binding(d1);
  if (!client) {
    return {
      initialized: false,
      tablesExist: false,
      adminExists: false,
      error: "Binding database Cloudflare D1 (DB) tidak tersedia."
    };
  }

  try {
    const tableRes = await client
      .prepare("SELECT count(*) as count FROM sqlite_master WHERE type='table' AND name='users'")
      .first<{ count: number }>();
    const tablesExist = Boolean(tableRes && tableRes.count > 0);
    if (!tablesExist) {
      return { initialized: false, tablesExist: false, adminExists: false };
    }

    const userRes = await client
      .prepare("SELECT count(*) as count FROM users")
      .first<{ count: number }>();
    const adminExists = Boolean(userRes && userRes.count > 0);

    return {
      initialized: tablesExist && adminExists,
      tablesExist,
      adminExists
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      initialized: false,
      tablesExist: false,
      adminExists: false,
      error: message
    };
  }
}

export async function ensureDatabaseReady(d1?: D1Database): Promise<boolean> {
  const client = getD1Binding(d1);
  if (!client) return false;

  try {
    // Pastikan seluruh tabel dibuat (idempotent dengan IF NOT EXISTS)
    for (const sql of CREATE_TABLES_SQL) {
      await client.prepare(sql).run();
    }

    const userRes = await client
      .prepare("SELECT count(*) as count FROM users")
      .first<{ count: number }>();

    if (!userRes || userRes.count === 0) {
      await registerDefaultAdmin(client);
    }

    await registerDefaultHeaderAndFooter(client);
    await registerDefaultSettings(client);

    return true;
  } catch (err) {
    console.error("ensureDatabaseReady error:", err);
    return false;
  }
}

export async function initializeDatabase(
  d1?: D1Database
): Promise<{ success: boolean; message: string }> {
  try {
    const ready = await ensureDatabaseReady(d1);
    if (!ready) {
      return {
        success: false,
        message: "Gagal menyiapkan tabel dan data default."
      };
    }
    return {
      success: true,
      message: "Database dan data default berhasil diinisialisasi."
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      success: false,
      message: `Gagal menginisialisasi database: ${message}`
    };
  }
}
