import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authSchema, type IAuthSchema } from "./schemas/auth.schema";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";

function AuthComponent() {
  const form = useForm<IAuthSchema>({
    resolver: zodResolver(authSchema),
    defaultValues: { email: "", password: "" },
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
        <CardDescription>
          Enter your email and password below to login to your accout.
        </CardDescription>
        <CardAction>
          <Button variant={"link"}>Sing Up</Button>
        </CardAction>
      </CardHeader>
    </Card>
    // <Form {...form}>
    //   <form onSubmit={form.handleSubmit(onSubmit)}>
    //     <FormField
    //       control={form.control}
    //       name="email"
    //       render={({ field }) => (
    //         <FormItem>
    //           <FormLabel>Email</FormLabel>
    //           <FormControl>
    //             <Input placeholder="Email" {...field} />
    //           </FormControl>
    //           <FormDescription>This is your email.</FormDescription>
    //           <FormMessage />
    //         </FormItem>
    //       )}
    //     />
    //     <FormField
    //       control={form.control}
    //       name="password"
    //       render={({ field }) => (
    //         <FormItem>
    //           <FormLabel>Password</FormLabel>
    //           <FormControl>
    //             <Input placeholder="Password" {...field} />
    //           </FormControl>
    //           <FormDescription>This is your password.</FormDescription>
    //           <FormMessage />
    //         </FormItem>
    //       )}
    //     />
    //   </form>
    // </Form>
  );
}

export default AuthComponent;
