import { getCollections } from "@/actions/collections";
import { columns } from "@/components/CollectionsColumns";
import { CollectionsTable } from "@/components/CollectionsTable";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Home() {
  const collections = await getCollections();

  return (
    <main className="">
      <div className="header flex justify-end">
        <Button variant={"outline"} asChild>
          <Link href="/collections/new">New</Link>
        </Button>
      </div>
      <div className="space-y-1">
        <h1 className="text-3xl font-semibold">My Collections</h1>
        <p className="text-muted-foreground">Manage your collections here.</p>
      </div>
      <div className="content mt-8">
        <CollectionsTable columns={columns} data={collections?.data} />
      </div>
    </main>
  );
}
