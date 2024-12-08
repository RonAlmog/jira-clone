import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/rpc";

interface UseGetPorjectProps {
  projectId: string;
}
export const useGetProject = ({ projectId }: UseGetPorjectProps) => {
  const query = useQuery({
    queryKey: ["project", projectId],
    queryFn: async () => {
      const response = await client.api.projects[":projectId"].$get({
        param: { projectId },
      });
      if (!response.ok) {
        // return null;
        throw new Error("Failed to fetch project");
      }

      const { data } = await response.json();
      return data;
    },
  });

  return query;
};
