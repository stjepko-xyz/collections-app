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
    <main className="flex flex-col gap-4 h-full">
      <div className="flex justify-between">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-xl font-semibold">Edit Item</h1>
            <p className="text-muted-foreground">Update your item details</p>
          </div>
        </div>
        <div className="header flex items-end gap-2">
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
      </div>
      <ItemsForm data={item.data} formId={"edit-item-form"} />
    </main>
  );
}
