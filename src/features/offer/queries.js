import { useQuery } from "@tanstack/react-query";
import { fetchOffers } from "@/services/offerService";
import { offerQueryKeys } from "./queryKeys";

export function useOffersQuery() {
  return useQuery({
    queryKey: offerQueryKeys.list(),
    queryFn: fetchOffers,
    staleTime: 1000 * 60 * 15, // 15 minutes
    gcTime: 1000 * 60 * 60, // 1 hour
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
}
