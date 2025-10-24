import { Button } from "@/components/ui/button";
import Link from "next/link";
import CollectionsForm from "@/components/CollectionsForm";

export default function Page() {
  return (
    <main className="">
      <div className="header flex justify-end gap-2">
        <Button variant={"ghost"} asChild>
          <Link href="/collections">Cancel</Link>
        </Button>
        <Button variant={"default"} type="submit" form="new-collection-form">
          Save
        </Button>
      </div>
      <CollectionsForm id="new-collection-form" />
    </main>
  );
}
