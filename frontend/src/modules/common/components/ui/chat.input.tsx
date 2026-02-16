import { Controller, type FieldValues } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "./shadcn/field";
import { InputGroup, InputGroupTextarea } from "./shadcn/input-group";
import type { TFormChatProps } from "@common/types";
import type React from "react";

type Props<T extends FieldValues> = {
  handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>): void;
  inputProps: TFormChatProps<T>;
};

function ChatInput<T extends FieldValues>({
  handleKeyDown,
  inputProps: { name, control, label, inputProps },
}: Props<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field>
          <FieldLabel htmlFor={inputProps.id}>{label}</FieldLabel>
          <InputGroup>
            <InputGroupTextarea
              onKeyDown={handleKeyDown}
              {...inputProps}
              {...field}
            />
          </InputGroup>
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}

export default ChatInput;
