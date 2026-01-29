import { useQuery } from "@tanstack/react-query"
import { fetchDashboardContent } from "../services/contentService"

export function useDashboardContent() {
  return useQuery({
    queryKey: ["dashboard-content"],
    queryFn: fetchDashboardContent,
    refetchOnWindowFocus: false,
  })
}
