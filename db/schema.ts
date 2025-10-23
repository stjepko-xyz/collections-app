import { integer, pgTable, varchar } from "drizzle-orm/pg-core";

export const collectionsTable = pgTable("collections", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  description: varchar({ length: 100 }).notNull(),
});
