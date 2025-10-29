"use client";
import { z } from "zod";
import Form from "@/components/FormProvider";
import { createCollection, updateCollection } from "@/actions/collections";
import { getItems } from "@/actions/items";
import { insertCollectionSchema } from "@/db/schema";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  FieldSet,
  FieldLegend,
  FieldDescription,
  FieldGroup,
} from "@/components/ui/field";
import { Alert, AlertDescription } from "@/components/ui/alert";

const CollectionsForm = ({ formId, data }: { formId: string; data?: any }) => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [existingItems, setExistingItems] = useState<
    Array<{ id: number; name: string }>
  >([]);

  useEffect(() => {
    const fetchItems = async () => {
      const result = await getItems();
      if (result.success && result.data) {
        setExistingItems(result.data);
      }
    };
    fetchItems();
  }, []);

  const fields = {
    name: data?.name || "",
    description: data?.description || "",
    category: data?.category || "",
    tags: data?.tags || [],
    items:
      data?.collectionsToItems?.map((object: any) => ({
        name: object.item.name,
      })) || [],
  };

  console.log(data);

  const onSubmit = async (formData: z.infer<typeof insertCollectionSchema>) => {
    console.log(formData);
    setError(null);

    if (data) {
      const result = await updateCollection(data.id, formData);

      if (result.success) {
        router.push(`/collections/${data.id}`);
      } else {
        setError(result.error || "Failed to update collection");
      }
    } else {
      const result = await createCollection(formData);

      if (result.success) {
        router.push("/collections");
      } else {
        setError(result.error || "Failed to create collection");
      }
    }
  };

  return (
    <Form value={{ formId, fields, onSubmit, schema: insertCollectionSchema }}>
      <FieldSet>
        <FieldLegend>New collection</FieldLegend>
        <FieldDescription>
          Create a new collection to organize your items.
        </FieldDescription>
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <FieldGroup>
          <Form.InputField name="name" placeholder={"Fill in your name"} />
          <Form.TextareaField
            name="description"
            placeholder={"Fill in your description"}
          />
          <Form.SelectField
            name="category"
            placeholder={"Fill in your category"}
            options={[
              { label: "Products", value: "products" },
              { label: "Cars", value: "cars" },
              { label: "Real Estate", value: "real-estate" },
              { label: "Furniture", value: "furniture" },
              { label: "Clothing", value: "clothing" },
              { label: "Books", value: "books" },
              { label: "Electronics", value: "electronics" },
              { label: "Toys", value: "toys" },
              { label: "Sports", value: "sports" },
              { label: "Others", value: "others" },
            ]}
          />
          <Form.CheckboxField
            name="tags"
            options={[
              { id: "new", label: "New" },
              { id: "sale", label: "Sale" },
              { id: "popular", label: "Popular" },
            ]}
          />
          <Form.ArrayField
            name="items"
            placeholder="Enter item name"
            description="Add items to your collection (optional)"
            existingOptions={existingItems}
          />
        </FieldGroup>
      </FieldSet>
    </Form>
  );
};

export default CollectionsForm;
