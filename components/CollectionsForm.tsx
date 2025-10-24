"use client";
import { useState } from "react";
import Form from "@/components/FormProvider";
import { createCollection, updateCollection } from "@/actions/collections";
import * as z from "zod";
import { useRouter } from "next/navigation";
import {
  FieldSet,
  FieldLegend,
  FieldDescription,
  FieldGroup,
} from "@/components/ui/field";

const schema = z.object({
  name: z
    .string()
    .min(5, "Collection name must be at least 5 characters.")
    .max(32, "Collection name must be at most 32 characters."),
  description: z
    .string()
    .min(20, "Collection description must be at least 20 characters.")
    .max(100, "Collection description must be at most 100 characters."),
});

const CollectionsForm = ({ id }) => {
  const router = useRouter();
  const fields = {
    name: "",
    description: "",
  };

  const onSubmit = async (data: z.infer<typeof schema>) => {
    const result = await createCollection(data);

    if (result.success) {
      // Success! Redirect to collections page
      router.push("/collections");
    } else {
      // Show error message
    }
  };

  return (
    <Form value={{ id, fields, onSubmit, schema }}>
      <FieldSet>
        <FieldLegend>New collection</FieldLegend>
        <FieldDescription>
          Create a new collection to organize your items.
        </FieldDescription>
        <FieldGroup>
          <Form.InputField name="name" placeholder={"Fill in your name"} />
          <Form.InputField
            name="description"
            placeholder={"Fill in your description"}
          />
        </FieldGroup>
      </FieldSet>
    </Form>
  );
};

export default CollectionsForm;
