import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/rpc";

export const useGetWrokspaces = () => {
  const query = useQuery({
    queryKey: ["workspaces"],
    queryFn: async () => {
      const response = await client.api.workspaces.$get();
      if (!response.ok) {
        // return null;
        throw new Error("Failed to fetch workspaces");
      }

      const { data } = await response.json();
      return data;
    },
  });

  return query;
};
