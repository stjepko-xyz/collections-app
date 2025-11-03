import { getCollectionById, deleteCollection } from "@/actions/collections";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import CollectionsForm from "@/components/CollectionsForm";
import RemoveDialog from "@/components/RemoveDialog";

export default async function Page({ params }: { params: { id: string } }) {
  const { id: paramId } = params;
  const id = parseInt(paramId, 10);
  const collection = await getCollectionById(id);

  return (
    <main className="flex flex-col gap-4 h-full">
      <div className="flex justify-between">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-xl font-semibold">Edit Collection</h1>
            <p className="text-muted-foreground">
              Update your collection details
            </p>
          </div>
        </div>
        <div className="header flex items-end gap-2">
          {/* TO-DO: Make client side actions component: Cancel, Save, Remove */}
          <Button variant={"ghost"} asChild>
            <Link href={`/collections/${id}`}>Cancel</Link>
          </Button>
          <Button variant={"default"} type="submit" form="edit-collection-form">
            Save
          </Button>
          <RemoveDialog
            itemId={id}
            itemName="collection"
            redirectPath="/collections"
            onDelete={deleteCollection}
          />
        </div>
      </div>
      <CollectionsForm data={collection.data} formId={"edit-collection-form"} />
    </main>
  );
}
