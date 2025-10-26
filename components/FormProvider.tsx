import { createContext, useContext } from "react";
import { useForm, Controller } from "react-hook-form";
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

Form.InputField = InputField;
Form.TextareaField = TextareaField;
Form.SelectField = SelectField;
Form.CheckboxField = CheckboxField;

export default Form;
