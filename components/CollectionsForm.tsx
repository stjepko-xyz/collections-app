"use client";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { Input } from "@/components/ui/input";
import { createCollection, updateCollection } from "@/actions/collections";
import { useRouter } from "next/navigation";
import { useState } from "react";

const formSchema = z.object({
  name: z
    .string()
    .min(5, "Collection name must be at least 5 characters.")
    .max(32, "Collection name must be at most 32 characters."),
  description: z
    .string()
    .min(20, "Collection description must be at least 20 characters.")
    .max(100, "Collection description must be at most 100 characters."),
});

interface CollectionsFormProps {
  data?: {
    id?: number;
    name?: string;
    description?: string;
  };
  formId: string;
}

const CollectionsForm = ({ data, formId }: CollectionsFormProps) => {
  const { id, name, description } = data || {};

  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: name || "",
      description: description || "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    setError(null);

    const result = id
      ? await updateCollection(id, data)
      : await createCollection(data);

    if (result.success) {
      // Success! Redirect to collections page
      router.push("/collections");
    } else {
      // Show error message
      setError(result.error || "Failed to create collection");
    }

    setIsSubmitting(false);
  };
  return (
    <form id={formId} onSubmit={form.handleSubmit(onSubmit)} className="mt-8">
      <FieldSet>
        <FieldLegend>New collection</FieldLegend>
        <FieldDescription>
          Create a new collection to organize your items.
        </FieldDescription>
        <FieldGroup>
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-rhf-demo-title">Name</FieldLabel>
                <Input
                  {...field}
                  id="form-rhf-demo-title"
                  aria-invalid={fieldState.invalid}
                  placeholder="Collection name"
                  autoComplete="off"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="description"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-rhf-demo-description">
                  Description
                </FieldLabel>
                <InputGroup>
                  <InputGroupTextarea
                    {...field}
                    id="form-rhf-demo-description"
                    placeholder="Collection description"
                    rows={6}
                    className="min-h-24 resize-none"
                    aria-invalid={fieldState.invalid}
                  />
                  <InputGroupAddon align="block-end">
                    <InputGroupText className="tabular-nums">
                      {field.value.length}/100 characters
                    </InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
                <FieldDescription>
                  A brief description of the collection (max 100 characters).
                </FieldDescription>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
            {error}
          </div>
        )}
      </FieldSet>
    </form>
  );
};

export default CollectionsForm;
