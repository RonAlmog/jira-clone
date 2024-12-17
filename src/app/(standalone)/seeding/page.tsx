import { getCurrent } from "@/features/auth/queries";

import { redirect } from "next/navigation";
import { SeedingPageClient } from "./client";

const ProjectPage = async () => {
  const user = await getCurrent();
  if (!user) redirect("/sign-in");

  return <SeedingPageClient />;
};

export default ProjectPage;
