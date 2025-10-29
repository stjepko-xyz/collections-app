import { getItems } from "@/actions/items";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { columns } from "@/components/ItemsColumns";
import { ItemsTable } from "@/components/ItemsTable";

export default async function Page() {
  const items = await getItems();
  console.log(items);
  return (
    <main className="">
      <div className="header flex justify-end">
        <Button variant={"outline"} asChild>
          <Link href="/collections/new">New</Link>
        </Button>
      </div>
      <div className="space-y-1">
        <h1 className="text-3xl font-semibold">My Items</h1>
        <p className="text-muted-foreground">Manage your items here.</p>
      </div>
      <div className="content mt-8">
        <ItemsTable columns={columns} data={items?.data} />
      </div>
    </main>
  );
}
