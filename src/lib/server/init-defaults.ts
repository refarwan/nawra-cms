import { eq } from "drizzle-orm";

import { getLibsqlClient } from "../../db/index";
import { users } from "../../db/schema";
import { hashPassword } from "./crypto";
import { ensureTables } from "./db";
import { getDefaultHomeTemplate } from "./default-home-template";
import { getDefaultFooterTemplate, getDefaultHeaderTemplate } from "./default-templates";
import { generateRandomSecret } from "./settings";

import type { AppDb } from "./db";

export async function registerDefaultAdmin(): Promise<void> {
  const client = getLibsqlClient();
  const password = await hashPassword("admin123");
  const now = Date.now();
  await client.execute({
    sql: `INSERT INTO users (id, username, email, password, name, role, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      crypto.randomUUID(),
      "admin",
      "admin@nawra.com",
      password,
      "Administrator Nawra",
      "admin",
      now,
      now
    ]
  });
}

export async function registerDefaultHeaderAndFooter(): Promise<void> {
  const client = getLibsqlClient();
  const now = Date.now();
  const headerTpl = getDefaultHeaderTemplate();
  const headerRes = await client.execute("SELECT count(*) as count FROM headers");
  const headerCount = Number(headerRes.rows[0]?.count ?? 0);

  if (headerCount === 0) {
    await client.execute({
      sql: `INSERT INTO headers (id, title, content_json, content_html, is_active, created_at, updated_at)
            VALUES (?, ?, ?, ?, 1, ?, ?)`,
      args: [
        crypto.randomUUID(),
        headerTpl.title,
        headerTpl.contentJson,
        headerTpl.contentHtml,
        now,
        now
      ]
    });
  }

  const footerTpl = getDefaultFooterTemplate();
  const footerRes = await client.execute("SELECT count(*) as count FROM footers");
  const footerCount = Number(footerRes.rows[0]?.count ?? 0);

  if (footerCount === 0) {
    await client.execute({
      sql: `INSERT INTO footers (id, title, content_json, content_html, is_active, created_at, updated_at)
            VALUES (?, ?, ?, ?, 1, ?, ?)`,
      args: [
        crypto.randomUUID(),
        footerTpl.title,
        footerTpl.contentJson,
        footerTpl.contentHtml,
        now,
        now
      ]
    });
  }

  const homeTpl = getDefaultHomeTemplate();
  const homeRes = await client.execute("SELECT count(*) as count FROM homepages");
  const homeCount = Number(homeRes.rows[0]?.count ?? 0);

  if (homeCount === 0) {
    await client.execute({
      sql: `INSERT INTO homepages (id, title, content_json, content_html, is_active, created_at, updated_at)
            VALUES (?, ?, ?, ?, 1, ?, ?)`,
      args: [crypto.randomUUID(), homeTpl.title, homeTpl.contentJson, homeTpl.contentHtml, now, now]
    });
  }
}

export async function registerDefaultSettings(): Promise<void> {
  const client = getLibsqlClient();
  const now = Date.now();
  const defaults: Array<[string, string]> = [
    ["jwt_secret", generateRandomSecret()],
    ["site_title", "Nawra CMS"],
    [
      "site_description",
      "Sistem Manajemen Konten (CMS) Visual Modern tanpa koding dengan Turso & S3 CDN."
    ],
    ["site_icon", "lucide:sparkles"],
    ["favicon", "/favicon.svg"]
  ];

  for (const [id, value] of defaults) {
    await client.execute({
      sql: `INSERT OR IGNORE INTO settings (id, value, created_at, updated_at) VALUES (?, ?, ?, ?)`,
      args: [id, value, now, now]
    });
  }
}

export async function seedInitialAdmin(db: AppDb): Promise<void> {
  await ensureTables();
  const firstUser = await db.query.users.findFirst();

  if (!firstUser) {
    const password = await hashPassword("admin123");
    const now = Date.now();
    await db.insert(users).values({
      id: crypto.randomUUID(),
      username: "admin",
      email: "admin@nawra.com",
      password,
      name: "Administrator Nawra",
      role: "admin",
      createdAt: now,
      updatedAt: now
    });
  } else if (!firstUser.username) {
    await db.update(users).set({ username: "admin" }).where(eq(users.id, firstUser.id));
  }
}
