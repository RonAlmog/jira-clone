import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<
  (typeof client.api.seeding.members)["$post"],
  200
>;
// type RequestType = InferRequestType<
//   (typeof client.api.seeding)["workspaces"]["$post"]
// >;

export const useSeedMembers = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async () => {
      const response = await client.api.seeding.members["$post"]();
      if (!response.ok) {
        throw new Error("Failed to seed members");
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success("Members seeded");
      queryClient.invalidateQueries({ queryKey: ["seed-members"] });
    },
    onError: () => {
      toast.error("Failed to seed members");
    },
  });

  return mutation;
};
