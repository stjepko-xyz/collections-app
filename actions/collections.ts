"use server";

import { db } from "@/db/drizzle";
import {
  collectionsTable,
  itemsTable,
  collectionsToItemsTable,
} from "@/db/schema";
import { eq, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// Types
export type Collection = typeof collectionsTable.$inferSelect;
export type NewCollection = typeof collectionsTable.$inferInsert;

/**
 * Create a new collection
 */
export async function createCollection(
  data: NewCollection & { items?: any[] }
) {
  console.log("Creating collection with data:", data);
  try {
    const { items, ...collectionData } = data;

    const result = await db.transaction(async (tx) => {
      // 1. Create the collection
      const [collection] = await tx
        .insert(collectionsTable)
        .values(collectionData)
        .returning();

      // 2. Create or find items and link them to the collection
      if (items && items.length > 0) {
        const validItems = items.filter((item) => item.name.trim() !== "");

        if (validItems.length > 0) {
          await tx
            .insert(itemsTable)
            .values(validItems.map((item) => ({ name: item.name })))
            .onConflictDoNothing();

          // Fetch all items by name to get their IDs
          const itemNames = validItems.map((item) => item.name);
          const itemRecords = await tx.query.itemsTable.findMany({
            where: (items, { inArray }) => inArray(items.name, itemNames),
          });

          // Create junction table entries to link collection with items
          const junctionEntries = itemRecords.map((item) => ({
            collectionId: collection.id,
            itemId: item.id,
          }));

          await tx.insert(collectionsToItemsTable).values(junctionEntries);
        }
      }

      return collection;
    });

    revalidatePath("/collections");
    return { success: true, data: result };
  } catch (error) {
    console.error("Error creating collection:", error);
    return { success: false, error: "Failed to create collection" };
  }
}

/**
 * Get all collections
 */
export async function getCollections() {
  try {
    const collections = await db.query.collectionsTable.findMany({
      with: {
        collectionsToItems: {
          with: {
            item: true,
          },
        },
      },
    });
    return { success: true, data: collections };
  } catch (error) {
    console.error("Error fetching collections:", error);
    return { success: false, error: "Failed to fetch collections" };
  }
}

/**
 * Get a single collection by ID
 */
export async function getCollectionById(id: number) {
  try {
    const collection = await db.query.collectionsTable.findFirst({
      where: eq(collectionsTable.id, id),
      with: {
        collectionsToItems: {
          with: {
            item: true,
          },
        },
      },
    });

    if (!collection) {
      return { success: false, error: "Collection not found" };
    }

    return { success: true, data: collection };
  } catch (error) {
    console.error("Error fetching collection:", error);
    return { success: false, error: "Failed to fetch collection" };
  }
}

/**
 * Update a collection
 */
export async function updateCollection(
  id: number,
  data: Partial<NewCollection> & { items?: any[] }
) {
  try {
    const { items, ...collectionData } = data;

    const result = await db.transaction(async (tx) => {
      // Update the collection
      const [collection] = await tx
        .update(collectionsTable)
        .set(collectionData)
        .where(eq(collectionsTable.id, id))
        .returning();

      if (!collection) {
        throw new Error("Collection not found");
      }

      // If items are provided, replace all existing items
      if (items !== undefined) {
        // Delete existing junction table entries for this collection
        await tx
          .delete(collectionsToItemsTable)
          .where(eq(collectionsToItemsTable.collectionId, id));

        // Create or find items if any
        if (items.length > 0) {
          const validItems = items.filter((item) => item.name.trim() !== "");

          if (validItems.length > 0) {
            // Insert items, ignoring conflicts (duplicates)
            await tx
              .insert(itemsTable)
              .values(validItems.map((item) => ({ name: item.name })))
              .onConflictDoNothing();

            // Fetch all items by name to get their IDs
            const itemNames = validItems.map((item) => item.name);
            const itemRecords = await tx.query.itemsTable.findMany({
              where: (items, { inArray }) => inArray(items.name, itemNames),
            });

            // Create junction table entries to link collection with items
            const junctionEntries = itemRecords.map((item) => ({
              collectionId: collection.id,
              itemId: item.id,
            }));

            await tx.insert(collectionsToItemsTable).values(junctionEntries);
          }
        }
      }

      return collection;
    });

    revalidatePath("/collections");
    revalidatePath(`/collections/${id}`);

    return { success: true, data: result };
  } catch (error) {
    console.error("Error updating collection:", error);
    return { success: false, error: "Failed to update collection" };
  }
}

/**
 * Delete a collection
 */
export async function deleteCollection(id: number) {
  try {
    await db.delete(collectionsTable).where(eq(collectionsTable.id, id));

    revalidatePath("/collections");

    return { success: true };
  } catch (error) {
    console.error("Error deleting collection:", error);
    return { success: false, error: "Failed to delete collection" };
  }
}
