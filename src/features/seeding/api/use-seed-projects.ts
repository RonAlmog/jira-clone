import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<
  (typeof client.api.seeding.projects)["$post"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.seeding.projects)["$post"]
>;

export const useSeedProjects = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.seeding.projects["$post"]({ json });
      if (!response.ok) {
        throw new Error("Failed to seed projects");
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success("Projects seeded");
      queryClient.invalidateQueries({ queryKey: ["seed-projects"] });
    },
    onError: () => {
      toast.error("Failed to seed projects");
    },
  });

  return mutation;
};
