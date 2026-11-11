import { hashPassword } from "./crypto";
import { localSqliteD1Instance } from "./local-d1";
import { TABLE_STATEMENTS } from "./schema";

export interface DatabaseStatus {
  initialized: boolean;
  tablesExist: boolean;
  adminExists: boolean;
  error?: string;
}

export async function checkDatabaseStatus(d1?: D1Database): Promise<DatabaseStatus> {
  const client = d1 || (localSqliteD1Instance as unknown as D1Database);
  if (!client) {
    return {
      initialized: false,
      tablesExist: false,
      adminExists: false,
      error: "Koneksi database (D1) tidak tersedia."
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

export async function initializeDatabase(
  d1?: D1Database
): Promise<{ success: boolean; message: string }> {
  const client = d1 || (localSqliteD1Instance as unknown as D1Database);
  if (!client) {
    return {
      success: false,
      message: "Koneksi database (D1) tidak ditemukan."
    };
  }

  try {
    for (const stmt of TABLE_STATEMENTS) {
      await client.prepare(stmt).run();
    }

    try {
      await client.prepare("ALTER TABLE users ADD COLUMN username TEXT").run();
    } catch {
      // Kolom username mungkin sudah ada
    }

    const userRes = await client
      .prepare("SELECT count(*) as count FROM users")
      .first<{ count: number }>();

    if (!userRes || userRes.count === 0) {
      const passwordHash = await hashPassword("admin123");
      const now = Date.now();
      const adminId = crypto.randomUUID();

      await client
        .prepare(
          `INSERT INTO users (id, username, email, password, name, role, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
        )
        .bind(
          adminId,
          "admin",
          "admin@nawra.com",
          passwordHash,
          "Administrator Nawra",
          "admin",
          now,
          now
        )
        .run();
    }

    return {
      success: true,
      message: "Database dan akun admin default berhasil diinisialisasi."
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      success: false,
      message: `Gagal menginisialisasi database: ${message}`
    };
  }
}
