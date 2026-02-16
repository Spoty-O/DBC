import { useForm } from "react-hook-form";
import { Card, CardContent } from "../ui/shadcn/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { chatSchema, type IChatSchema } from "./schemas/chat.schema";
import ChatInput from "../ui/chat.input";
import { chatFormInputProps } from "@common/consts";
import { FieldGroup, FieldSet } from "../ui/shadcn/field";

function ChatComponent() {
  const form = useForm<IChatSchema>({
    resolver: zodResolver(chatSchema),
    defaultValues: { text: "" },
    mode: "onBlur",
  });

  function onSubmit(values: IChatSchema) {
    console.log(values);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      form.handleSubmit(onSubmit)();
      form.resetField("text");
    }
  }

  return (
    <Card className="w-full justify-end rounded-none border-0">
      <CardContent>
        <form id={"chat-form"} onSubmit={form.handleSubmit(onSubmit)}>
          <FieldSet>
            <FieldGroup>
              <ChatInput
                inputProps={{ ...chatFormInputProps, control: form.control }}
                handleKeyDown={handleKeyDown}
              />
            </FieldGroup>
          </FieldSet>
        </form>
      </CardContent>
    </Card>
  );
}

export default ChatComponent;
