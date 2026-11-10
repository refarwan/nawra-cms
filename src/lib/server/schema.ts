// Database table schema definitions and interfaces

export interface UserRecord {
  id: string;
  email: string;
  password_hash: string;
  name: string;
  role: "admin" | "editor";
  created_at: number;
}

export interface SessionRecord {
  id: string;
  user_id: string;
  expires_at: number;
}

export interface HeaderRecord {
  id: string;
  title: string;
  content: string;
  is_active: number;
  created_at: number;
  updated_at: number;
}

export interface FooterRecord {
  id: string;
  title: string;
  content: string;
  is_active: number;
  created_at: number;
  updated_at: number;
}

export const SCHEMA_SQL = `
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'admin',
    created_at INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires_at INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS headers (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    is_active INTEGER NOT NULL DEFAULT 0,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS footers (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    is_active INTEGER NOT NULL DEFAULT 0,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
  );
`;
