import { getCurrent } from "@/features/auth/queries";
import { getMember } from "@/features/members/utils";
import { JoinWorkspaceForm } from "@/features/workspaces/components/join-workspace-form";
import { getWorkspaceInfo } from "@/features/workspaces/queries";
import { createSessionClient } from "@/lib/appwrite";
import { redirect } from "next/navigation";
import { workerData } from "worker_threads";

interface WorkspaceIdJoinProps {
  params: {
    workspaceId: string;
  };
}
const WorkspaceIdJoin = async ({ params }: WorkspaceIdJoinProps) => {
  const { databases, account } = await createSessionClient();
  const user = await getCurrent();

  if (!user) redirect("/sign-in");

  const initialValues = await getWorkspaceInfo({
    workspaceId: params.workspaceId,
  });

  if (!initialValues) redirect("/");

  return (
    <div className="w-full lg:max-w-xl">
      <JoinWorkspaceForm initialValues={initialValues} />
    </div>
  );
};

export default WorkspaceIdJoin;
