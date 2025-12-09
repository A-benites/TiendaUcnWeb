import { useQuery } from "@tanstack/react-query";
import { getFiltersData, FiltersData } from "@/services/filters.service";

/**
 * Hook to fetch available filter options (categories and brands)
 * Cached for 5 minutes to avoid repeated requests
 */
export function useFiltersData() {
  return useQuery<FiltersData>({
    queryKey: ["filtersData"],
    queryFn: getFiltersData,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}
