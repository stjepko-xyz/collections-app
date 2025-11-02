import { getCollections } from "@/actions/collections";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const collections = await getCollections();
    return NextResponse.json(collections);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch collections" },
      { status: 500 }
    );
  }
};
