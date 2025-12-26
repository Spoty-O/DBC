import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/shadcn/card";
import { Button } from "../ui/shadcn/button";
import { Link } from "react-router";
import {
  registerSchema,
  type IRegisterSchema,
} from "./schemas/register.schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldGroup, FieldSet } from "../ui/shadcn/field";
import FormInput from "../ui/form.input";
import { registerFormInputProps } from "@common/consts/form.consts";

function RegisterComponent() {
  const form = useForm<IRegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: "", password: "", confirmPassword: "" },
    mode: "onBlur",
  });

  function onSubmit(values: IRegisterSchema) {
    console.log(values);
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Register new account</CardTitle>
        <CardAction>
          <Button variant={"link"}>
            <Link to={"/auth"}>Log in</Link>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <form id={"register-form"} onSubmit={form.handleSubmit(onSubmit)}>
          <FieldSet>
            <FieldGroup>
              {registerFormInputProps.map((props, index) => (
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
          <Button type="submit" form="register-form">
            Submit
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
}

export default RegisterComponent;
