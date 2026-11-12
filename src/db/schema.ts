import { integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name"),
  avatarUrl: text("avatar_url").notNull().default(""),
  role: text("role", { enum: ["admin", "editor"] })
    .notNull()
    .default("editor"),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull()
});

export const refreshTokens = sqliteTable("refresh_tokens", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expiresAt: integer("expires_at").notNull(),
  createdAt: integer("created_at").notNull()
});

export const headers = sqliteTable("headers", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  title: text("title").notNull(),
  contentJson: text("content_json").notNull(),
  contentHtml: text("content_html").notNull(),
  isActive: integer("is_active").notNull().default(0),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull()
});

export const footers = sqliteTable("footers", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  title: text("title").notNull(),
  contentJson: text("content_json").notNull(),
  contentHtml: text("content_html").notNull(),
  isActive: integer("is_active").notNull().default(0),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull()
});

export const homepages = sqliteTable("homepages", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  title: text("title").notNull(),
  contentJson: text("content_json").notNull(),
  contentHtml: text("content_html").notNull(),
  isActive: integer("is_active").notNull().default(0),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull()
});

export const pages = sqliteTable("pages", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull().default(""),
  status: text("status", { enum: ["draft", "published"] })
    .notNull()
    .default("draft"),
  contentJson: text("content_json").notNull(),
  contentHtml: text("content_html").notNull(),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull()
});

export const articleCategories = sqliteTable("article_categories", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull().default(""),
  authorId: text("author_id").references(() => users.id, { onDelete: "set null" }),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull()
});

export const articles = sqliteTable(
  "articles",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    title: text("title").notNull(),
    slug: text("slug").notNull(),
    excerpt: text("excerpt").notNull().default(""),
    contentJson: text("content_json").notNull().default(""),
    contentHtml: text("content_html").notNull().default(""),
    coverImage: text("cover_image").notNull().default(""),
    categoryId: text("category_id").references(() => articleCategories.id, {
      onDelete: "set null"
    }),
    authorId: text("author_id").references(() => users.id, { onDelete: "set null" }),
    status: text("status", { enum: ["draft", "published"] })
      .notNull()
      .default("draft"),
    publishedAt: integer("published_at"),
    createdAt: integer("created_at").notNull(),
    updatedAt: integer("updated_at").notNull()
  },
  (table) => [uniqueIndex("articles_category_slug_idx").on(table.categoryId, table.slug)]
);

export const imageLibrary = sqliteTable("image_library", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  altText: text("alt_text").notNull().default(""),
  r2Key: text("r2_key").notNull().unique(),
  url: text("url").notNull(),
  mimeType: text("mime_type").notNull(),
  size: integer("size").notNull(),
  width: integer("width").notNull().default(0),
  height: integer("height").notNull().default(0),
  isResized: integer("is_resized").notNull().default(0),
  uploaderId: text("uploader_id").references(() => users.id, { onDelete: "set null" }),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull()
});

export const settings = sqliteTable("settings", {
  id: text("id").primaryKey(),
  value: text("value").notNull(),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull()
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type RefreshToken = typeof refreshTokens.$inferSelect;
export type NewRefreshToken = typeof refreshTokens.$inferInsert;
export type Header = typeof headers.$inferSelect;
export type NewHeader = typeof headers.$inferInsert;
export type Footer = typeof footers.$inferSelect;
export type NewFooter = typeof footers.$inferInsert;
export type Homepage = typeof homepages.$inferSelect;
export type NewHomepage = typeof homepages.$inferInsert;
export type Page = typeof pages.$inferSelect;
export type NewPage = typeof pages.$inferInsert;
export type ArticleCategory = typeof articleCategories.$inferSelect;
export type NewArticleCategory = typeof articleCategories.$inferInsert;
export type Article = typeof articles.$inferSelect;
export type NewArticle = typeof articles.$inferInsert;
export type ImageLibraryItem = typeof imageLibrary.$inferSelect;
export type NewImageLibraryItem = typeof imageLibrary.$inferInsert;
export type Setting = typeof settings.$inferSelect;
export type NewSetting = typeof settings.$inferInsert;
