"use client";

import { Lock, Mail, Shield } from "lucide-react";
import { type ChangeEvent, useState } from "react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { UserSelect } from "@/components/user/user-select";
import { useZero } from "@/hooks/use-zero";
import { mutators } from "@/lib/zero/mutators";

export default function Page() {
  const zero = useZero();
  const fromProfileSwitch = UserSelect.useBlock();
  const { selectedUser } = fromProfileSwitch;

  const [isUploading, setIsUploading] = useState(false);

  const handleNameChange = async (e: ChangeEvent<HTMLInputElement>) => {
    try {
      if (selectedUser?.profile?.id) {
        await zero.mutate(
          mutators.profile.update({
            id: selectedUser?.profile?.id,
            name: e.target.value,
          })
        );
      }
    } catch (_error) {
      toast.error("Failed to update name");
    }
  };

  const handleAvatarUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) {
      return;
    }
    setIsUploading(true);

    try {
      // const file = e.target.files[0]
      // Implement your file upload logic here
      // await zero.mutate.user.update({
      //   id: user?.id,
      //   avatar: 'uploaded-url',
      // })
      toast.success("Profile picture updated successfully");
    } catch (_error) {
      toast.error("Failed to upload user picture");
    } finally {
      setIsUploading(false);
    }
  };

  const handleEmailChange = () => {
    // Implement email change modal/flow
    toast.info("Email change functionality coming soon");
  };

  const handlePasswordChange = () => {
    // Implement password change modal/flow
    toast.info("Password change functionality coming soon");
  };

  const handleVerificationAdd = () => {
    // Implement 2FA setup modal/flow
    toast.info("2FA setup functionality coming soon");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="container mx-auto max-w-3xl space-y-8 py-6">
      <div>
        <h1 className="font-bold text-2xl tracking-tight">Profile Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      {fromProfileSwitch.users.length > 1 && (
        <UserSelect {...fromProfileSwitch} />
      )}

      {/* Profile Section */}
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>
            Update your user information and picture
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="relative">
                    <Avatar className="size-20">
                      <AvatarImage src={selectedUser?.profile?.avatar || ""} />
                      <AvatarFallback>
                        {selectedUser?.profile?.name
                          ? getInitials(selectedUser?.profile?.name)
                          : "?"}
                      </AvatarFallback>
                    </Avatar>
                    <input
                      accept="image/*"
                      className="absolute inset-0 size-full cursor-pointer opacity-0"
                      disabled={isUploading}
                      onChange={handleAvatarUpload}
                      type="file"
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent>Click to change user picture</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <div className="flex-1">
              <label className="font-medium text-sm" htmlFor="preferred-name">
                Preferred name
              </label>
              <Input
                id="preferred-name"
                onChange={handleNameChange}
                placeholder="Enter your name"
                value={selectedUser?.profile?.name || ""}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Section */}
      <Card>
        <CardHeader>
          <CardTitle>Account Security</CardTitle>
          <CardDescription>
            Manage your account security settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Email */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <Mail className="size-4" />
                <h3 className="font-medium">Email</h3>
              </div>
              <p className="text-muted-foreground text-sm">
                {selectedUser?.email}
              </p>
            </div>
            <Button onClick={handleEmailChange} variant="outline">
              Change email
            </Button>
          </div>

          {/* Password */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <Lock className="size-4" />
                <h3 className="font-medium">Password</h3>
              </div>
              <p className="text-muted-foreground text-sm">
                Change your password to login to your account
              </p>
            </div>
            <Button onClick={handlePasswordChange} variant="outline">
              Change password
            </Button>
          </div>

          {/* 2FA */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <Shield className="size-4" />
                <h3 className="font-medium">2-step verification</h3>
              </div>
              <p className="text-muted-foreground text-sm">
                Add an additional layer of security to your account during login
              </p>
            </div>
            <Button onClick={handleVerificationAdd} variant="outline">
              Add verification
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
