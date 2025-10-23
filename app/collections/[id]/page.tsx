import { getCollectionById } from "@/actions/collections";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Page({ params }) {
  const { id: paramId } = params;
  console.log(paramId);
  const collection = await getCollectionById(paramId);
  const { id, name, description } = collection.data;
  return (
    <main>
      <div className="header flex gap-2 justify-end">
        <Button variant={"ghost"} asChild>
          <Link href={`/collections`}>Back</Link>
        </Button>
        <Button variant={"outline"} asChild>
          <Link href={`/collections/${id}/edit`}>Edit</Link>
        </Button>
      </div>
      <div className="space-y-2">
        <div>
          <p className="text-muted-foreground">Name</p>
          <h2>{name}</h2>
        </div>
        <div>
          <p className="text-muted-foreground">Description</p>
          <p>{description}</p>
        </div>
      </div>
    </main>
  );
}
