"use client";

import { useQuery } from "@rocicorp/zero/react";
import { LogOut, MoreVertical, Plus, Settings2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useZero } from "@/hooks/use-zero";
import { mutators } from "@/lib/zero/mutators";
import { queries } from "@/lib/zero/queries";

export default function Page() {
  const zero = useZero();
  const router = useRouter();
  // const [isLoading, setIsLoading] = useState(true);

  const [workspaces] = useQuery(queries.workspaces.all());

  const handleLeave = async (workspaceId: string) => {
    try {
      await zero.mutate(mutators.workspace.delete({ id: workspaceId }));
      toast.success("Left workspace successfully");
    } catch (_error) {
      toast.error("Failed to leave workspace");
    }
  };

  const handleSettings = (workspaceSlug: string) => {
    router.push(`/${workspaceSlug}/settings/general`);
  };

  const handleNewWorkspace = () => {
    router.push("/workspaces/new");
  };

  return (
    <div className="container mx-auto py-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-bold text-2xl tracking-tight">Workspaces</h1>
            <p className="text-muted-foreground">
              Manage your workspace settings and collaborations
            </p>
          </div>
          <Button onClick={handleNewWorkspace}>
            <Plus className="mr-2 size-4" />
            New workspace
          </Button>
        </div>

        {/* Workspace List */}
        <div className="space-y-4">
          {workspaces.length === 0 ? (
            <Card>
              <CardContent className="py-8">
                <div className="text-center">
                  <h3 className="font-medium">No workspaces found</h3>
                  <p className="mt-1 text-muted-foreground text-sm">
                    Create a new workspace to get started
                  </p>
                  <Button
                    className="mt-4"
                    onClick={handleNewWorkspace}
                    variant="outline"
                  >
                    <Plus className="mr-2 size-4" />
                    Create workspace
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            workspaces.map((workspace) => (
              <Card key={workspace.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div>
                        <h3 className="font-medium">{workspace.name}</h3>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button
                        onClick={() => handleSettings(workspace.slug)}
                        size="sm"
                        variant="ghost"
                      >
                        <Settings2 className="size-4" />
                        <span className="ml-2">Settings</span>
                      </Button>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="sm" variant="ghost">
                            <MoreVertical className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => handleSettings(workspace.slug)}
                          >
                            <Settings2 className="mr-2 size-4" />
                            Settings
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            className="cursor-pointer text-red-600"
                            onClick={() => handleLeave(workspace.id)}
                          >
                            <LogOut className="mr-2 size-4" />
                            Leave workspace
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
