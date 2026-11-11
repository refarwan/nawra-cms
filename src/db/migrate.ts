import fs from "node:fs";
import path from "node:path";
import process from "node:process";

import { getPlatformProxy } from "wrangler";

interface MigrationJournal {
  entries: Array<{
    idx: number;
    when: number;
    tag: string;
  }>;
}

export async function migrate() {
  console.log("Running D1 migrations via Wrangler DB binding...");

  const { env, dispose } = await getPlatformProxy<{ DB: D1Database }>({
    configPath: "wrangler.jsonc"
  });

  try {
    const db = env.DB;
    if (!db) {
      throw new Error("Binding DB tidak ditemukan di wrangler.jsonc");
    }

    await db
      .prepare(
        `CREATE TABLE IF NOT EXISTS __drizzle_migrations (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          hash text NOT NULL,
          created_at numeric
        )`
      )
      .run();

    const drizzleDir = path.resolve(process.cwd(), "drizzle");
    const journalPath = path.join(drizzleDir, "meta", "_journal.json");

    const tags = fs.existsSync(journalPath)
      ? (JSON.parse(fs.readFileSync(journalPath, "utf-8")) as MigrationJournal).entries.map(
          (e) => e.tag
        )
      : fs
          .readdirSync(drizzleDir)
          .filter((f) => f.endsWith(".sql"))
          .sort();

    const executedRes = await db
      .prepare("SELECT hash FROM __drizzle_migrations")
      .all<{ hash: string }>();
    const executedHashes = new Set((executedRes.results || []).map((r) => r.hash));

    for (const tag of tags) {
      const fileName = tag.endsWith(".sql") ? tag : `${tag}.sql`;
      if (executedHashes.has(fileName)) {
        console.log(`⏩ Migration ${fileName} already applied.`);
        continue;
      }

      const filePath = path.join(drizzleDir, fileName);
      if (!fs.existsSync(filePath)) continue;

      console.time(`Migration ${fileName}`);
      console.log(`Applying migration ${fileName}...`);

      const sqlContent = fs.readFileSync(filePath, "utf-8");
      const statements = sqlContent
        .split("--> statement-breakpoint")
        .map((s) => s.trim())
        .filter(Boolean);

      for (const stmt of statements) {
        await db.prepare(stmt).run();
      }

      await db
        .prepare("INSERT INTO __drizzle_migrations (hash, created_at) VALUES (?, ?)")
        .bind(fileName, Date.now())
        .run();

      console.timeEnd(`Migration ${fileName}`);
      console.log(`✅ ${fileName} applied successfully.`);
    }

    console.log("🎉 All migrations applied to Cloudflare D1 binding (DB).");
  } finally {
    await dispose();
  }
}

if (process.argv[1]?.includes("migrate")) {
  migrate()
    .then(() => {
      console.log("Migration process finished!");
      process.exit(0);
    })
    .catch((err) => {
      console.error("Migration failed:", err);
      process.exit(1);
    });
}
