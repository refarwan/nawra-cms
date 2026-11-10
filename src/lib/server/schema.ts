import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: text("name").notNull(),
  role: text("role", { enum: ["admin", "editor"] })
    .notNull()
    .default("admin"),
  createdAt: integer("created_at").notNull()
});

export const sessions = sqliteTable("sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expiresAt: integer("expires_at").notNull()
});

export const headers = sqliteTable("headers", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  isActive: integer("is_active").notNull().default(0),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull()
});

export const footers = sqliteTable("footers", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  isActive: integer("is_active").notNull().default(0),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull()
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;
export type Header = typeof headers.$inferSelect;
export type NewHeader = typeof headers.$inferInsert;
export type Footer = typeof footers.$inferSelect;
export type NewFooter = typeof footers.$inferInsert;

export const TABLE_STATEMENTS = [
  `CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'admin',
    created_at INTEGER NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires_at INTEGER NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS headers (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    is_active INTEGER NOT NULL DEFAULT 0,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS footers (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    is_active INTEGER NOT NULL DEFAULT 0,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
  )`
];
