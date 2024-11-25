import { getCurrent } from "@/features/auth/queries";
import { redirect } from "next/navigation";

interface ProjectPageProps {
  params: { projectId: string };
}
const ProjectPage = async ({ params }: ProjectPageProps) => {
  const user = await getCurrent();
  if (!user) redirect("/sign-in");

  return <div>projectId: {params.projectId}</div>;
};

export default ProjectPage;
