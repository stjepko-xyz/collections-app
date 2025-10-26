import { createContext, useContext } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldSet,
  FieldLegend,
} from "@/components/ui/field";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectSeparator,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { on } from "events";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
  InputGroupButton,
} from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";

const FormContext = createContext(null);

const useFormContext = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error("useFormContext must be used within a FormProvider");
  }
  return context;
};

const Form = ({ children, value }) => {
  const { formId, fields, onSubmit, schema } = value;

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: fields,
  });

  return (
    <FormContext.Provider value={{ formId, fields, onSubmit, schema, form }}>
      <form id={formId} onSubmit={form.handleSubmit(onSubmit)}>
        {children}
      </form>
    </FormContext.Provider>
  );
};

const InputField = ({ name, placeholder }) => {
  const { form } = useFormContext();

  return (
    <Controller
      name={name}
      control={form.control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={name}>{name}</FieldLabel>
          <Input
            {...field}
            id={name}
            aria-invalid={fieldState.invalid}
            placeholder={placeholder}
            autoComplete="off"
          />
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
};

const TextareaField = ({ name, placeholder }) => {
  const { form } = useFormContext();

  return (
    <Controller
      name={name}
      control={form.control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={name}>{name}</FieldLabel>
          <Textarea
            {...field}
            id={name}
            aria-invalid={fieldState.invalid}
            placeholder={placeholder}
            autoComplete="off"
          />
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
};

const SelectField = ({ name, placeholder, options }) => {
  const { form } = useFormContext();

  return (
    <Controller
      name={name}
      control={form.control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={name}>{name}</FieldLabel>
          <Select
            name={field.name}
            value={field.value}
            onValueChange={field.onChange}
          >
            <SelectTrigger
              id={name}
              aria-invalid={fieldState.invalid}
              className="min-w-[120px]"
            >
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent position="item-aligned">
              {options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
};

const CheckboxField = ({ name, options }) => {
  const { form } = useFormContext();

  return (
    <Controller
      name={name}
      control={form.control}
      render={({ field, fieldState }) => (
        <FieldSet>
          <FieldLegend variant="label">{name}</FieldLegend>
          <FieldGroup data-slot="checkbox-group">
            {options.map((option) => (
              <Field
                key={option.id}
                orientation="horizontal"
                data-invalid={fieldState.invalid}
              >
                <Checkbox
                  id={`form-rhf-checkbox-${option.id}`}
                  name={field.name}
                  aria-invalid={fieldState.invalid}
                  checked={field?.value?.includes(option.id)}
                  onCheckedChange={(checked) => {
                    const newValue = checked
                      ? [...field.value, option.id]
                      : field.value.filter((value) => value !== option.id);
                    field.onChange(newValue);
                  }}
                />
                <FieldLabel
                  htmlFor={`form-rhf-checkbox-${option.id}`}
                  className="font-normal"
                >
                  {option.label}
                </FieldLabel>
              </Field>
            ))}
          </FieldGroup>
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </FieldSet>
      )}
    />
  );
};

const ArrayField = ({ name, placeholder, description }) => {
  const { form } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: name,
  });
  return (
    <FieldSet className="gap-4">
      <FieldLegend variant="label">{name}</FieldLegend>
      {description && <FieldDescription>{description}</FieldDescription>}
      <FieldGroup className="gap-4">
        {fields.map((field, index) => (
          <Controller
            key={field.id}
            name={`${name}.${index}.name`}
            control={form.control}
            render={({ field: controllerField, fieldState }) => (
              <Field orientation="horizontal" data-invalid={fieldState.invalid}>
                <FieldContent>
                  <InputGroup>
                    <InputGroupInput
                      {...controllerField}
                      id={`${name}.${index}.name`}
                      aria-invalid={fieldState.invalid}
                      placeholder={placeholder || "Enter item name"}
                      type="text"
                      autoComplete="off"
                    />
                    {fields.length > 1 && (
                      <InputGroupAddon align="inline-end">
                        <InputGroupButton
                          type="button"
                          variant="ghost"
                          size="icon-xs"
                          onClick={() => remove(index)}
                          aria-label={`Remove ${name} ${index + 1}`}
                        >
                          <XIcon />
                        </InputGroupButton>
                      </InputGroupAddon>
                    )}
                  </InputGroup>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </FieldContent>
              </Field>
            )}
          />
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append({ name: "" })}
          disabled={fields.length >= 5}
        >
          Add {name}
        </Button>
      </FieldGroup>
    </FieldSet>
  );
};

Form.InputField = InputField;
Form.TextareaField = TextareaField;
Form.SelectField = SelectField;
Form.CheckboxField = CheckboxField;
Form.ArrayField = ArrayField;

export default Form;
