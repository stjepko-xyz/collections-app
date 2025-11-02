import { getItemById } from "@/actions/items";
import { Button } from "@/components/ui/button";
import { Box, Folder } from "lucide-react";
import Link from "next/link";

export default async function Page({ params }) {
  const { id: paramId } = params;
  console.log(paramId);
  const collection = await getItemById(paramId);
  const { id, name } = collection.data;
  return (
    <main>
      <div className="header flex gap-2 justify-end">
        <Button variant={"ghost"} asChild>
          <Link href={`/items`}>Back</Link>
        </Button>
        <Button variant={"outline"} asChild>
          <Link href={`/items/${id}/edit`}>Edit</Link>
        </Button>
      </div>
      <div className="flex items-center gap-4">
        <Box strokeWidth={1} width={48} height={48} />
        <div>
          <h1 className="text-3xl font-semibold">{name}</h1>
        </div>
      </div>
    </main>
  );
}
