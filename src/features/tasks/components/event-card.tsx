import { Project } from "@/features/projects/types";
import { TaskStatus } from "../types";
import { cn } from "@/lib/utils";

interface EventCardProps {
  title: string;
  assignee: any;
  project: Project;
  status: TaskStatus;
  id: string;
}

const EventCard = ({
  title,
  assignee,
  project,
  status,
  id,
}: EventCardProps) => {
  return (
    <div className="px-2">
      <div
        className={cn(
          "flex flex-col gap-y-1.5 p-1.5 text-xs bg-white text-primary border rounded-md border-l-4 cursor-pointer hover:opacity-75 transition"
        )}
      >
        {title}
      </div>
    </div>
  );
};

export default EventCard;
