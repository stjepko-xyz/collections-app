import Link from "next/link";
import { Button } from "@/components/ui/button";
import RemoveDialog from "@/components/RemoveDialog";
import { getItemById, deleteItem } from "@/actions/items";
import ItemsForm from "@/components/ItemsForm";

export default async function Page({ params }: { params: { id: string } }) {
  const { id: paramId } = params;
  const id = parseInt(paramId, 10);
  console.log(id);
  const item = await getItemById(id);

  return (
    <main className="">
      <div className="header flex justify-end gap-2">
        {/* TO-DO: Make client side actions component: Cancel, Save, Remove */}
        <Button variant={"ghost"} asChild>
          <Link href={`/items/${id}`}>Cancel</Link>
        </Button>
        <Button variant={"default"} type="submit" form="edit-item-form">
          Save
        </Button>
        <RemoveDialog
          itemId={id}
          itemName="item"
          redirectPath="/items"
          onDelete={deleteItem}
        />
      </div>
      <ItemsForm data={item.data} formId={"edit-item-form"} />
    </main>
  );
}
