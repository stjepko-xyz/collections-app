import { Button } from "@/components/ui/button";
import Link from "next/link";
import ItemsForm from "@/components/ItemsForm";

export default function Page() {
  return (
    <main className="flex flex-col gap-4 h-full">
      <div className="header flex justify-between items-start gap-2">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-xl font-semibold">New Item</h1>
            <p className="text-muted-foreground">Create a new item</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant={"ghost"} asChild>
            <Link href="/items">Cancel</Link>
          </Button>
          <Button variant={"default"} type="submit" form="new-item-form">
            Save
          </Button>
        </div>
      </div>
      <ItemsForm formId="new-item-form" />
    </main>
  );
}
