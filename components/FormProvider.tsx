import { createContext, useContext } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { on } from "events";

const FormContext = createContext(null);

const useFormContext = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error("useFormContext must be used within a FormProvider");
  }
  return context;
};

const Form = ({ children, value }) => {
  const { id, fields, onSubmit, schema } = value;

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: fields,
  });

  return (
    <FormContext.Provider value={{ id, fields, onSubmit, schema, form }}>
      <form id={id} onSubmit={form.handleSubmit(onSubmit)}>
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

Form.InputField = InputField;

export default Form;
