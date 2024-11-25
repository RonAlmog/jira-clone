import Image from "next/image";
import Link from "next/link";
import { DottedSeparator } from "./dotted-separator";
import Navigation from "./navigation";
import { WorkspaceSwitcher } from "./workspaces-switcher";
import { Projects } from "./projects";

export const Sidebar = () => {
  return (
    <aside className="h-full bg-neutral-100 p-4 w-full">
      <Link href="/">
        <Image src="/jiraclone.svg" height={40} width={202} alt="Logo" />
      </Link>
      <DottedSeparator className="my-4" />
      <WorkspaceSwitcher />
      <DottedSeparator className="my-4" />
      <Navigation />
      <DottedSeparator className="my-4" />
      <Projects />
    </aside>
  );
};
