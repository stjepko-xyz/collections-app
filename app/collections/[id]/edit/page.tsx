import { getCollectionById, deleteCollection } from "@/actions/collections";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import CollectionsForm from "@/components/CollectionsForm";
import RemoveDialog from "@/components/RemoveDialog";

export default async function Page({ params }: { params: { id: string } }) {
  const { id: paramId } = params;
  const id = parseInt(paramId, 10);
  console.log(id);
  const collection = await getCollectionById(id);

  return (
    <main className="">
      <div className="header flex justify-end gap-2">
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
      <CollectionsForm data={collection.data} formId={"edit-collection-form"} />
    </main>
  );
}
