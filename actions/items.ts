"use server";

import { db } from "@/db/drizzle";
import { itemsTable } from "@/db/schema";
import { da } from "date-fns/locale";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { success } from "zod";

export const createItem = async (data) => {
  try {
    const [item] = await db.insert(itemsTable).values(data).returning();

    // Revalidate the items page to show the new item
    revalidatePath("/items");
    return { success: true, data: item };
  } catch (error) {
    console.error("Error creating items:", error);
    return { success: false, error: "Failed to create items." };
  }
};

export const getItems = async () => {
  try {
    const items = await db.select().from(itemsTable);

    return { success: true, data: items };
  } catch (error) {
    console.error("Error fetching items:", error);
    return { success: false, error: "Failed to fetch items." };
  }
};

export const getItemById = async (id) => {
  try {
    const [item] = await db
      .select()
      .from(itemsTable)
      .where(eq(itemsTable.id, id));

    return { success: true, data: item };
  } catch (error) {
    console.error("Error fetching item:", error);
    return { success: false, error: "Failed to fetch item." };
  }
};

export const updateItem = async (id, data) => {
  try {
    const [item] = await db
      .update(itemsTable)
      .set(data)
      .where(eq(itemsTable.id, id))
      .returning();

    revalidatePath("/items");

    return { success: true, data: item };
  } catch (error) {
    console.error("Error updating item:", error);
    return { success: false, error: "Failed to update item." };
  }
};

export const deleteItem = async (id) => {
  try {
    await db.delete(itemsTable).where(eq(itemsTable.id, id));

    revalidatePath("/items");

    return { success: true };
  } catch (error) {
    console.error("Error deleting item:", error);
    return { success: false, error: "Failed to delete item." };
  }
};
