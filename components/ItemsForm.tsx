"use client";
import { z } from "zod";
import Form from "@/components/FormProvider";
import { createItem, updateItem } from "@/actions/items";
import { insertItemSchema } from "@/db/schema";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  FieldSet,
  FieldLegend,
  FieldDescription,
  FieldGroup,
} from "@/components/ui/field";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

const ItemsForm = ({ formId, data }: { formId: string; data?: any }) => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const fields = {
    name: data?.name || "",
  };

  const onSubmit = async (formData: z.infer<typeof insertItemSchema>) => {
    setError(null);

    if (data) {
      const result = await updateItem(data.id, formData);

      if (result.success) {
        toast.success("Item updated successfully", {
          description: `${formData.name} has been updated`,
        });
        router.push(`/items/${data.id}`);
      } else {
        setError(result.error || "Failed to update item");
      }
    } else {
      const result = await createItem(formData);

      if (result.success) {
        toast.success("Item created successfully", {
          description: `${formData.name} has been added to your items`,
        });
        router.push("/items");
      } else {
        setError(result.error || "Failed to create item");
      }
    }
  };

  return (
    <Form value={{ formId, fields, onSubmit, schema: insertItemSchema }}>
      <FieldSet>
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <FieldGroup>
          <Form.InputField name="name" placeholder={"Name of item"} />
        </FieldGroup>
      </FieldSet>
    </Form>
  );
};

export default ItemsForm;
