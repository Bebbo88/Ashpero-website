import { useQuery } from "@tanstack/react-query";
import { fetchTips } from "@/services/tipService";
import { tipQueryKeys } from "./queryKeys";

export function useTipsQuery(locale = "en", initialData = null) {
  return useQuery({
    queryKey: tipQueryKeys.list(locale),
    queryFn: () => fetchTips(locale),
    initialData: initialData && initialData.length > 0 ? initialData : undefined,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    gcTime: 1000 * 60 * 60 * 24 * 7, // 7 days
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}
