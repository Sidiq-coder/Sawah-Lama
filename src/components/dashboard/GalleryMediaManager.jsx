import { useEffect, useMemo, useState } from "react"
import { resolvePublicUrl } from "../../utils/media"

const mediaTypes = [
  { value: "image", label: "Foto" },
  { value: "video", label: "Video" },
]

const initialForm = {
  media_type: "image",
  url: "",
  caption: "",
  sort_order: 0,
}

export default function GalleryMediaManager({
  galleries = [],
  media = [],
  onSave,
  onDelete,
  onUploadFile,
  relationKey = "gallery_item_id",
  title = "Media Galeri",
  description = "Kelola foto & video per galeri",
  emptyStateMessage = "Tambahkan galeri terlebih dahulu untuk mengunggah media.",
  selectLabel = "Pilih Galeri",
  activeLabelPrefix = "Galeri aktif",
  collectionName = "galeri",
  uploadFolder = "gallery",
}) {
  const collections = Array.isArray(galleries) ? galleries : []
  const [selectedCollectionId, setSelectedCollectionId] = useState(collections[0]?.id || "")
  const [formState, setFormState] = useState(initialForm)
  const [editingId, setEditingId] = useState(null)
  const [status, setStatus] = useState({ type: "idle", message: "" })
  const [uploading, setUploading] = useState(false)
  const normalizedCollectionName = collectionName || "galeri"

  useEffect(() => {
    if (collections.length === 0) {
      setSelectedCollectionId("")
      return
    }
    if (!selectedCollectionId) {
      setSelectedCollectionId(collections[0].id)
    } else if (!collections.find((item) => item.id === selectedCollectionId)) {
      setSelectedCollectionId(collections[0].id)
    }
  }, [collections, selectedCollectionId])

  const collectionMedia = useMemo(() => {
    if (!selectedCollectionId) return []
    return media.filter((item) => item?.[relationKey] === selectedCollectionId)
  }, [media, relationKey, selectedCollectionId])

  const selectedCollection = collections.find((item) => item.id === selectedCollectionId)
  const formDisabled = !selectedCollectionId

  const resetForm = (clearStatus = true) => {
    setFormState(initialForm)
    setEditingId(null)
    if (clearStatus) {
      setStatus({ type: "idle", message: "" })
    }
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormState((prev) => ({ ...prev, [name]: value }))
  }

  const handleEdit = (item) => {
    setFormState({
      media_type: item.media_type || "image",
      url: item.url || "",
      caption: item.caption || "",
      sort_order: item.sort_order ?? 0,
    })
    setEditingId(item.id)
    setStatus({ type: "info", message: "Mengubah media" })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!selectedCollectionId || !onSave) return
    setStatus({ type: "loading", message: "Menyimpan media..." })
    try {
      const payload = {
        [relationKey]: selectedCollectionId,
        media_type: formState.media_type,
        url: formState.url,
        caption: formState.caption,
        sort_order: Number(formState.sort_order) || 0,
      }
      await onSave(payload, editingId)
      setStatus({ type: "success", message: "Media tersimpan" })
      resetForm(false)
    } catch (error) {
      setStatus({ type: "error", message: error.message || "Gagal menyimpan media" })
    }
  }

  const handleDelete = async (id) => {
    if (!onDelete || !id) return
    const confirmed = window.confirm("Hapus media ini?")
    if (!confirmed) return
    setStatus({ type: "loading", message: "Menghapus media..." })
    try {
      await onDelete(id)
      setStatus({ type: "success", message: "Media dihapus" })
      if (editingId === id) {
        resetForm(false)
      }
    } catch (error) {
      setStatus({ type: "error", message: error.message || "Gagal menghapus media" })
    }
  }

  const handleUpload = async (event) => {
    const input = event.target
    const files = Array.from(input.files || [])
    if (!files.length || !onUploadFile) return

    const bulkMode = files.length > 1
    if (bulkMode && (!selectedCollectionId || !onSave)) {
      setStatus({
        type: "error",
        message: `Pilih ${normalizedCollectionName} sebelum unggah banyak file`,
      })
      input.value = ""
      return
    }

    setUploading(true)
    setStatus({
      type: "loading",
      message: bulkMode ? `Mengunggah ${files.length} file...` : "Mengunggah ke R2...",
    })

    try {
      let nextOrder = collectionMedia.length
      for (const file of files) {
        const mediaType = file.type?.toLowerCase().startsWith("video") ? "video" : "image"
        const url = await onUploadFile(file, { folder: uploadFolder })

        if (bulkMode) {
          const payload = {
            [relationKey]: selectedCollectionId,
            media_type: mediaType,
            url,
            caption: "",
            sort_order: nextOrder,
          }
          await onSave(payload)
          nextOrder += 1
        } else {
          setFormState((prev) => ({ ...prev, media_type: mediaType, url }))
        }
      }

      setStatus({
        type: "success",
        message: bulkMode
          ? `${files.length} file ditambahkan ke ${normalizedCollectionName}`
          : "File berhasil diunggah",
      })
      if (bulkMode) {
        resetForm(false)
      }
    } catch (error) {
      setStatus({ type: "error", message: error.message || "Gagal mengunggah" })
    } finally {
      setUploading(false)
      if (input) input.value = ""
    }
  }

  return (
    <section className="rounded-3xl bg-white p-6 shadow-soft ring-1 ring-slate-100">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-brand-600">{title}</p>
          <h3 className="text-xl font-semibold text-slate-900">{description}</h3>
          {selectedCollection ? (
            <p className="text-sm text-slate-500">{activeLabelPrefix}: {selectedCollection.title}</p>
          ) : (
            <p className="text-sm text-slate-500">{emptyStateMessage}</p>
          )}
        </div>
        {status.type !== "idle" && status.message ? (
          <p
            className={`text-sm ${
              status.type === "error"
                ? "text-red-600"
                : status.type === "success"
                  ? "text-emerald-600"
                  : "text-slate-500"
            }`}
          >
            {status.message}
          </p>
        ) : null}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.6fr]">
        <div className="space-y-4">
          <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-600">
            {selectLabel}
            <select
              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-brand-500 focus:outline-none"
              value={selectedCollectionId}
              onChange={(event) => {
                setSelectedCollectionId(event.target.value)
                resetForm()
              }}
              disabled={!collections.length}
            >
              {collections.map((collection) => (
                <option key={collection.id} value={collection.id}>
                  {collection.title}
                </option>
              ))}
            </select>
          </label>

          <div className="space-y-3 rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
            {collectionMedia.length === 0 ? (
              <p className="text-sm text-slate-500">Belum ada media untuk {normalizedCollectionName} ini.</p>
            ) : (
              <ul className="space-y-3 text-sm">
                {collectionMedia.map((item) => {
                  const previewUrl = resolvePublicUrl(item.url)
                  return (
                    <li
                      key={item.id}
                      className="flex items-start justify-between gap-3 rounded-2xl bg-white p-3 shadow-sm"
                    >
                      <div>
                        <p className="font-semibold text-slate-900">{item.media_type === "video" ? "Video" : "Foto"}</p>
                        {item.caption ? (
                          <p className="text-xs text-slate-500">{item.caption}</p>
                        ) : null}
                        {previewUrl ? (
                          <a
                            href={previewUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs text-brand-600 underline"
                          >
                            Lihat file
                          </a>
                        ) : null}
                      </div>
                      <div className="inline-flex gap-2">
                        <button
                          type="button"
                          className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700"
                          onClick={() => handleEdit(item)}
                        >
                          Ubah
                        </button>
                        <button
                          type="button"
                          className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600"
                          onClick={() => handleDelete(item.id)}
                        >
                          Hapus
                        </button>
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-600" htmlFor="media_type">
              Jenis Media
            </label>
            <select
              id="media_type"
              name="media_type"
              value={formState.media_type}
              onChange={handleChange}
              disabled={formDisabled}
              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-brand-500 focus:outline-none"
            >
              {mediaTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-600" htmlFor="url">
              URL File
            </label>
            <input
              id="url"
              name="url"
              type="url"
              value={formState.url}
              onChange={handleChange}
              required
              disabled={formDisabled}
              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-brand-500 focus:outline-none"
              placeholder="https://cdn.example.com/file.jpg"
            />
            {onUploadFile ? (
              <input
                type="file"
                accept={formState.media_type === "video" ? "video/*" : "image/*"}
                className="mt-2 w-full rounded-2xl border border-dashed border-slate-200 px-4 py-3 text-sm"
                multiple
                onChange={handleUpload}
                disabled={uploading || formDisabled}
              />
            ) : null}
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-600" htmlFor="caption">
              Keterangan
            </label>
            <textarea
              id="caption"
              name="caption"
              rows={3}
              value={formState.caption}
              onChange={handleChange}
              disabled={formDisabled}
              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-brand-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-600" htmlFor="sort_order">
              Urutan
            </label>
            <input
              id="sort_order"
              name="sort_order"
              type="number"
              value={formState.sort_order}
              onChange={handleChange}
              disabled={formDisabled}
              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-brand-500 focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="submit"
              disabled={formDisabled}
              className="rounded-2xl bg-brand-700 px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {editingId ? "Perbarui Media" : "Tambah Media"}
            </button>
            {editingId ? (
              <button
                type="button"
                onClick={() => resetForm()}
                className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600"
              >
                Batalkan
              </button>
            ) : null}
          </div>
        </form>
      </div>
    </section>
  )
}
