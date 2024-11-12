"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCurrent } from "@/features/auth/api/use-current";
import { useLogout } from "@/features/auth/api/use-logout";
import { UserButton } from "@/features/auth/components/user-button";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const { data, isLoading } = useCurrent();
  const { mutate } = useLogout();

  useEffect(() => {
    if (!data && !isLoading) {
      router.push("/sign-in");
    }
  }, [data]);
  return (
    <div className="flex flex-col gap-4 w-40 p-2">
      only logged in users!
      <UserButton />
      {/* <Button variant="primary" size="lg">
        Primary
      </Button>
      <Button variant="secondary" size="sm">
        Secondary
      </Button>
      <Button variant="destructive">destructive</Button>
      <Button variant="ghost">ghost</Button>
      <Button variant="link">Link</Button>
      <Button variant="outline">outline</Button>
      <Button variant="muted">Muted</Button>
      <Button variant="teritary">teritary</Button>
      <Input /> */}
    </div>
  );
}
