"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import queryString from "query-string";

import { SignUpForm } from "@/components/auth/sign-up-form";
import useQueryParams from "@/hooks/use-query-params";

const getReturnTo = (returnTo: string | null | undefined): string => {
  if (!returnTo) {
    return `/inbox`;
  }

  return returnTo;
};

type Props = {
  overrideReturnTo?: string;
};

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
          returnTo={getReturnTo(returnTo)}
          forwardQuery={forwardQuery}
        />
      </div>

      <p className="mb-8 text-center text-sm">
        Signing up for a Done account means you agree to the{" "}
        <a
          href={`https://trydone.io/terms`}
          target="_blank"
          className="text-primary underline-offset-4 hover:underline"
          rel="noopener"
        >
          Terms of Service
        </a>{" "}
        and{" "}
        <a
          href={`https://trydone.io/privacy`}
          target="_blank"
          className="text-primary underline-offset-4 hover:underline"
          rel="noopener"
        >
          Privacy Policy
        </a>
        .
      </p>

      <p className="mb-3 text-center text-sm">
        Already signed up?{" "}
        <Link
          href={`/sign-in?${queryParams}`}
          className="text-primary underline-offset-2 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </>
  );
};
