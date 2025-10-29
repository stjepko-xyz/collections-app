import { getCollectionById } from "@/actions/collections";
import { columns } from "@/components/ItemsColumns";
import { ItemsTable } from "@/components/ItemsTable";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Page({ params }) {
  const { id: paramId } = params;
  const collection = await getCollectionById(paramId);
  const { id, name, description, collectionsToItems } = collection.data;
  console.log(collectionsToItems);
  const items = collectionsToItems.map((cti) => cti.item);

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
      <div className="space-y-6">
        <div>
          <p className="text-muted-foreground">Name</p>
          <h2>{name}</h2>
        </div>
        <div>
          <p className="text-muted-foreground">Description</p>
          <p>{description}</p>
        </div>

        <ItemsTable data={items} columns={columns} />
      </div>
    </main>
  );
}
