import fs from "node:fs";
import path from "node:path";
import process from "node:process";

import { getLibsqlClient } from "./index";

interface MigrationJournal {
  entries: Array<{
    idx: number;
    when: number;
    tag: string;
  }>;
}

export async function migrate() {
  console.log("Running migrations via Turso / LibSQL client...");
  const client = getLibsqlClient();

  try {
    await client.execute(
      `CREATE TABLE IF NOT EXISTS __drizzle_migrations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        hash text NOT NULL,
        created_at numeric
      )`
    );

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

    const executedRes = await client.execute("SELECT hash FROM __drizzle_migrations");
    const executedHashes = new Set(executedRes.rows.map((r) => String(r.hash)));

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
        await client.execute(stmt);
      }

      await client.execute({
        sql: "INSERT INTO __drizzle_migrations (hash, created_at) VALUES (?, ?)",
        args: [fileName, Date.now()]
      });

      console.timeEnd(`Migration ${fileName}`);
      console.log(`✅ ${fileName} applied successfully.`);
    }

    console.log("🎉 All migrations applied to Turso / LibSQL database.");
  } catch (err) {
    console.error("Migration error:", err);
    throw err;
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
