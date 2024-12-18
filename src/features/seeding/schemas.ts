import { z } from "zod";

export const deleteAllSchema = z.object({
  deleteAll: z.boolean(),
});
