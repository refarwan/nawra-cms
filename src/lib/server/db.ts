import { getD1Binding } from "../../db/index";

export { getDb } from "../../db/index";
export type { AppDb } from "../../db/index";

let pagesTableEnsured = false;

export async function ensureTables(d1?: D1Database): Promise<void> {
  const client = getD1Binding(d1);
  if (!client || pagesTableEnsured) return;
  try {
    await client
      .prepare(
        `CREATE TABLE IF NOT EXISTS pages (
          id text PRIMARY KEY NOT NULL,
          title text NOT NULL,
          slug text NOT NULL,
          description text DEFAULT '' NOT NULL,
          status text DEFAULT 'draft' NOT NULL,
          content_json text NOT NULL,
          content_html text NOT NULL,
          created_at integer NOT NULL,
          updated_at integer NOT NULL
        )`
      )
      .run();
    await client
      .prepare(`CREATE UNIQUE INDEX IF NOT EXISTS pages_slug_unique ON pages (slug)`)
      .run();

    const tableInfo = await client.prepare(`PRAGMA table_info(pages)`).all<{ name: string }>();
    const hasDescription = tableInfo.results?.some((col) => col.name === "description");
    if (!hasDescription) {
      await client
        .prepare(`ALTER TABLE pages ADD COLUMN description text DEFAULT '' NOT NULL`)
        .run();
    }

    await client
      .prepare(
        `CREATE TABLE IF NOT EXISTS article_categories (
          id text PRIMARY KEY NOT NULL,
          name text NOT NULL,
          slug text NOT NULL,
          description text DEFAULT '' NOT NULL,
          author_id text REFERENCES users(id) ON DELETE SET NULL,
          created_at integer NOT NULL,
          updated_at integer NOT NULL
        )`
      )
      .run();
    await client
      .prepare(
        `CREATE UNIQUE INDEX IF NOT EXISTS article_categories_slug_unique ON article_categories (slug)`
      )
      .run();
    const catInfo = await client
      .prepare(`PRAGMA table_info(article_categories)`)
      .all<{ name: string }>();
    if (!catInfo.results?.some((col) => col.name === "author_id")) {
      await client
        .prepare(
          `ALTER TABLE article_categories ADD COLUMN author_id text REFERENCES users(id) ON DELETE SET NULL`
        )
        .run();
    }

    await client
      .prepare(
        `CREATE TABLE IF NOT EXISTS articles (
          id text PRIMARY KEY NOT NULL,
          title text NOT NULL,
          slug text NOT NULL,
          excerpt text DEFAULT '' NOT NULL,
          content_json text DEFAULT '' NOT NULL,
          content_html text DEFAULT '' NOT NULL,
          cover_image text DEFAULT '' NOT NULL,
          category_id text REFERENCES article_categories(id) ON DELETE SET NULL,
          author_id text REFERENCES users(id) ON DELETE SET NULL,
          status text DEFAULT 'draft' NOT NULL,
          published_at integer,
          created_at integer NOT NULL,
          updated_at integer NOT NULL
        )`
      )
      .run();
    await client.prepare(`DROP INDEX IF EXISTS articles_slug_unique`).run();
    await client
      .prepare(
        `CREATE UNIQUE INDEX IF NOT EXISTS articles_category_slug_idx ON articles (category_id, slug) WHERE category_id IS NOT NULL`
      )
      .run();
    await client
      .prepare(
        `CREATE UNIQUE INDEX IF NOT EXISTS articles_null_category_slug_idx ON articles (slug) WHERE category_id IS NULL`
      )
      .run();

    const articleInfo = await client.prepare(`PRAGMA table_info(articles)`).all<{ name: string }>();
    const articleCols = new Set(articleInfo.results?.map((col) => col.name) ?? []);
    if (!articleCols.has("content_json")) {
      await client
        .prepare(`ALTER TABLE articles ADD COLUMN content_json text DEFAULT '' NOT NULL`)
        .run();
    }
    if (!articleCols.has("content_html")) {
      await client
        .prepare(`ALTER TABLE articles ADD COLUMN content_html text DEFAULT '' NOT NULL`)
        .run();
    }
    if (!articleCols.has("author_id")) {
      await client
        .prepare(
          `ALTER TABLE articles ADD COLUMN author_id text REFERENCES users(id) ON DELETE SET NULL`
        )
        .run();
    }

    const userInfo = await client.prepare(`PRAGMA table_info(users)`).all<{ name: string }>();
    const userCols = new Set(userInfo.results?.map((col) => col.name) ?? []);
    if (!userCols.has("avatar_url")) {
      await client
        .prepare(`ALTER TABLE users ADD COLUMN avatar_url text DEFAULT '' NOT NULL`)
        .run();
    }

    await client
      .prepare(
        `CREATE TABLE IF NOT EXISTS image_library (
          id text PRIMARY KEY NOT NULL,
          name text NOT NULL,
          alt_text text DEFAULT '' NOT NULL,
          r2_key text NOT NULL,
          url text NOT NULL,
          mime_type text NOT NULL,
          size integer NOT NULL,
          width integer DEFAULT 0 NOT NULL,
          height integer DEFAULT 0 NOT NULL,
          is_resized integer DEFAULT 0 NOT NULL,
          uploader_id text REFERENCES users(id) ON DELETE SET NULL,
          created_at integer NOT NULL,
          updated_at integer NOT NULL
        )`
      )
      .run();
    await client
      .prepare(
        `CREATE UNIQUE INDEX IF NOT EXISTS image_library_r2_key_unique ON image_library (r2_key)`
      )
      .run();
    const imgInfo = await client
      .prepare(`PRAGMA table_info(image_library)`)
      .all<{ name: string }>();
    if (!imgInfo.results?.some((col) => col.name === "uploader_id")) {
      await client
        .prepare(
          `ALTER TABLE image_library ADD COLUMN uploader_id text REFERENCES users(id) ON DELETE SET NULL`
        )
        .run();
    }

    pagesTableEnsured = true;
  } catch (err) {
    console.warn("ensureTables warning:", err);
  }
}
