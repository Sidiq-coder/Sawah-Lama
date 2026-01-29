import { useQueryClient } from "@tanstack/react-query"
import { useDashboardContent } from "../../hooks/useDashboardContent"
import NewsManager from "../../components/dashboard/NewsManager"
import { deleteRecord, saveNewsPost } from "../../services/adminService"
import { uploadFileToR2, uploadImageToR2 } from "../../services/r2Service"

export default function NewsPage() {
  const queryClient = useQueryClient()
  const { data, isLoading, error } = useDashboardContent()

  const refreshContent = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["dashboard-content"] }),
      queryClient.invalidateQueries({ queryKey: ["public-content"] }),
    ])
  }

  const handleSave = async (payload, id) => {
    const input = { ...payload }
    if (id) {
      input.id = id
    }
    await saveNewsPost(input)
    await refreshContent()
  }

  const handleDelete = async (id) => {
    await deleteRecord("news_posts", id)
    await refreshContent()
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

  return (
    <NewsManager
      news={data?.newsPosts || []}
      onSave={handleSave}
      onDelete={handleDelete}
      onUploadCover={uploadImageToR2}
      onUploadFile={(file, folder) => uploadFileToR2(file, { folder })}
    />
  )
}
