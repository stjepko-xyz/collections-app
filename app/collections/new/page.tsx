import { Button } from "@/components/ui/button";
import Link from "next/link";
import CollectionsForm from "@/components/CollectionsForm";

export default function Page() {
  return (
    <main className="flex flex-col gap-4 h-full">
      <div className="header flex justify-between items-start gap-2">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-xl font-semibold">New Collection</h1>
            <p className="text-muted-foreground">Create a new collection</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant={"ghost"} asChild>
            <Link href="/collections">Cancel</Link>
          </Button>
          <Button variant={"default"} type="submit" form="new-collection-form">
            Save
          </Button>
        </div>
      </div>
      <CollectionsForm formId="new-collection-form" />
    </main>
  );
}
