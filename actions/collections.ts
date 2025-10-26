"use server";

import { db } from "@/db/drizzle";
import { collectionsTable, itemsTable } from "@/db/schema";
import { eq } from "drizzle-orm";
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
      const [collection] = await tx
        .insert(collectionsTable)
        .values(collectionData)
        .returning();

      if (items && items.length > 0) {
        const itemsWithCollectionId = items
          .filter((item) => item.name.trim() !== "")
          .map((item) => ({
            name: item.name,
            collectionId: collection.id,
          }));

        if (itemsWithCollectionId.length > 0) {
          await tx.insert(itemsTable).values(itemsWithCollectionId);
        }
      }

      return collection;
    });

    // Revalidate the collections page to show the new collection
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
        items: true,
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
        items: true,
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
        // Delete existing items
        await tx.delete(itemsTable).where(eq(itemsTable.collectionId, id));

        // Insert new items if any
        if (items.length > 0) {
          const itemsWithCollectionId = items
            .filter((item) => item.name.trim() !== "")
            .map((item) => ({
              name: item.name,
              collectionId: collection.id,
            }));

          if (itemsWithCollectionId.length > 0) {
            await tx.insert(itemsTable).values(itemsWithCollectionId);
          }
        }
      }

      return collection;
    });

    // Revalidate relevant pages
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

    // Revalidate the collections page
    revalidatePath("/collections");

    return { success: true };
  } catch (error) {
    console.error("Error deleting collection:", error);
    return { success: false, error: "Failed to delete collection" };
  }
}
