import Link from "next/link";

import { ConditionalWrapper } from "./conditional-wrapper";

interface Props {
  href?: string;
  hasLink?: boolean;
}

export const LogoLink = ({ href = "/", hasLink = true }: Props) => {
  return (
    <ConditionalWrapper
      condition={hasLink}
      wrapper={(children) => (
        <Link className="flex items-center" href={href}>
          {children}
        </Link>
      )}
    >
      <span className="font-black">Done</span>
    </ConditionalWrapper>
  );
};
