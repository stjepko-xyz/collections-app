import { Button } from "@/components/ui/button";
import Link from "next/link";
import ItemsForm from "@/components/ItemsForm";

export default function Page() {
  return (
    <main className="">
      <div className="header flex justify-end gap-2">
        <Button variant={"ghost"} asChild>
          <Link href="/items">Cancel</Link>
        </Button>
        <Button variant={"default"} type="submit" form="new-item-form">
          Save
        </Button>
      </div>
      <ItemsForm formId="new-item-form" />
    </main>
  );
}
