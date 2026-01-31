import { useMemo } from "react"
import { useParams } from "react-router-dom"
import { useQueryClient } from "@tanstack/react-query"
import { useDashboardContent } from "../../hooks/useDashboardContent"
import SimpleCrudSection from "../../components/dashboard/SimpleCrudSection"
import GalleryMediaManager from "../../components/dashboard/GalleryMediaManager"
import { uploadFileToR2, uploadImageToR2 } from "../../services/r2Service"
import { createRecord, deleteRecord, updateRecord } from "../../services/adminService"
import { dashboardSections } from "./sectionsConfig"

export default function SectionPage() {
  const { sectionKey } = useParams()
  const queryClient = useQueryClient()
  const { data, isLoading, error } = useDashboardContent()

  const section = useMemo(
    () => dashboardSections.find((item) => item.path.endsWith(`/${sectionKey}`)),
    [sectionKey],
  )
  const isGallerySection = section?.customComponent === "gallery"

  const refreshContent = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["dashboard-content"] }),
      queryClient.invalidateQueries({ queryKey: ["public-content"] }),
    ])
  }

  const handleSave = async (payload, id) => {
    if (!section) return
    const prepared = { ...payload }
    if (typeof prepared.sort_order === "undefined" || prepared.sort_order === "") {
      prepared.sort_order = (data?.[section.key]?.length || 0) + 1
    } else {
      prepared.sort_order = Number(prepared.sort_order) || 0
    }

    if (id) {
      await updateRecord(section.table, id, prepared)
    } else {
      await createRecord(section.table, prepared)
    }

    await refreshContent()
  }

  const handleDelete = async (id) => {
    if (!section) return
    await deleteRecord(section.table, id)
    await refreshContent()
  }

  const handleGalleryMediaSave = async (payload, id) => {
    if (!payload.gallery_item_id) {
      throw new Error("Pilih galeri terlebih dahulu")
    }
    const prepared = {
      ...payload,
      sort_order: Number(payload.sort_order) || 0,
    }
    if (id) {
      await updateRecord("gallery_media", id, prepared)
    } else {
      await createRecord("gallery_media", prepared)
    }
    await refreshContent()
  }

  const handleGalleryMediaDelete = async (id) => {
    await deleteRecord("gallery_media", id)
    await refreshContent()
  }

  if (!section || !section.table) {
    return (
      <div className="rounded-3xl bg-white p-8 shadow-soft ring-1 ring-slate-100">
        <p className="text-lg font-semibold text-slate-900">Menu tidak ditemukan</p>
        <p className="mt-2 text-sm text-slate-500">Pilih menu di samping untuk mulai mengelola konten.</p>
      </div>
    )
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
    <div className="space-y-6">
      <SimpleCrudSection
        title={section.title}
        description={section.description}
        items={data?.[section.key] || []}
        fields={section.fields}
        imageFields={section.imageFields || []}
        onUploadImage={section.imageFields?.length ? uploadImageToR2 : undefined}
        onSave={handleSave}
        onDelete={handleDelete}
      />

      {isGallerySection ? (
        <GalleryMediaManager
          galleries={data?.galleryItems || []}
          media={data?.galleryMedia || []}
          onSave={handleGalleryMediaSave}
          onDelete={handleGalleryMediaDelete}
          onUploadFile={(file, options) => uploadFileToR2(file, { folder: "gallery", ...options })}
        />
      ) : null}
    </div>
  )
}
