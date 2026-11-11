import { hashPassword } from "./crypto";
import { getDefaultHomeTemplate } from "./default-home-template";
import { getDefaultFooterTemplate, getDefaultHeaderTemplate } from "./default-templates";
import { generateRandomSecret } from "./settings";

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
  const headerPrep = client.prepare("SELECT count(*) as count FROM headers");
  const headerRes = headerPrep.first ? await headerPrep.first<{ count: number }>() : null;
  if (!headerRes || headerRes.count === 0) {
    const { title, contentJson, contentHtml } = getDefaultHeaderTemplate();
    const now = Date.now();
    await client
      .prepare(
        `INSERT INTO headers (id, title, content_json, content_html, is_active, created_at, updated_at)
         VALUES (?, ?, ?, ?, 1, ?, ?)`
      )
      .bind(crypto.randomUUID(), title, contentJson, contentHtml, now, now)
      .run();
  }

  const footerPrep = client.prepare("SELECT count(*) as count FROM footers");
  const footerRes = footerPrep.first ? await footerPrep.first<{ count: number }>() : null;
  if (!footerRes || footerRes.count === 0) {
    const { title, contentJson, contentHtml } = getDefaultFooterTemplate();
    const now = Date.now();
    await client
      .prepare(
        `INSERT INTO footers (id, title, content_json, content_html, is_active, created_at, updated_at)
         VALUES (?, ?, ?, ?, 1, ?, ?)`
      )
      .bind(crypto.randomUUID(), title, contentJson, contentHtml, now, now)
      .run();
  }

  const homePrep = client.prepare("SELECT count(*) as count FROM homepages");
  const homeRes = homePrep.first ? await homePrep.first<{ count: number }>() : null;
  if (!homeRes || homeRes.count === 0) {
    const { title, contentJson, contentHtml } = getDefaultHomeTemplate();
    const now = Date.now();
    await client
      .prepare(
        `INSERT INTO homepages (id, title, content_json, content_html, is_active, created_at, updated_at)
         VALUES (?, ?, ?, ?, 1, ?, ?)`
      )
      .bind(crypto.randomUUID(), title, contentJson, contentHtml, now, now)
      .run();
  }
}

export async function registerDefaultSettings(client: D1Executor): Promise<void> {
  const now = Date.now();
  const defaults: Array<[string, string]> = [
    ["jwt_secret", generateRandomSecret()],
    ["site_title", "Nawra CMS — Visual No-Code Canvas Studio"],
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
