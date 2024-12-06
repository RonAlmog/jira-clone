"use client";

import PageError from "@/components/page-error";
import PageLoader from "@/components/page-loader";
import { useGetTask } from "@/features/tasks/api/use-get-task";
import { useTaskId } from "@/features/tasks/hooks/use-task-id";
import { getWorkspaces } from "@/features/workspaces/queries";

export const TaskPageClient = () => {
  const taskId = useTaskId();
  const { data, isLoading } = useGetTask({ taskId });

  if (isLoading) {
    return <PageLoader />;
  }
  if (!data) {
    <PageError message="Task not found" />;
  }
  return <p>{JSON.stringify(data)}</p>;
};
