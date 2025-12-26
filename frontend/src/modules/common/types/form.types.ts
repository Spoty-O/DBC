import type React from "react";
import { type Control, type FieldValues, type Path } from "react-hook-form";

type SafeInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  | "name"
  | "value"
  | "defaultValue"
  | "onChange"
  | "onBlur"
  | "ref"
  | "aria-invalid"
>;

export type TFormInputProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  label: string;
  inputProps: SafeInputProps & { id: string };
};
