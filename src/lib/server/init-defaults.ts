import { eq } from "drizzle-orm";

import { users } from "../../db/schema";
import { hashPassword } from "./crypto";
import { ensureTables } from "./db";
import { getDefaultHomeTemplate } from "./default-home-template";
import { getDefaultFooterTemplate, getDefaultHeaderTemplate } from "./default-templates";
import { generateRandomSecret } from "./settings";

import type { AppDb } from "./db";

export interface D1Executor {
  prepare: (sql: string) => {
    bind: (...args: unknown[]) => { run: () => Promise<unknown> };
    first?: <T>() => Promise<T | null>;
  };
}

export async function registerDefaultAdmin(client: D1Executor): Promise<void> {
  const password = await hashPassword("admin123");
  const now = Date.now();
  await client
    .prepare(
      `INSERT INTO users (id, username, email, password, name, role, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      crypto.randomUUID(),
      "admin",
      "admin@nawra.com",
      password,
      "Administrator Nawra",
      "admin",
      now,
      now
    )
    .run();
}

export async function registerDefaultHeaderAndFooter(client: D1Executor): Promise<void> {
  const now = Date.now();
  const headerTpl = getDefaultHeaderTemplate();
  const headerPrep = client.prepare("SELECT count(*) as count FROM headers");
  const headerRes = headerPrep.first ? await headerPrep.first<{ count: number }>() : null;
  if (!headerRes || headerRes.count === 0) {
    await client
      .prepare(
        `INSERT INTO headers (id, title, content_json, content_html, is_active, created_at, updated_at)
         VALUES (?, ?, ?, ?, 1, ?, ?)`
      )
      .bind(
        crypto.randomUUID(),
        headerTpl.title,
        headerTpl.contentJson,
        headerTpl.contentHtml,
        now,
        now
      )
      .run();
  } else {
    await client
      .prepare(
        `UPDATE headers SET title = ?, content_json = ?, content_html = ?, updated_at = ?
         WHERE title IN ('Header Utama', 'Nawra Header')
           AND (content_json NOT LIKE '%header-brand%' OR content_json LIKE '%#2563eb%' OR content_json LIKE '%/dashboard%')`
      )
      .bind(headerTpl.title, headerTpl.contentJson, headerTpl.contentHtml, now)
      .run();
  }

  const footerTpl = getDefaultFooterTemplate();
  const footerPrep = client.prepare("SELECT count(*) as count FROM footers");
  const footerRes = footerPrep.first ? await footerPrep.first<{ count: number }>() : null;
  if (!footerRes || footerRes.count === 0) {
    await client
      .prepare(
        `INSERT INTO footers (id, title, content_json, content_html, is_active, created_at, updated_at)
         VALUES (?, ?, ?, ?, 1, ?, ?)`
      )
      .bind(
        crypto.randomUUID(),
        footerTpl.title,
        footerTpl.contentJson,
        footerTpl.contentHtml,
        now,
        now
      )
      .run();
  } else {
    await client
      .prepare(
        `UPDATE footers SET title = ?, content_json = ?, content_html = ?, updated_at = ?
         WHERE title IN ('Footer Utama', 'Nawra Footer')
           AND (content_json NOT LIKE '%footer-brand%' OR content_json LIKE '%#2563eb%' OR content_json LIKE '%/dashboard%')`
      )
      .bind(footerTpl.title, footerTpl.contentJson, footerTpl.contentHtml, now)
      .run();
  }

  const homeTpl = getDefaultHomeTemplate();
  const homePrep = client.prepare("SELECT count(*) as count FROM homepages");
  const homeRes = homePrep.first ? await homePrep.first<{ count: number }>() : null;
  if (!homeRes || homeRes.count === 0) {
    await client
      .prepare(
        `INSERT INTO homepages (id, title, content_json, content_html, is_active, created_at, updated_at)
         VALUES (?, ?, ?, ?, 1, ?, ?)`
      )
      .bind(crypto.randomUUID(), homeTpl.title, homeTpl.contentJson, homeTpl.contentHtml, now, now)
      .run();
  } else {
    await client
      .prepare(
        `UPDATE homepages SET title = ?, content_json = ?, content_html = ?, updated_at = ?
         WHERE title IN ('Beranda Utama', 'Nawra Laman Utama')
           AND (content_json NOT LIKE '%hero-section%' OR content_json LIKE '%hero-editor-image%' OR content_json LIKE '%#2563eb%' OR content_json LIKE '%/dashboard%')`
      )
      .bind(homeTpl.title, homeTpl.contentJson, homeTpl.contentHtml, now)
      .run();
  }
}

export async function registerDefaultSettings(client: D1Executor): Promise<void> {
  const now = Date.now();
  const defaults: Array<[string, string]> = [
    ["jwt_secret", generateRandomSecret()],
    ["site_title", "Nawra CMS"],
    [
      "site_description",
      "Sistem Manajemen Konten (CMS) Visual Modern tanpa koding di Cloudflare Edge."
    ],
    ["site_icon", "lucide:sparkles"],
    ["favicon", "/favicon.svg"]
  ];

  for (const [id, value] of defaults) {
    await client
      .prepare(
        `INSERT OR IGNORE INTO settings (id, value, created_at, updated_at)
         VALUES (?, ?, ?, ?)`
      )
      .bind(id, value, now, now)
      .run();
  }
}

export async function seedInitialAdmin(db: AppDb, d1?: D1Database): Promise<void> {
  await ensureTables(d1);
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
