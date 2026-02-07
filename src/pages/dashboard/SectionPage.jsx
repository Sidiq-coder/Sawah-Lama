import { useMemo } from "react"
import { useParams } from "react-router-dom"
import { useQueryClient } from "@tanstack/react-query"
import { useDashboardContent } from "../../hooks/useDashboardContent"
import SimpleCrudSection from "../../components/dashboard/SimpleCrudSection"
import GalleryMediaManager from "../../components/dashboard/GalleryMediaManager"
import WilayahMapEditor from "../../components/dashboard/WilayahMapEditor"
import { uploadFileToR2, uploadImageToR2 } from "../../services/r2Service"
import { createRecord, deleteRecord, updateRecord, saveWilayahMap } from "../../services/adminService"
import { dashboardSections } from "./sectionsConfig"
import { buildNewsPath } from "../../utils/news"

export default function SectionPage() {
  const { sectionKey } = useParams()
  const queryClient = useQueryClient()
  const { data, isLoading, error } = useDashboardContent()

  const section = useMemo(
    () => dashboardSections.find((item) => item.path.endsWith(`/${sectionKey}`)),
    [sectionKey],
  )
  const isGallerySection = section?.customComponent === "gallery"
  const isWilayahSection = section?.customComponent === "wilayahMap"

  const sectionFields = useMemo(() => {
    if (!section) return []
    if (section.key === "organization") {
      const positionOptions = (data?.organizationPositions || [])
        .slice()
        .sort((a, b) => (Number(a?.sort_order) || 0) - (Number(b?.sort_order) || 0))
        .map((pos) => ({ value: pos.id, label: pos.title }))
      return section.fields.map((field) =>
        field.name === "position_id" ? { ...field, options: positionOptions } : field,
      )
    }
    if (section.key === "services") {
      const newsOptions = (data?.newsPosts || []).map((item) => ({
        value: buildNewsPath(item),
        label: item.title || "Berita",
      }))
      return section.fields.map((field) =>
        field.name === "cta_link_picker" ? { ...field, options: newsOptions } : field,
      )
    }
    return section.fields
  }, [section, data])

  const sectionItems = useMemo(() => {
    if (!section) return []
    const items = data?.[section.key] || []
    if (section.key === "services") {
      const newsLinks = new Set((data?.newsPosts || []).map((item) => buildNewsPath(item)))
      return items.map((item) => ({
        ...item,
        cta_link_picker: newsLinks.has(item.cta_link) ? item.cta_link : "",
      }))
    }
    return items
  }, [section, data])

  const refreshContent = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["dashboard-content"] }),
      queryClient.invalidateQueries({ queryKey: ["public-content"] }),
    ])
  }

  const handleSave = async (payload, id) => {
    if (!section) return
    const prepared = { ...payload }
    if (section.key === "services") {
      if (prepared.cta_link_picker) {
        prepared.cta_link = prepared.cta_link_picker
      }
      delete prepared.cta_link_picker
    }
    if (section.table === "gallery_items") {
      if (!prepared.image_url) {
        prepared.image_url = prepared.cover_url || ""
      }
    }
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

  const handleWilayahMapSave = async (payload) => {
    await saveWilayahMap(payload)
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
        items={sectionItems}
        fields={sectionFields}
        imageFields={section.imageFields || []}
        onUploadImage={section.imageFields?.length ? uploadImageToR2 : undefined}
        onSave={handleSave}
        onDelete={handleDelete}
        getGroupKey={
          section.key === "organization"
            ? (item) => item.position_id || "__unassigned__"
            : undefined
        }
        groupConfig={
          section.key === "organization"
            ? {
                order: (data?.organizationPositions || [])
                  .slice()
                  .sort((a, b) => (Number(a?.sort_order) || 0) - (Number(b?.sort_order) || 0))
                  .map((pos) => ({ key: pos.id, label: pos.title })),
                labels: { __unassigned__: "Anggota lainnya" },
                fallbackLabel: "Posisi lainnya",
              }
            : undefined
        }
      />

      {isGallerySection ? (
        <GalleryMediaManager
          galleries={data?.galleryItems || []}
          media={data?.galleryMedia || []}
          relationKey="gallery_item_id"
          title="Media Galeri"
          description="Kelola foto & video per galeri"
          emptyStateMessage="Tambahkan galeri terlebih dahulu untuk mengunggah media."
          selectLabel="Pilih Galeri"
          activeLabelPrefix="Galeri aktif"
          collectionName="galeri"
          uploadFolder="gallery"
          onSave={handleGalleryMediaSave}
          onDelete={handleGalleryMediaDelete}
          onUploadFile={uploadFileToR2}
        />
      ) : null}

      {isWilayahSection ? (
        <WilayahMapEditor mapData={data?.wilayahMap} onSave={handleWilayahMapSave} />
      ) : null}
    </div>
  )
}
