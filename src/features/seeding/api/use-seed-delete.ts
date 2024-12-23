import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<
  (typeof client.api.seeding.deleteall)["$post"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.seeding.deleteall)["$post"]
>;

export const useSeedDelete = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.seeding.deleteall["$post"]({ json });
      if (!response.ok) {
        throw new Error("Failed to delete");
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success("Deleted");
      queryClient.invalidateQueries({ queryKey: ["delete-all"] });
    },
    onError: () => {
      toast.error("Failed to delete");
    },
  });

  return mutation;
};
