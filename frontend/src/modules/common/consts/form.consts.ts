import type { IAuthSchema } from "@common/components/auth/schemas/auth.schema";
import type { IRegisterSchema } from "@common/components/auth/schemas/register.schema";
import type { IChatSchema } from "@common/components/chat/schemas/chat.schema";
import type { TFormChatProps, TFormInputProps } from "@common/types";

export const registerFormInputProps: Omit<
  TFormInputProps<IRegisterSchema>,
  "control"
>[] = [
  {
    name: "email",
    label: "Email",
    inputProps: {
      id: "register-email-input",
      type: "email",
      placeholder: "Enter your email",
      autoComplete: "email",
    },
  },
  {
    name: "password",
    label: "Password",
    inputProps: {
      type: "password",
      id: "register-password-input",
      placeholder: "Enter your password",
      autoComplete: "new-password",
    },
  },
  {
    name: "confirmPassword",
    label: "Confirm password",
    inputProps: {
      type: "password",
      id: "register-confirmPassword-input",
      placeholder: "Repeat your password",
    },
  },
];

export const authFormInputProps: Omit<
  TFormInputProps<IAuthSchema>,
  "control"
>[] = [
  {
    name: "email",
    label: "Email",
    inputProps: {
      id: "auth-email-input",
      type: "email",
      placeholder: "Enter your email",
      autoComplete: "email",
    },
  },
  {
    name: "password",
    label: "Password",
    inputProps: {
      type: "password",
      id: "auth-password-input",
      placeholder: "Enter your password",
      autoComplete: "current-password",
    },
  },
];

export const chatFormInputProps: Omit<
  TFormChatProps<IChatSchema>,
  "control"
> = {
  name: "text",
  label: "",
  inputProps: {
    id: "chat-input",
    placeholder: "Enter your request here"
  },
};
