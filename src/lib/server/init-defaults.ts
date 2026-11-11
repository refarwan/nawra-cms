import { hashPassword } from "./crypto";
import { getDefaultFooterTemplate, getDefaultHeaderTemplate } from "./default-templates";

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
}
