import type { ReactNode } from "react";

export const H1 = ({ children }: { children: ReactNode }) => {
  return (
    <h1 className="scroll-m-20 font-extrabold text-4xl tracking-tight lg:text-5xl">
      {children}
    </h1>
  );
};

export const H2 = ({ children }: { children: ReactNode }) => {
  return (
    <h2 className="scroll-m-20 pb-2 font-semibold text-3xl tracking-tight first:mt-0">
      {children}
    </h2>
  );
};
