import { useQueryClient } from "@tanstack/react-query"
import { useDashboardContent } from "../../hooks/useDashboardContent"
import AboutInfoForm from "../../components/dashboard/AboutInfoForm"
import { saveAboutInfo } from "../../services/adminService"

export default function AboutPage() {
  const queryClient = useQueryClient()
  const { data, isLoading, error } = useDashboardContent()

  const handleSave = async (payload) => {
    await saveAboutInfo(payload)
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["dashboard-content"] }),
      queryClient.invalidateQueries({ queryKey: ["public-content"] }),
    ])
  }

  if (error) {
    return (
      <div className="rounded-3xl bg-white p-8 shadow-soft ring-1 ring-slate-100">
        <p className="text-lg font-semibold text-slate-900">Gagal memuat data</p>
        <p className="mt-2 text-sm text-slate-500">{error.message}</p>
      </div>
    )
  }

  if (isLoading) {
    return <div className="h-48 animate-pulse rounded-3xl bg-white" />
  }

  return <AboutInfoForm data={data?.aboutInfo} onSave={handleSave} />
}
