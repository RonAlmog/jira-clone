import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<
  (typeof client.api.seeding.tasks)["$post"],
  200
>;
type RequestType = InferRequestType<(typeof client.api.seeding.tasks)["$post"]>;

export const useSeedTasks = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.seeding.tasks["$post"]({ json });
      if (!response.ok) {
        throw new Error("Failed to seed tasks");
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success("Tasks seeded");
      queryClient.invalidateQueries({ queryKey: ["seed-tasks"] });
    },
    onError: () => {
      toast.error("Failed to seed tasks");
    },
  });

  return mutation;
};
