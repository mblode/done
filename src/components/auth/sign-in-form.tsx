import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { object, string, type infer as zodInfer } from "zod";

import { InputField } from "@/components/fields/input-field";
import { PasswordField } from "@/components/fields/password-field";
import { Button } from "@/components/ui/button";

const schema = object({
  email: string().email().min(1, { message: "Required" }),
  password: string().min(1, { message: "Required" }),
});

type Schema = zodInfer<typeof schema>;

interface Props {
  redirectTo: string;
}

export const SignInForm = ({ redirectTo }: Props) => {
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit } = useForm<Schema>({
    resolver: zodResolver(schema),
    mode: "all",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const submitHandler = useCallback(() => {
    try {
      setLoading(true);

      // const { error } = await supabase.auth.signInWithPassword({
      //   email,
      //   password,
      // });

      // if (error) {
      //   throw error;
      // }

      setTimeout(() => {
        window.location.href = redirectTo;
      }, 500);
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "An error occurred");
      setLoading(false);
    }
  }, [redirectTo]);

  return (
    <form onSubmit={handleSubmit(submitHandler)}>
      <InputField
        control={control}
        label={null}
        name="email"
        placeholder="Email address"
        type="email"
      />

      <PasswordField
        control={control}
        label={null}
        name="password"
        placeholder="Password"
      />

      <Button className="w-full shadow-sm" loading={loading} type="submit">
        Sign in
      </Button>
    </form>
  );
};
