"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { object, string, type infer as zodInfer } from "zod";

import { PasswordField } from "@/components/fields/password-field";
import { Button } from "@/components/ui/button";

const schema = object({
  password: string().min(1, { message: "Required" }),
});

type Schema = zodInfer<typeof schema>;

const redirectTo = "/sites";

export const UpdatePasswordForm = () => {
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit } = useForm<Schema>({
    resolver: zodResolver(schema),
    mode: "all",
    defaultValues: {
      password: "",
    },
  });

  const submitHandler = useCallback(() => {
    try {
      setLoading(true);

      // const { error } = await supabase.auth.updateUser({ password });

      // if (error) {
      //   throw error;
      // }

      setTimeout(() => {
        window.location.href = redirectTo;
      }, 500);
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <form onSubmit={handleSubmit(submitHandler)}>
      <PasswordField
        control={control}
        label="New password"
        name="password"
        placeholder="6+ characters"
      />

      <Button className="w-full shadow-sm" loading={loading} type="submit">
        Update password
      </Button>
    </form>
  );
};
