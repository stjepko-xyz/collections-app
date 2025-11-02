import { getItems } from "@/actions/items";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const items = await getItems();
    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch items" },
      { status: 500 }
    );
  }
};
