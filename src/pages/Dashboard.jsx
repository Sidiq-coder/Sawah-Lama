import { useMemo } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { useDashboardContent } from "../hooks/useDashboardContent"
import SimpleCrudSection from "../components/dashboard/SimpleCrudSection"
import AboutInfoForm from "../components/dashboard/AboutInfoForm"
import NewsManager from "../components/dashboard/NewsManager"
import { supabase } from "../lib/supabaseClient"
import {
  createRecord,
  updateRecord,
  deleteRecord,
  saveAboutInfo,
  saveNewsPost,
} from "../services/adminService"
import { uploadImageToR2 } from "../services/r2Service"

const sectionsConfig = [
  {
    key: "heroSlides",
    table: "hero_slides",
    title: "Hero Slides",
    description: "Atur konten slider utama.",
    fields: [
      { name: "title", label: "Judul", placeholder: "Judul slide" },
      { name: "description", label: "Deskripsi", type: "textarea", placeholder: "Deskripsi singkat" },
      { name: "cta_label", label: "Label Tombol", placeholder: "Baca Selengkapnya" },
      { name: "cta_href", label: "Tautan Tombol", placeholder: "#tentang" },
      { name: "sort_order", label: "Urutan", type: "number", helper: "Angka kecil muncul lebih dulu." },
    ],
  },
  {
    key: "featureCards",
    table: "feature_cards",
    title: "Kartu Informasi",
    description: "Kelola highlight singkat pada bagian atas situs.",
    fields: [
      { name: "title", label: "Judul" },
      { name: "description", label: "Deskripsi", type: "textarea" },
      { name: "icon", label: "Emoji/Icon" },
      { name: "image_url", label: "URL Gambar", placeholder: "https://" },
      { name: "sort_order", label: "Urutan", type: "number" },
    ],
    imageFields: ["image_url"],
  },
  {
    key: "services",
    table: "services",
    title: "Layanan",
    description: "Daftar layanan kelurahan.",
    fields: [
      { name: "title", label: "Judul" },
      { name: "description", label: "Deskripsi", type: "textarea" },
      { name: "icon", label: "Emoji/Icon" },
      { name: "sort_order", label: "Urutan", type: "number" },
    ],
  },
  {
    key: "organization",
    table: "organization_members",
    title: "Struktur Organisasi",
    description: "Atur data pejabat kelurahan.",
    fields: [
      { name: "name", label: "Nama" },
      { name: "role", label: "Jabatan" },
      { name: "nip", label: "NIP" },
      { name: "image_url", label: "Foto", placeholder: "https://" },
      { name: "sort_order", label: "Urutan", type: "number" },
    ],
    imageFields: ["image_url"],
  },
  {
    key: "galleryItems",
    table: "gallery_items",
    title: "Galeri",
    description: "Unggah dokumentasi kegiatan.",
    fields: [
      { name: "title", label: "Judul" },
      { name: "caption", label: "Keterangan", type: "textarea" },
      { name: "cover_url", label: "Cover", placeholder: "https://" },
      { name: "sort_order", label: "Urutan", type: "number" },
    ],
    imageFields: ["cover_url"],
  },
  {
    key: "dataGroups",
    table: "data_groups",
    title: "Kelompok Data",
    description: "Daftar konten pada bagian Data.",
    fields: [
      { name: "title", label: "Judul" },
      {
        name: "items",
        label: "Entri Data",
        type: "dataPairs",
        helper: "Isi nama data dan keterangannya per baris.",
      },
      { name: "sort_order", label: "Urutan", type: "number" },
    ],
  },
  {
    key: "wilayahInfo",
    table: "wilayah_stats",
    title: "Statistik Wilayah",
    description: "Informasi ringkas wilayah.",
    fields: [
      { name: "label", label: "Label" },
      { name: "value", label: "Nilai" },
      { name: "sort_order", label: "Urutan", type: "number" },
    ],
  },
  {
    key: "contactInfo",
    table: "contact_info",
    title: "Kontak",
    description: "Informasi kontak resmi.",
    fields: [
      { name: "label", label: "Label" },
      { name: "value", label: "Nilai", type: "textarea" },
      { name: "sort_order", label: "Urutan", type: "number" },
    ],
  },
]

export default function DashboardPage() {
  const queryClient = useQueryClient()
  const { data, isLoading, error } = useDashboardContent()

  const refreshContent = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["dashboard-content"] }),
      queryClient.invalidateQueries({ queryKey: ["public-content"] }),
    ])
  }

  const handleSave = (table, key) => async (payload, id) => {
    const prepared = { ...payload }
    if (typeof prepared.sort_order === "undefined" || prepared.sort_order === "") {
      prepared.sort_order = (data?.[key]?.length || 0) + 1
    } else {
      prepared.sort_order = Number(prepared.sort_order) || 0
    }
    if (id) {
      await updateRecord(table, id, prepared)
    } else {
      await createRecord(table, prepared)
    }
    await refreshContent()
  }

  const handleDelete = (table) => async (id) => {
    await deleteRecord(table, id)
    await refreshContent()
  }

  const handleAboutSave = async (payload) => {
    await saveAboutInfo(payload)
    await refreshContent()
  }

  const handleNewsSave = async (payload, id) => {
    const input = { ...payload }
    if (id) {
      input.id = id
    }
    await saveNewsPost(input)
    await refreshContent()
  }

  const handleNewsDelete = async (id) => {
    await deleteRecord("news_posts", id)
    await refreshContent()
  }

  const handleUploadImage = async (file) => {
    const url = await uploadImageToR2(file)
    return url
  }

  const handleSignOut = async () => {
    await supabase?.auth?.signOut()
    await queryClient.invalidateQueries({ queryKey: ["dashboard-content"] })
  }

  const sections = useMemo(() => sectionsConfig, [])

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6 text-center">
        <div className="max-w-md space-y-4 rounded-3xl bg-white p-8 shadow-soft">
          <p className="text-lg font-semibold text-slate-900">Gagal memuat dashboard</p>
          <p className="text-sm text-slate-600">{error.message}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="container-section flex flex-wrap items-center justify-between gap-3 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-brand-600">Dashboard</p>
            <h1 className="text-xl font-semibold text-slate-900">Kelurahan Sawah Lama</h1>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href="/"
              className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
            >
              Lihat Situs
            </a>
            <button
              type="button"
              onClick={handleSignOut}
              className="rounded-full bg-brand-700 px-4 py-2 text-sm font-semibold text-white"
            >
              Keluar
            </button>
          </div>
        </div>
      </header>

      <main className="container-section space-y-6 py-8">
        {isLoading ? (
          <div className="grid gap-4 lg:grid-cols-2">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="h-48 animate-pulse rounded-3xl bg-white" />
            ))}
          </div>
        ) : null}

        {data ? (
          <>
            <AboutInfoForm data={data.aboutInfo} onSave={handleAboutSave} />

            {sections.map((section) => (
              <SimpleCrudSection
                key={section.key}
                title={section.title}
                description={section.description}
                items={data[section.key] || []}
                fields={section.fields}
                imageFields={section.imageFields || []}
                onUploadImage={section.imageFields?.length ? handleUploadImage : undefined}
                onSave={(values, id) => handleSave(section.table, section.key)(values, id)}
                onDelete={(id) => handleDelete(section.table)(id)}
              />
            ))}

            <NewsManager
              news={data.newsPosts || []}
              onSave={handleNewsSave}
              onDelete={handleNewsDelete}
              onUploadCover={handleUploadImage}
            />
          </>
        ) : null}
      </main>
    </div>
  )
}
