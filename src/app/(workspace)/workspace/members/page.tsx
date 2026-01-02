"use client";

import { useQuery } from "@rocicorp/zero/react";
import { ArrowUpDown, MoreHorizontal, PlusCircle } from "lucide-react";
import { observer } from "mobx-react-lite";
import { useContext, useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getUserInitials } from "@/lib/helpers";
import { RootStoreContext } from "@/lib/stores/root-store";
import { queries } from "@/lib/zero/queries";

export default observer(() => {
  const {
    localStore: { selectedWorkspaceId },
  } = useContext(RootStoreContext);

  const [members] = useQuery(
    queries.workspaceMembers.withUserProfile({
      workspaceId: selectedWorkspaceId,
    })
  );
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"All" | "Admin" | "Member">("All");

  const filteredMembers = members.filter((member) => {
    const name = member.user?.profile?.name || "";
    const email = member.user?.email || "";
    const matchesSearch =
      name.toLowerCase().includes(search.toLowerCase()) ||
      email.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "All" || member.role === filter;
    return matchesSearch && matchesFilter;
  });

  const exportToCSV = () => {
    const csv = [
      ["Name", "Email", "Role", "Joined"],
      ...filteredMembers.map((member) => [
        member.user?.profile?.name || "",
        member.user?.email || "",
        member.role,
        new Date(member.created_at).toLocaleDateString(),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "members.csv";
    a.click();
  };

  return (
    <div className="container mx-auto max-w-5xl space-y-8 py-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-medium text-lg">Members</h2>
          <p className="text-muted-foreground text-sm">
            Invite and manage workspace members.
          </p>
        </div>
        <Button>
          <PlusCircle className="mr-2 size-4" />
          Add Member
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <div className="grow">
          <Input
            className="max-w-[400px]"
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search members..."
            value={search}
          />
        </div>

        <Select
          onValueChange={(value) => setFilter(value as typeof filter)}
          value={filter}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="member">Member</SelectItem>
          </SelectContent>
        </Select>

        <Button onClick={exportToCSV} size="sm" variant="outline">
          <ArrowUpDown className="size-4" />
        </Button>
      </div>

      <div className="rounded-md border">
        <div className="p-4">
          <div className="space-y-4">
            {filteredMembers.map((member) => (
              <div
                className="flex items-center justify-between space-x-4"
                key={member.id}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar>
                      <AvatarImage
                        alt={member.user?.profile?.name || ""}
                        src={member.user?.profile?.avatar || undefined}
                      />
                      <AvatarFallback>
                        {getUserInitials(member.user?.profile?.name || "")}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div>
                    <div className="font-medium">
                      {member.user?.profile?.name || "Unnamed"}
                    </div>
                    <div className="text-muted-foreground text-sm">
                      {member.user?.email}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex h-7 items-center justify-center rounded-full bg-secondary px-3 font-medium text-xs">
                    {member.role}
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="sm" variant="ghost">
                        <MoreHorizontal className="size-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Profile</DropdownMenuItem>
                      <DropdownMenuItem>Change Role</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">
                        Remove Member
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});
