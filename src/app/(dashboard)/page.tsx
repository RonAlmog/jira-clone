import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getCurrent } from "@/features/auth/actions";
import { useCurrent } from "@/features/auth/api/use-current";
import { useLogout } from "@/features/auth/api/use-logout";
import { UserButton } from "@/features/auth/components/user-button";
import { CreateWorkspaceForm } from "@/features/workspaces/components/create-workspace-form";
import { redirect, useRouter } from "next/navigation";
import { useEffect } from "react";

export default async function Home() {
  const user = await getCurrent();
  if (!user) {
    redirect("/sign-in");
  }
  return (
    <div>
      <CreateWorkspaceForm />
    </div>
  );
}
