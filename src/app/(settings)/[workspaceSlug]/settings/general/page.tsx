"use client";

import * as React from "react";
import { useZero } from "@/hooks/use-zero";
import { useQuery } from "@rocicorp/zero/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Schema } from "@/schema";
import { ExternalLink, Upload } from "lucide-react";
import { useCallback } from "react";

type Props = {
  params: { workspaceSlug: string };
};

export default function Page({ params: { workspaceSlug } }: Props) {
  const zero = useZero();
  const [workspace] = useQuery(zero.query.workspace);
  const [isUploading, setIsUploading] = React.useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);

  const handleNameChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      await zero.mutate.workspace.update({
        id: workspace?.id,
        name: e.target.value,
      });
      toast.success("Name updated successfully");
    } catch (error) {
      toast.error("Failed to update name");
    }
  };

  const handleDelete = useCallback(async () => {
    try {
      await zero.mutate.workspace.delete({ id: workspace?.id });
      toast.success("Workspace scheduled for deletion");
      setDeleteDialogOpen(false);
    } catch (error) {
      toast.error("Failed to delete workspace");
    }
  }, []);

  return (
    <div className="container max-w-3xl mx-auto py-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Workspace Settings
        </h1>
        <p className="text-muted-foreground">
          Manage your workspace preferences and configuration
        </p>
      </div>

      {/* Branding */}
      <Card>
        <CardHeader>
          <CardTitle>Workspace</CardTitle>
          <CardDescription>
            Configure your workspace identity settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Name */}
          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              defaultValue={workspace?.name}
              onChange={handleNameChange}
              placeholder="Done"
            />
          </div>

          {/* URL */}
          <div className="space-y-2">
            <Label>URL</Label>
            <div className="flex items-center space-x-2">
              <Input
                value={`trydone.io/${workspace?.slug ?? ""}`}
                readOnly
                disabled
              />
              <Button variant="ghost" size="sm">
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>
            Irreversible and destructive actions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Delete workspace</h3>
              <p className="text-sm text-muted-foreground">
                Schedule workspace to be permanently deleted
              </p>
            </div>

            <Button variant="destructive" onClick={handleDelete}>
              Delete...
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
