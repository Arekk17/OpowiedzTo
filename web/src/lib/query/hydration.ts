import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { getServerQueryClient } from "./server";

export { HydrationBoundary, dehydrate };

export async function prefetchQuery<T>(
  queryKey: string[],
  queryFn: () => Promise<T>
) {
  const queryClient = getServerQueryClient();

  await queryClient.prefetchQuery({
    queryKey,
    queryFn,
  });

  return dehydrate(queryClient);
}
