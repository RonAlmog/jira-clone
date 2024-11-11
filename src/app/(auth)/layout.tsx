"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface AuthLayoutProps {
  children: React.ReactNode;
}
const AuthLayout = ({ children }: AuthLayoutProps) => {
  const pathname = usePathname();
  const isSignIn = pathname === "/sign-in";
  return (
    <main className="bg-neutral-100 min-h-screen">
      <nav className="flex justify-between items-center">
        <div className="flex items-center p-2">
          <Image
            src="/jiraclone.svg"
            height={42}
            width={150}
            alt="Logo"
            priority
          />
        </div>
        <Button variant="secondary" asChild>
          <Link href={isSignIn ? "/sign-up" : "sign-in"}>
            {isSignIn ? "Sign Up" : "Login"}
          </Link>
        </Button>
      </nav>
      <div className="flex flex-col items-center justify-center pt-4 md:pt-14">
        {/* <div className="mx-auto max-w-screen-2xl p-4">{children}</div> */}
        {children}
      </div>
    </main>
  );
};

export default AuthLayout;
