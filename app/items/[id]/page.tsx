import { getItemById } from "@/actions/items";
import { Button } from "@/components/ui/button";
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
      <div className="space-y-2">
        <div>
          <p className="text-muted-foreground">Name</p>
          <h2>{name}</h2>
        </div>
      </div>
    </main>
  );
}
