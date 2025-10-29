"use server";

import { db } from "@/db/drizzle";
import { itemsTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getItems() {
  try {
    const items = await db.select().from(itemsTable);

    return { success: true, data: items };
  } catch (error) {
    console.error("Error fetching items:", error);
    return { success: false, error: "Failed to fetch items." };
  }
}
