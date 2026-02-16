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

type SafeTextAreaProps = Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  | "name"
  | "value"
  | "defaultValue"
  | "onChange"
  | "onBlur"
  | "ref"
  | "aria-invalid"
>;

export type TFormProps<T extends FieldValues, P extends object> = {
  name: Path<T>;
  control: Control<T>;
  label: string;
  inputProps: P & { id: string };
};

export type TFormInputProps<T extends FieldValues> = TFormProps<T, SafeInputProps>
export type TFormChatProps<T extends FieldValues> = TFormProps<T, SafeTextAreaProps>
