import { getItems } from "@/actions/items";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { columns } from "@/components/ItemsColumns";
import { ItemsTable } from "@/components/ItemsTable";
import { Boxes } from "lucide-react";
import { Card } from "@/components/ui/card";

export default async function Page() {
  const items = await getItems();
  console.log(items);
  return (
    <main className="flex flex-col gap-4 h-full">
      <div className="flex justify-between">
        <div className="flex items-center gap-4">
          <Boxes
            strokeWidth={1}
            width={32}
            height={32}
            className="text-violet-500"
          />
          <div>
            <h1 className="text-xl font-semibold">My Items</h1>
            <p className="text-muted-foreground">Manage your items here</p>
          </div>
        </div>
        <div className="header flex items-end">
          <Button variant={"outline"} asChild>
            <Link href="/items/new">New</Link>
          </Button>
        </div>
      </div>
      <Card className="p-2 flex-1 overflow-hidden">
        <ItemsTable columns={columns} data={items?.data} />
      </Card>
    </main>
  );
}
