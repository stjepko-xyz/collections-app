"use server";

import { db } from "@/db/drizzle";
import { collectionsTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// Types
export type Collection = typeof collectionsTable.$inferSelect;
export type NewCollection = typeof collectionsTable.$inferInsert;

/**
 * Create a new collection
 */
export async function createCollection(data: NewCollection) {
  try {
    const [collection] = await db
      .insert(collectionsTable)
      .values(data)
      .returning();

    // Revalidate the collections page to show the new collection
    revalidatePath("/collections");

    return { success: true, data: collection };
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
    const collections = await db.select().from(collectionsTable);
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
    const [collection] = await db
      .select()
      .from(collectionsTable)
      .where(eq(collectionsTable.id, id));

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
  data: Partial<NewCollection>
) {
  try {
    const [collection] = await db
      .update(collectionsTable)
      .set(data)
      .where(eq(collectionsTable.id, id))
      .returning();

    if (!collection) {
      return { success: false, error: "Collection not found" };
    }

    // Revalidate relevant pages
    revalidatePath("/collections");
    revalidatePath(`/collections/${id}`);

    return { success: true, data: collection };
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
