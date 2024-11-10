import { Button } from "@/components/ui/button";
import Image from "next/image";

interface AuthLayoutProps {
  children: React.ReactNode;
}
const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <main className="bg-neutral-100 min-h-screen">
      <nav className="flex justify-between items-center">
        <div className="flex items-center p-2">
          <Image src="/jiraclone.svg" height={56} width={152} alt="Logo" />
        </div>
        <Button variant="secondary">Sign Up</Button>
      </nav>
      <div className="flex flex-col items-center justify-center pt-4 md:pt-14">
        <div className="mx-auto max-w-screen-2xl p-4">{children}</div>
      </div>
    </main>
  );
};

export default AuthLayout;
