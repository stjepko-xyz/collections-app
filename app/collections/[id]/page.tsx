import { getCollectionById } from "@/actions/collections";
import { columns } from "@/components/ItemsColumns";
import { ItemsTable } from "@/components/ItemsTable";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Folder } from "lucide-react";
import Link from "next/link";

export default async function Page({ params }) {
  const { id: paramId } = params;
  const collection = await getCollectionById(paramId);
  const { id, name, description, collectionsToItems } = collection.data;
  console.log(collectionsToItems);
  const items = collectionsToItems.map((cti) => cti.item);

  return (
    <main className="flex flex-col gap-4 h-full">
      <div className="flex justify-between">
        <div className="flex items-center gap-4">
          <Folder
            strokeWidth={1}
            width={32}
            height={32}
            className="text-primary"
          />
          <div>
            <h1 className="text-xl font-semibold">{name}</h1>
            <p className="text-muted-foreground">{description}</p>
          </div>
        </div>
        <div className="header flex items-end gap-2">
          <Button variant={"ghost"} asChild>
            <Link href={`/collections`}>Back</Link>
          </Button>
          <Button variant={"outline"} asChild>
            <Link href={`/collections/${id}/edit`}>Edit</Link>
          </Button>
        </div>
      </div>
      <Card className="p-2 flex-1 overflow-hidden gap-2">
        <p className="text-gray-700 text-sm">Items</p>
        <ItemsTable data={items} columns={columns} />
      </Card>
    </main>
  );
}
