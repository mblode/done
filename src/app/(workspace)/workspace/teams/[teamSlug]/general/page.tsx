"use client";

import { useQuery } from "@rocicorp/zero/react";
import { ChevronRight, Users } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useZero } from "@/hooks/use-zero";
import { mutators } from "@/lib/zero/mutators";
import { queries } from "@/lib/zero/queries";

interface Props {
  params: { workspaceSlug: string; teamSlug: string };
}

export default function Page({ params: { workspaceSlug, teamSlug } }: Props) {
  const zero = useZero();
  const [team] = useQuery(queries.teams.bySlug({ slug: teamSlug }));

  const handleDeleteTeam = async () => {
    if (!team) {
      return;
    }

    try {
      await zero.mutate(mutators.team.delete({ id: team.id }));
      toast.success("Team scheduled for deletion");
    } catch (_error) {
      toast.error("Failed to delete team");
    }
  };

  return (
    <div className="container mx-auto max-w-4xl space-y-8 py-6">
      {/* Team Identity */}
      <Card>
        <CardHeader>
          <CardTitle>Team settings</CardTitle>
          <CardDescription>
            Configure how your team appears and is identified
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex gap-4">
            <div className="flex-1 space-y-2">
              <label className="font-medium text-sm" htmlFor="team-name">
                Name
              </label>
              <div className="flex items-center gap-2">
                <Input defaultValue="Product" id="team-name" />
              </div>
            </div>

            <div className="flex-1 space-y-2">
              <label className="font-medium text-sm" htmlFor="team-slug">
                Slug
                <span className="ml-2 font-normal text-muted-foreground text-sm">
                  Used in issue IDs
                </span>
              </label>
              <Input defaultValue="PRO" id="team-slug" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation Links */}
      <div className="space-y-2">
        <Link
          className="flex items-center justify-between rounded-lg bg-muted/50 p-4 hover:bg-muted"
          href={`/${workspaceSlug}/settings/teams/${teamSlug}/members`}
        >
          <div className="flex items-center gap-3">
            <Users className="size-5 text-muted-foreground" />
            <div>
              <div className="font-medium">Members</div>
              <div className="text-muted-foreground text-sm">
                Manage team members
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* <span className="text-sm text-muted-foreground">2 members</span> */}
            <ChevronRight className="size-4" />
          </div>
        </Link>
      </div>

      {/* Danger Zone */}
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>
            Irreversible and destructive actions
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex items-center justify-between border-t py-3">
            <div>
              <h3 className="font-medium">Delete team</h3>
              <p className="text-muted-foreground text-sm">
                Permanently remove this team and all of its data
              </p>
            </div>
            <Button onClick={handleDeleteTeam} variant="destructive">
              Delete team...
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
