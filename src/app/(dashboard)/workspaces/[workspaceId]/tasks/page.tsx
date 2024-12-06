import { getCurrent } from "@/features/auth/queries";
import TaskViewSwitcher from "@/features/tasks/components/task-view-switcher";
import { redirect } from "next/navigation";

const MyTasksPage = async () => {
  const user = await getCurrent();
  if (!user) redirect("/sign-in");
  return (
    <div className="h-full flex flex-col">
      <TaskViewSwitcher />
    </div>
  );
};

export default MyTasksPage;
