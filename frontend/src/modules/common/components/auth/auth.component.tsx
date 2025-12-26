import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authSchema, type IAuthSchema } from "./schemas/auth.schema";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/shadcn/card";
import { Button } from "../ui/shadcn/button";
import { Field, FieldGroup, FieldSet } from "../ui/shadcn/field";
import { Link } from "react-router";
import { authFormInputProps } from "@common/consts/form.consts";
import FormInput from "../ui/form.input";

function AuthComponent() {
  const form = useForm<IAuthSchema>({
    resolver: zodResolver(authSchema),
    defaultValues: { email: "", password: "" },
    mode: "onBlur",
  });

  function onSubmit(values: IAuthSchema) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
        <CardAction>
          <Button variant={"link"}>
            <Link to={"/register"}>Sing Up</Link>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <form id="auth-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldSet>
            <FieldGroup>
              {authFormInputProps.map((props, index) => (
                <FormInput key={index} {...props} control={form.control} />
              ))}
            </FieldGroup>
          </FieldSet>
        </form>
      </CardContent>
      <CardFooter className="flex-col">
        <Field orientation={"horizontal"}>
          <Button type="reset" variant={"outline"} onClick={() => form.reset()}>
            Reset
          </Button>
          <Button type="submit" form="auth-form">
            Submit
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
}

export default AuthComponent;
