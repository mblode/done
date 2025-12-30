import { Zero } from "@rocicorp/zero";
import { getCookie } from "cookies-next";
import { decodeJwt } from "jose";

import { mutators } from "@/lib/zero/mutators";
import { schema } from "@/schema";

export function createZero() {
  const encodedJWT = getCookie("jwt");
  let decodedJWT: ReturnType<typeof decodeJwt> | null = null;

  if (typeof encodedJWT === "string") {
    try {
      decodedJWT = decodeJwt(encodedJWT);
    } catch {
      decodedJWT = null;
    }
  }

  const userID = typeof decodedJWT?.sub === "string" ? decodedJWT.sub : "anon";

  const zero = new Zero({
    userID,
    auth: decodedJWT && typeof encodedJWT === "string" ? encodedJWT : undefined,
    cacheURL: process.env.NEXT_PUBLIC_SERVER,
    schema,
    mutators,
    context: { userID },
    kvStore: "mem",
  });

  // Only expose in development
  if (process.env.NODE_ENV === "development" && typeof window !== "undefined") {
    try {
      Object.defineProperty(window, "z", {
        value: zero,
        writable: true,
        configurable: true,
      });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn("Failed to expose Zero instance to window", e);
    }
  }

  return zero;
}
