"use client";

import Analytics from "@/components/analytics";
import PageError from "@/components/page-error";
import PageLoader from "@/components/page-loader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetProject } from "@/features/projects/api/use-get-project";
import { useGetProjectAnalytics } from "@/features/projects/api/use-get-project-analytics";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { useProjectId } from "@/features/projects/hooks/use-project-id";
import { useSeedWorkspaces } from "@/features/seeding/api/use-seed-workspaces";
import TaskViewSwitcher from "@/features/tasks/components/task-view-switcher";
import { Divide, PencilIcon } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export const SeedingPageClient = () => {
  const { mutate: seedWorkspaces, isPending: isWorkspacePending } =
    useSeedWorkspaces();

  const isPending = isWorkspacePending;
  const handleSeedWorkspaces = async () => {
    const result = await seedWorkspaces(
      {},
      {
        onSuccess: () => {
          console.log("success");
          toast.success("Workspaces seeded");
        },
        onError: () => {
          toast.error("That didnt work well");
        },
      }
    );
  };
  return (
    <div className="flex w-full h-full items-center justify-center">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Seeding</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-x-3">
            <Button onClick={handleSeedWorkspaces} disabled={isPending}>
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
