"use client";

import { useQuery } from "@rocicorp/zero/react";
import { ChevronLeft, MoreHorizontal, Plus, Search } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useZero } from "@/hooks/use-zero";
import { mutators } from "@/lib/zero/mutators";
import { queries } from "@/lib/zero/queries";

interface Props {
  params: { workspaceSlug: string; teamSlug: string };
}

export default function Page({ params: { teamSlug } }: Props) {
  const zero = useZero();
  const [team] = useQuery(queries.teams.bySlug({ slug: teamSlug }));
  const [members] = useQuery(
    queries.teamMembers.withUser({ teamId: team?.id })
  );
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"All" | "Admin" | "Member">("All");

  const filteredMembers = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return members.filter((member) => {
      const name =
        member.user?.profile?.name || member.user?.username || "Unknown";
      const email = member.user?.email || "";
      const matchesSearch =
        name.toLowerCase().includes(normalizedSearch) ||
        email.toLowerCase().includes(normalizedSearch);
      const matchesRole =
        filter === "All" || member.role.toLowerCase() === filter.toLowerCase();

      return matchesSearch && matchesRole;
    });
  }, [members, search, filter]);

  const handleLeave = async (memberId: string) => {
    try {
      await zero.mutate(mutators.team_member.delete({ id: memberId }));
      toast.success("Member removed successfully");
    } catch (_error) {
      toast.error("Failed to remove member");
    }
  };

  return (
    <div className="container mx-auto space-y-6 py-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link className="hover:opacity-80" href="/teams">
          <ChevronLeft className="size-6" />
        </Link>
        <div className="flex items-center space-x-3">
          <div className="flex size-6 items-center justify-center rounded bg-green-500/20">
            <span className="text-green-500">$</span>
          </div>
          <h1 className="font-bold text-2xl tracking-tight">
            Product team members
          </h1>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex max-w-xl flex-1 items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-9"
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email"
              value={search}
            />
          </div>
          <Select
            onValueChange={(value) => setFilter(value as typeof filter)}
            value={filter}
          >
            <SelectTrigger className="w-32">
              <SelectValue>{filter}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="Admin">Admin</SelectItem>
              <SelectItem value="Member">Member</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button>
          <Plus className="mr-2 size-4" />
          Add a member
        </Button>
      </div>

      {/* Members Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead className="w-[50px]" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredMembers.map((member) => {
            const displayName =
              member.user?.profile?.name || member.user?.username || "Unknown";
            const initials = displayName
              .trim()
              .split(" ")
              .filter(Boolean)
              .map((word) => word[0]?.toUpperCase() ?? "")
              .join("");

            return (
              <TableRow key={member.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage
                        src={member.user?.profile?.avatar ?? undefined}
                      />
                      <AvatarFallback>{initials || "?"}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{displayName}</div>
                      <div className="text-muted-foreground text-sm">
                        {member.user?.username || ""}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {member.user?.email || ""}
                </TableCell>
                <TableCell>{member.role}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="sm" variant="ghost">
                        <MoreHorizontal className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => handleLeave(member.id)}
                      >
                        Leave team...
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
