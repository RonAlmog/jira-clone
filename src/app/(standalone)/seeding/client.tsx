"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useSeedWorkspaces } from "@/features/seeding/api/use-seed-workspaces";
import { Loader } from "lucide-react";

import { toast } from "sonner";

export const SeedingPageClient = () => {
  const { mutate: seedWorkspaces, isPending: isWorkspacePending } =
    useSeedWorkspaces();

  const handleSeedWorkspaces = () => {
    const result = seedWorkspaces(undefined, {
      onSuccess: () => {
        console.log("success");
        toast.success("Workspaces seeded");
      },
      onError: () => {
        toast.error("That didnt work well");
      },
    });
    console.log({ result });
  };
  return (
    <div className="flex w-full h-full items-center justify-center">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Seeding</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-x-3">
            <Button onClick={handleSeedWorkspaces}>
              {isWorkspacePending && <Loader className="size-5 animate-spin" />}
              Workspaces
            </Button>
            <Button>Members</Button>
            <Button>Projects</Button>
            <Button>Tasks</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
