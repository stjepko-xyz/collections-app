import { integer, pgTable, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const collectionsTable = pgTable("collections", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  description: varchar({ length: 100 }).notNull(),
  category: varchar({ length: 100 }).notNull(),
  tags: varchar({ length: 255 }).array().notNull(),
});

// Generate base schema from Drizzle table and add custom validations
export const insertCollectionSchema = createInsertSchema(collectionsTable, {
  name: z
    .string()
    .min(5, "Collection name must be at least 5 characters.")
    .max(32, "Collection name must be at most 32 characters."),
  description: z
    .string()
    .min(20, "Collection description must be at least 20 characters.")
    .max(100, "Collection description must be at most 100 characters."),
  category: z.string().nonempty("Category is required."),
  tags: z
    .array(z.string())
    .min(1, "At least one tag must be selected.")
    .max(5, "You can select up to 5 tags."),
});
