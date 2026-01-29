import { useQuery } from "@tanstack/react-query"
import { fetchPublicContent } from "../services/contentService"

export function usePublicContent() {
  return useQuery({
    queryKey: ["public-content"],
    queryFn: fetchPublicContent,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  })
}
