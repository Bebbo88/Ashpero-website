import { useQuery } from "@tanstack/react-query";
import { fetchOffers } from "@/services/offerService";
import { offerQueryKeys } from "./queryKeys";

export function useOffersQuery() {
  return useQuery({
    queryKey: offerQueryKeys.list(),
    queryFn: fetchOffers,
    staleTime: 1000 * 30,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
  });
}
