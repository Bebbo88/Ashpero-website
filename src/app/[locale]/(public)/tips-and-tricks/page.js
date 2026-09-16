import React from "react";
import TipsAndTricksClient from "./TipsAndTricksClient";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { fetchTips } from "@/services/tipService";
import { tipQueryKeys } from "@/features/tips/queryKeys";
import { buildPageMetadata } from "@/utils/pageMetadata";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  return buildPageMetadata({
    path: "/tips-and-tricks",
    title: "Tips & Tricks | Ashperoo",
    description:
      "Expert skincare tips and tricks from Ashperoo to help you get the most out of your routine.",
    locale,
  });
}

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
