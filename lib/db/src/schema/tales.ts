import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const categoriesTable = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  emoji: text("emoji"),
});

export const talesTable = pgTable("tales", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  imageUrl: text("image_url").notNull(),
  category: text("category").notNull(),
  ageGroup: text("age_group").notNull(),
  duration: integer("duration").notNull().default(5),
  isFeatured: boolean("is_featured").notNull().default(false),
  author: text("author"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertCategorySchema = createInsertSchema(categoriesTable).omit({ id: true });
export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categoriesTable.$inferSelect;

export const insertTaleSchema = createInsertSchema(talesTable).omit({ id: true, createdAt: true });
export type InsertTale = z.infer<typeof insertTaleSchema>;
export type Tale = typeof talesTable.$inferSelect;
