"use server";

import { db } from "@/db/drizzle";
import { itemsTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

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
