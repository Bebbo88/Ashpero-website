import { useQuery } from "@tanstack/react-query";
import { fetchBestSellers, fetchSiteContent } from "@/services/homeService";
import { homeQueryKeys } from "./queryKeys";

const HOME_CACHE_STALE_TIME = 1000 * 60 * 60 * 24; // 24 hours
const HOME_CACHE_GC_TIME = 1000 * 60 * 60 * 24 * 7; // 7 days (safe 32-bit integer)

const HOME_QUERY_OPTIONS = {
  staleTime: HOME_CACHE_STALE_TIME,
  gcTime: HOME_CACHE_GC_TIME,
  refetchOnMount: false,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
};

export function useSiteContentQuery(options = {}) {
  return useQuery({
    queryKey: homeQueryKeys.content(),
    queryFn: fetchSiteContent,
    ...HOME_QUERY_OPTIONS,
    ...options,
  });
}

export function useBestSellersQuery(limit = 8) {
  return useQuery({
    queryKey: homeQueryKeys.bestSellers(limit),
    queryFn: () => fetchBestSellers(limit),
    ...HOME_QUERY_OPTIONS,
  });
}
