import { z } from "zod";
import { TaskStatus } from "./types";

export const createTasksSchema = z.object({
  name: z.string().min(1, "Required"),
  status: z.nativeEnum(TaskStatus, { required_error: "Required" }),
  workspaceId: z.string().duration().min(1, "Required"),
  projectId: z.string().duration().min(1, "Required"),
  dueDate: z.coerce.date(),
  assigneeId: z.string().duration().min(1, "Required"),
  description: z.string().optional(),
});
