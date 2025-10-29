import { integer, pgTable, varchar, primaryKey } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { int, z } from "zod";

// Collections
export const collectionsTable = pgTable("collections", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  description: varchar({ length: 100 }).notNull(),
  category: varchar({ length: 100 }).notNull(),
  tags: varchar({ length: 255 }).array().notNull(),
});

export const collectionsRelations = relations(collectionsTable, ({ many }) => ({
  collectionsToItems: many(collectionsToItemsTable),
}));

// Items
export const itemsTable = pgTable("items", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull().unique(),
});

export const itemsRelations = relations(itemsTable, ({ many }) => ({
  collectionsToItems: many(collectionsToItemsTable),
}));

// CollectionItems - Junction Table
export const collectionsToItemsTable = pgTable(
  "collections_to_items",
  {
    collectionId: integer("collection_id")
      .notNull()
      .references(() => collectionsTable.id, { onDelete: "cascade" }),
    itemId: integer("item_id")
      .notNull()
      .references(() => itemsTable.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.collectionId, t.itemId] })]
);

export const collectionsToItemsRelations = relations(
  collectionsToItemsTable,
  ({ one }) => ({
    collection: one(collectionsTable, {
      fields: [collectionsToItemsTable.collectionId],
      references: [collectionsTable.id],
    }),
    item: one(itemsTable, {
      fields: [collectionsToItemsTable.itemId],
      references: [itemsTable.id],
    }),
  })
);

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
}).extend({
  items: z
    .array(
      z.object({
        name: z.string().refine((val) => val.trim().length > 0, {
          message: "Item name is required",
        }),
      })
    )
    .default([]),
});

export const insertItemSchema = createInsertSchema(itemsTable, {
  name: z
    .string()
    .refine((val) => val.trim().length > 0, {
      message: "Item name is required",
    })
    .refine((val) => val.trim().length >= 5, {
      message: "Item name must be at least 5 characters.",
    })
    .refine((val) => val.trim().length <= 32, {
      message: "Item name must be at most 32 characters.",
    }),
});
