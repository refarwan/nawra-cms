import { getLibsqlClient } from "../../db/index";

export { getDb } from "../../db/index";
export type { AppDb } from "../../db/index";

let pagesTableEnsured = false;

export async function ensureTables(): Promise<void> {
  if (pagesTableEnsured) return;
  const client = getLibsqlClient();

  try {
    await client.execute(`CREATE TABLE IF NOT EXISTS pages (
      id text PRIMARY KEY NOT NULL,
      title text NOT NULL,
      slug text NOT NULL,
      description text DEFAULT '' NOT NULL,
      status text DEFAULT 'draft' NOT NULL,
      content_json text NOT NULL,
      content_html text NOT NULL,
      created_at integer NOT NULL,
      updated_at integer NOT NULL
    )`);
    await client.execute(`CREATE UNIQUE INDEX IF NOT EXISTS pages_slug_unique ON pages (slug)`);

    const tableInfo = await client.execute(`PRAGMA table_info(pages)`);
    const hasDescription = tableInfo.rows.some((col) => col.name === "description");
    if (!hasDescription) {
      await client.execute(`ALTER TABLE pages ADD COLUMN description text DEFAULT '' NOT NULL`);
    }

    await client.execute(`CREATE TABLE IF NOT EXISTS article_categories (
      id text PRIMARY KEY NOT NULL,
      name text NOT NULL,
      slug text NOT NULL,
      description text DEFAULT '' NOT NULL,
      author_id text REFERENCES users(id) ON DELETE SET NULL,
      created_at integer NOT NULL,
      updated_at integer NOT NULL
    )`);
    await client.execute(
      `CREATE UNIQUE INDEX IF NOT EXISTS article_categories_slug_unique ON article_categories (slug)`
    );
    const catInfo = await client.execute(`PRAGMA table_info(article_categories)`);
    if (!catInfo.rows.some((col) => col.name === "author_id")) {
      await client.execute(
        `ALTER TABLE article_categories ADD COLUMN author_id text REFERENCES users(id) ON DELETE SET NULL`
      );
    }

    await client.execute(`CREATE TABLE IF NOT EXISTS articles (
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
    )`);
    await client.execute(`DROP INDEX IF EXISTS articles_slug_unique`);
    await client.execute(
      `CREATE UNIQUE INDEX IF NOT EXISTS articles_category_slug_idx ON articles (category_id, slug) WHERE category_id IS NOT NULL`
    );
    await client.execute(
      `CREATE UNIQUE INDEX IF NOT EXISTS articles_null_category_slug_idx ON articles (slug) WHERE category_id IS NULL`
    );

    const articleInfo = await client.execute(`PRAGMA table_info(articles)`);
    const articleCols = new Set(articleInfo.rows.map((col) => col.name));
    if (!articleCols.has("content_json")) {
      await client.execute(`ALTER TABLE articles ADD COLUMN content_json text DEFAULT '' NOT NULL`);
    }
    if (!articleCols.has("content_html")) {
      await client.execute(`ALTER TABLE articles ADD COLUMN content_html text DEFAULT '' NOT NULL`);
    }
    if (!articleCols.has("author_id")) {
      await client.execute(
        `ALTER TABLE articles ADD COLUMN author_id text REFERENCES users(id) ON DELETE SET NULL`
      );
    }

    const userInfo = await client.execute(`PRAGMA table_info(users)`);
    const userCols = new Set(userInfo.rows.map((col) => col.name));
    if (!userCols.has("avatar_url")) {
      await client.execute(`ALTER TABLE users ADD COLUMN avatar_url text DEFAULT '' NOT NULL`);
    }

    await client.execute(`CREATE TABLE IF NOT EXISTS image_library (
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
    )`);
    await client.execute(
      `CREATE UNIQUE INDEX IF NOT EXISTS image_library_r2_key_unique ON image_library (r2_key)`
    );
    const imgInfo = await client.execute(`PRAGMA table_info(image_library)`);
    if (!imgInfo.rows.some((col) => col.name === "uploader_id")) {
      await client.execute(
        `ALTER TABLE image_library ADD COLUMN uploader_id text REFERENCES users(id) ON DELETE SET NULL`
      );
    }

    pagesTableEnsured = true;
  } catch (err) {
    console.warn("ensureTables warning:", err);
  }
}
