"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

interface Props {
  invitationId: string;
}

export const AcceptInvitePage = (_props: Props) => {
  const router = useRouter();

  const handleAccept = () => {
    // acceptMutation.mutate({ invitationId });
    // console.log("accept");
  };

  const handleDecline = () => {
    router.push("/sites");
  };

  return (
    <div>
      <div className="container mx-auto pt-6">
        <div className="rounded-3xl border border-border bg-card px-6 py-8 shadow-sm">
          <h1 className="h2 mb-6">Accept invite</h1>

          <div className="mb-4 flex space-x-2">
            <Button
              className="w-full flex-1"
              onClick={handleAccept}
              variant="success"
            >
              Accept
            </Button>

            <Button onClick={handleDecline} variant="destructiveSecondary">
              Decline
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
