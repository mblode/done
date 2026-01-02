"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import queryString from "query-string";

import { SignUpForm } from "@/components/auth/sign-up-form";
import useQueryParams from "@/hooks/use-query-params";

const getReturnTo = (returnTo: string | null | undefined): string => {
  if (!returnTo) {
    return "/inbox";
  }

  return returnTo;
};

interface Props {
  overrideReturnTo?: string;
}

export const SignUpPage = ({ overrideReturnTo }: Props) => {
  const searchParams = useSearchParams();
  const { getParamsAsRecord } = useQueryParams();
  const returnTo = overrideReturnTo || searchParams?.get("returnTo");
  const forwardQuery = queryString.stringify(
    getParamsAsRecord({ exclude: ["returnTo"] })
  );

  const queryParams = queryString.stringify({
    returnTo: getReturnTo(returnTo),
  });

  return (
    <>
      <div className="mb-8">
        <SignUpForm
          forwardQuery={forwardQuery}
          returnTo={getReturnTo(returnTo)}
        />
      </div>

      <p className="mb-8 text-center text-sm">
        Signing up for a Done account means you agree to the{" "}
        <a
          className="text-primary underline-offset-4 hover:underline"
          href={"https://trydone.io/terms"}
          rel="noopener"
          target="_blank"
        >
          Terms of Service
        </a>{" "}
        and{" "}
        <a
          className="text-primary underline-offset-4 hover:underline"
          href={"https://trydone.io/privacy"}
          rel="noopener"
          target="_blank"
        >
          Privacy Policy
        </a>
        .
      </p>

      <p className="mb-3 text-center text-sm">
        Already signed up?{" "}
        <Link
          className="text-primary underline-offset-2 hover:underline"
          href={`/sign-in?${queryParams}`}
        >
          Sign in
        </Link>
      </p>
    </>
  );
};
