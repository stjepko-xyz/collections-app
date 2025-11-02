import { getCollections } from "@/actions/collections";
import { columns } from "@/components/CollectionsColumns";
import { CollectionsTable } from "@/components/CollectionsTable";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Boxes, Folders } from "lucide-react";
import Link from "next/link";

export default async function Home() {
  const collections = await getCollections();

  return (
    <main className="flex flex-col gap-4 h-full">
      <div className="flex justify-between">
        <div className="flex items-center gap-4">
          <Folders
            strokeWidth={1}
            width={32}
            height={32}
            className="text-violet-500"
          />
          <div>
            <h1 className="text-2xl font-semibold">My Collections</h1>
            <p className="text-muted-foreground">
              Manage your collections here
            </p>
          </div>
        </div>
        <div className="header flex items-end">
          <Button variant={"outline"} asChild>
            <Link href="/collections/new">New</Link>
          </Button>
        </div>
      </div>
      <Card className="p-2 flex-1 overflow-hidden">
        <CollectionsTable columns={columns} data={collections?.data} />
      </Card>
    </main>
  );
}
