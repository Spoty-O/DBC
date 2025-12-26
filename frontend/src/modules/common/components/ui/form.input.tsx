import { Controller, type FieldValues } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "./shadcn/field";
import { InputGroup, InputGroupInput } from "./shadcn/input-group";
import type { TFormInputProps } from "@common/types";

function FormInput<T extends FieldValues>({
  name,
  control,
  label,
  inputProps,
}: TFormInputProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field>
          <FieldLabel htmlFor={inputProps.id}>{label}</FieldLabel>
          <InputGroup>
            <InputGroupInput {...inputProps} {...field} />
          </InputGroup>
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}

export default FormInput;
