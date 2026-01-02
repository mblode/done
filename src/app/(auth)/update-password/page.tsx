import { ArrowRightIcon } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { AuthNavbar } from "@/components/auth/auth-navbar";
import { UpdatePasswordForm } from "@/components/auth/update-password-form";

export const metadata: Metadata = {
  title: "Update Password",
  description:
    "Securely change your Done account password. Keep your account protected with strong authentication measures.",
};

export default async function Page() {
  return (
    <>
      <AuthNavbar />

      <div className="rounded-3xl border border-border bg-background px-4 py-6 shadow-sm dark:shadow-none">
        <h1 className="h3 mb-6 text-center">Update your password</h1>

        <UpdatePasswordForm />

        <p className="mt-6 mb-4 flex flex-wrap items-center justify-center text-center text-sm">
          Already have an account?{" "}
          <Link
            className="group flex items-center font-medium text-primary"
            href={"/sign-in?"}
          >
            Sign in
            <ArrowRightIcon
              className="ml-0.5 transition-transform group-hover:translate-x-1"
              height={16}
              width={16}
            />
          </Link>
        </p>
      </div>
    </>
  );
}
