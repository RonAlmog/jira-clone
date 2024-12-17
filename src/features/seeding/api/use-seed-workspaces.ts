import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<
  (typeof client.api.seeding.workspaces)["$post"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.seeding.workspaces)["$post"]
>;

export const useSeedWorkspaces = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async () => {
      const response = await client.api.seeding.workspaces["$post"]();
      if (!response.ok) {
        throw new Error("Failed to seed workspaces");
      }
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Workspaces seeded");
      queryClient.invalidateQueries({ queryKey: ["seed-workspaces"] });
    },
    onError: () => {
      toast.error("Failed to create project");
    },
  });

  return mutation;
};
