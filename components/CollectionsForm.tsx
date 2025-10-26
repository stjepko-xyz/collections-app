"use client";
import { z } from "zod";
import Form from "@/components/FormProvider";
import { createCollection, updateCollection } from "@/actions/collections";
import { insertCollectionSchema } from "@/db/schema";
import { useRouter } from "next/navigation";
import {
  FieldSet,
  FieldLegend,
  FieldDescription,
  FieldGroup,
} from "@/components/ui/field";

const CollectionsForm = ({ id }: { id?: number }) => {
  const router = useRouter();
  const fields = {
    name: "",
    description: "",
    category: "",
    tags: [] as string[],
  };

  const onSubmit = async (data: z.infer<typeof insertCollectionSchema>) => {
    console.log(data);
    const result = await createCollection(data);

    if (result.success) {
      // Success! Redirect to collections page
      router.push("/collections");
    } else {
      // Show error message
    }
  };

  return (
    <Form value={{ id, fields, onSubmit, schema: insertCollectionSchema }}>
      <FieldSet>
        <FieldLegend>New collection</FieldLegend>
        <FieldDescription>
          Create a new collection to organize your items.
        </FieldDescription>
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
        </FieldGroup>
      </FieldSet>
    </Form>
  );
};

export default CollectionsForm;
