"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSeedDelete } from "@/features/seeding/api/use-seed-delete";
import { useSeedMembers } from "@/features/seeding/api/use-seed-members";
import { useSeedProjects } from "@/features/seeding/api/use-seed-projects";
import { useSeedTasks } from "@/features/seeding/api/use-seed-tasks";

import { useSeedWorkspaces } from "@/features/seeding/api/use-seed-workspaces";
import { Loader } from "lucide-react";

import { toast } from "sonner";

export const SeedingPageClient = () => {
  const { mutate: seedWorkspaces, isPending: isWorkspacePending } =
    useSeedWorkspaces();

  const { mutate: seedMembers, isPending: isMembersPending } = useSeedMembers();
  const { mutate: seedProjects, isPending: isPendingProjects } =
    useSeedProjects();
  const { mutate: seedTasks, isPending: isTasksPending } = useSeedTasks();
  const { mutate: deleteAll, isPending: isDeletePending } = useSeedDelete();

  const handleSeedWorkspaces = () => {
    const result = seedWorkspaces(
      { json: { deleteAll: true } },
      {
        onSuccess: () => {
          toast.success("Workspaces seeded");
        },
        onError: () => {
          toast.error("That didnt work well");
        },
      }
    );
    console.log({ result });
  };
  const handleSeedMembers = () => {
    const result = seedMembers(
      { json: { deleteAll: true } },
      {
        onSuccess: () => {
          toast.success("Members seeded");
        },
        onError: () => {
          toast.error("That didnt work well");
        },
      }
    );
    console.log({ result });
  };
  const handleSeedProjects = () => {
    const result = seedProjects(
      { json: { deleteAll: true } },
      {
        onSuccess: () => {
          toast.success("Projects seeded");
        },
        onError: () => {
          toast.error("That didnt work well");
        },
      }
    );
    console.log({ result });
  };
  const handleSeedTasks = () => {
    const result = seedTasks(
      { json: { deleteAll: true } },
      {
        onSuccess: () => {
          toast.success("Tasks seeded");
        },
        onError: () => {
          toast.error("That didnt work well");
        },
      }
    );
    console.log({ result });
  };

  const handleDelete = () => {
    const result = deleteAll(
      { json: { deleteAll: true } },
      {
        onSuccess: () => {
          toast.success("Tasks seeded");
        },
        onError: () => {
          toast.error("That didnt work well");
        },
      }
    );
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
            <Button onClick={handleSeedMembers}>
              {isMembersPending && <Loader className="size-5 animate-spin" />}
              Members
            </Button>
            <Button onClick={handleSeedProjects}>
              {isPendingProjects && <Loader className="size-5 animate-spin" />}
              Projects
            </Button>
            <Button onClick={handleSeedTasks}>
              {isTasksPending && <Loader className="size-5 animate-spin" />}
              Tasks
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              {isDeletePending && <Loader className="size-5 animate-spin" />}
              Delete
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
