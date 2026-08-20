import React from "react";
import TipsAndTricksClient from "./TipsAndTricksClient";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { fetchTips } from "@/services/tipService";
import { tipQueryKeys } from "@/features/tips/queryKeys";

// ISR: Revalidate cached tips daily
export const revalidate = 86400;

export default async function TipsAndTricksPage() {
  const queryClient = new QueryClient();

  try {
    await Promise.all([
      queryClient.prefetchQuery({
        queryKey: tipQueryKeys.list("en"),
        queryFn: () => fetchTips("en"),
      }),
      queryClient.prefetchQuery({
        queryKey: tipQueryKeys.list("ar"),
        queryFn: () => fetchTips("ar"),
      }),
    ]);
  } catch (error) {
    console.error("Error prefetching tips:", error);
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TipsAndTricksClient />
    </HydrationBoundary>
  );
}
