import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { object, string, type infer as zodInfer } from "zod";

import { InputField } from "@/components/fields/input-field";
import { PasswordField } from "@/components/fields/password-field";
import { Button } from "@/components/ui/button";

const schema = object({
  name: string().min(1, { message: "Required" }),
  email: string().email().min(1, { message: "Required" }),
  password: string().min(6, { message: "Too short" }),
  jobTitle: string().optional(),
});

type Schema = zodInfer<typeof schema>;

interface Props {
  returnTo: string;
  forwardQuery?: string;
}

export const SignUpForm = ({ returnTo, forwardQuery }: Props) => {
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit } = useForm<Schema>({
    resolver: zodResolver(schema),
    mode: "all",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      jobTitle: "",
    },
  });

  const submitHandler = useCallback(
    (_input: Schema) => {
      try {
        setLoading(true);
        // setCookie(RETURN_TO_KEY, returnTo);

        // const { error } = await supabase.auth.signUp({
        //   email: input.email,
        //   password: input.password,
        //   options: {
        //     emailRedirectTo: `https://trydone.io/auth/callback`,
        //     data: {
        //       name: input.name,
        //     },
        //   },
        // });

        // if (error) {
        //   throw error;
        // }

        setTimeout(() => {
          window.location.href =
            returnTo + (forwardQuery ? `?${forwardQuery}` : "");
        }, 500);
      } catch (error: unknown) {
        toast.error(
          error instanceof Error ? error.message : "An error occurred"
        );
      } finally {
        setLoading(false);
      }
    },
    [forwardQuery, returnTo]
  );

  return (
    <form onSubmit={handleSubmit(submitHandler)}>
      <InputField
        control={control}
        label="Full name"
        name="name"
        placeholder="E.g. John Smith"
      />

      <InputField
        control={control}
        label="Email address"
        name="email"
        placeholder="E.g. you@email.com"
        type="email"
      />

      <PasswordField
        control={control}
        label="Password"
        name="password"
        placeholder="6+ characters"
      />

      <Button className="w-full shadow-sm" loading={loading} type="submit">
        Sign up
      </Button>
    </form>
  );
};
