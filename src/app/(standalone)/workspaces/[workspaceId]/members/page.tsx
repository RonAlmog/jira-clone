import { getCurrent } from "@/features/auth/queries";
import MembersList from "@/features/members/components/members-list";
import { redirect } from "next/navigation";

// server page that calls use-client component
const WorkspaceIdMembersPage = async () => {
  return (
    <div className="w-full lg:max-w-xl">
      <MembersList />
    </div>
  );
};

export default WorkspaceIdMembersPage;
