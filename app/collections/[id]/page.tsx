import { getCollectionById } from "@/actions/collections";
import { columns } from "@/components/ItemsColumns";
import { ItemsTable } from "@/components/ItemsTable";
import { Button } from "@/components/ui/button";
import { Folder } from "lucide-react";
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
      <div className="flex items-center gap-4">
        <Folder strokeWidth={1} width={48} height={48} />
        <div>
          <h1 className="text-3xl font-semibold">{name}</h1>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <p className="text-muted-foreground">Description</p>
          <p>{description}</p>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-muted-foreground">Items</p>
          <ItemsTable data={items} columns={columns} />
        </div>
      </div>
    </main>
  );
}
