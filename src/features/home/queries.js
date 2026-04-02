import { useQuery } from "@tanstack/react-query";
import { fetchBestSellers, fetchSiteContent } from "@/services/homeService";
import { homeQueryKeys } from "./queryKeys";

export function useSiteContentQuery() {
  return useQuery({
    queryKey: homeQueryKeys.content(),
    queryFn: fetchSiteContent,
    staleTime: 1000 * 15,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
  });
}

export function useBestSellersQuery(limit = 8) {
  return useQuery({
    queryKey: homeQueryKeys.bestSellers(limit),
    queryFn: () => fetchBestSellers(limit),
    staleTime: 1000 * 15,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
  });
}
