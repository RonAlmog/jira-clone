import MembersList from "@/features/members/components/members-list";

// server page that calls use-client component
const WorkspaceIdMembersPage = async () => {
  return (
    <div className="w-full lg:max-w-xl">
      <MembersList />
    </div>
  );
};

export default WorkspaceIdMembersPage;
