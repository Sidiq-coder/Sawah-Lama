import { useEffect, useMemo, useRef, useState } from "react"
import EditorJS from "@editorjs/editorjs"
import Header from "@editorjs/header"
import List from "@editorjs/list"
import Paragraph from "@editorjs/paragraph"
import Quote from "@editorjs/quote"
import Checklist from "@editorjs/checklist"
import Table from "@editorjs/table"
import Embed from "@editorjs/embed"
import ImageTool from "@editorjs/image"
import AttachesTool from "@editorjs/attaches"

const emptyState = {
  title: "",
  summary: "",
  body: "",
  tags: "",
  cover_url: "",
  link: "",
  is_featured: false,
  is_published: true,
}

const emptyEditorData = { blocks: [] }

function parseEditorData(body) {
  if (!body) return emptyEditorData
  if (typeof body === "object") return body
  try {
    return JSON.parse(body)
  } catch {
    return {
      blocks: [
        {
          type: "paragraph",
          data: { text: body },
        },
      ],
    }
  }
}

export default function NewsManager({ news = [], onSave, onDelete, onUploadCover, onUploadFile }) {
  const [formState, setFormState] = useState(emptyState)
  const [editingId, setEditingId] = useState(null)
  const [status, setStatus] = useState({ type: "idle", message: "" })
  const [uploadingCover, setUploadingCover] = useState(false)
  const [bulkUploadingImages, setBulkUploadingImages] = useState(false)
  const [editorData, setEditorData] = useState(emptyEditorData)
  const editorRef = useRef(null)
  const holderRef = useRef(null)

  const sortedNews = useMemo(() => {
    const getTime = (item) => new Date(item.published_at || item.created_at || Date.now()).getTime()
    return [...news].sort((a, b) => getTime(b) - getTime(a))
  }, [news])

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target
    setFormState((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }))
  }

  const handleEdit = (item) => {
    setFormState({
      title: item.title || "",
      summary: item.summary || "",
      body: item.body || "",
      tags: Array.isArray(item.tags) ? item.tags.join(", ") : "",
      cover_url: item.cover_url || "",
      link: item.link || item.slug || "",
      is_featured: Boolean(item.is_featured),
      is_published: Boolean(item.is_published),
    })
    const nextEditorData = parseEditorData(item.body)
    setEditorData(nextEditorData)
    renderEditorData(nextEditorData)
    setEditingId(item.id)
    setStatus({ type: "info", message: "Mengubah berita" })
  }

  const resetForm = (clearStatus = true) => {
    setFormState(emptyState)
    setEditingId(null)
    setEditorData(emptyEditorData)
    clearEditor()
    if (clearStatus) {
      setStatus({ type: "idle", message: "" })
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!onSave) return
    setStatus({ type: "loading", message: "Menyimpan berita..." })
    try {
      const editorOutput = editorRef.current ? await editorRef.current.save() : emptyEditorData
      await onSave(
        {
          ...formState,
          body: JSON.stringify(editorOutput),
          tags: formState.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean),
        },
        editingId,
      )
      setStatus({ type: "success", message: "Berita tersimpan" })
      resetForm(false)
    } catch (error) {
      setStatus({ type: "error", message: error.message || "Gagal menyimpan" })
    }
  }

  const handleDelete = async (id) => {
    if (!onDelete || !id) return
    const confirmed = window.confirm("Hapus berita ini?")
    if (!confirmed) return
    setStatus({ type: "loading", message: "Menghapus berita..." })
    try {
      await onDelete(id)
      setStatus({ type: "success", message: "Berita dihapus" })
      if (editingId === id) {
        resetForm(false)
      }
    } catch (error) {
      setStatus({ type: "error", message: error.message || "Gagal menghapus" })
    }
  }

  const handleCoverUpload = async (event) => {
    const file = event.target.files?.[0]
    if (!file || !onUploadCover) return
    setUploadingCover(true)
    setStatus({ type: "loading", message: "Mengunggah gambar..." })
    try {
      const url = await onUploadCover(file)
      setFormState((prev) => ({ ...prev, cover_url: url }))
      setStatus({ type: "success", message: "Sampul diperbarui" })
    } catch (error) {
      setStatus({ type: "error", message: error.message || "Gagal unggah gambar" })
    } finally {
      setUploadingCover(false)
      event.target.value = ""
    }
  }

  const handleBulkImageUpload = async (event) => {
    const input = event.target
    const files = Array.from(input.files || [])
    if (!files.length || !onUploadFile) return

    const editor = editorRef.current
    if (!editor) {
      setStatus({ type: "error", message: "Editor belum siap" })
      input.value = ""
      return
    }

    setBulkUploadingImages(true)
    setStatus({ type: "loading", message: `Mengunggah ${files.length} gambar...` })

    try {
      await editor.isReady
      for (const file of files) {
        const url = await onUploadFile(file, "news")
        editor.blocks.insert("image", {
          file: { url },
          caption: file.name,
        })
      }
      setStatus({ type: "success", message: `${files.length} gambar ditambahkan ke konten` })
    } catch (error) {
      setStatus({ type: "error", message: error.message || "Gagal unggah banyak gambar" })
    } finally {
      setBulkUploadingImages(false)
      input.value = ""
    }
  }

  const initEditor = (data) => {
    if (!holderRef.current) return null

    const editor = new EditorJS({
      holder: holderRef.current,
      placeholder: "Tulis isi berita di sini...",
      autofocus: false,
      data,
      tools: {
        paragraph: {
          class: Paragraph,
          inlineToolbar: true,
        },
        header: {
          class: Header,
          inlineToolbar: true,
          config: {
            levels: [2, 3, 4],
            defaultLevel: 3,
          },
        },
        list: {
          class: List,
          inlineToolbar: true,
        },
        checklist: {
          class: Checklist,
          inlineToolbar: true,
        },
        quote: {
          class: Quote,
          inlineToolbar: true,
          config: {
            quotePlaceholder: "Kutipan",
            captionPlaceholder: "Sumber",
          },
        },
        table: {
          class: Table,
          inlineToolbar: true,
        },
        embed: {
          class: Embed,
          config: {
            services: {
              youtube: true,
              instagram: true,
              twitter: true,
              facebook: true,
            },
          },
        },
        image: {
          class: ImageTool,
          config: {
            uploader: {
              uploadByFile: async (file) => {
                if (!onUploadFile) {
                  throw new Error("Uploader belum tersedia")
                }
                const url = await onUploadFile(file, "news")
                return { success: 1, file: { url } }
              },
              uploadByUrl: async (url) => ({ success: 1, file: { url } }),
            },
          },
        },
        attaches: {
          class: AttachesTool,
          config: {
            uploader: {
              uploadByFile: async (file) => {
                if (!onUploadFile) {
                  throw new Error("Uploader belum tersedia")
                }
                const url = await onUploadFile(file, "news")
                return { success: 1, file: { url, name: file.name, size: file.size } }
              },
            },
          },
        },
      },
    })

    editorRef.current = editor
    return editor
  }

  const clearEditor = () => {
    const editor = editorRef.current
    if (!editor) return
    if (typeof editor.clear === "function") {
      editor.clear()
    }
  }

  const renderEditorData = (data) => {
    const editor = editorRef.current
    if (!editor || typeof editor.render !== "function") return
    editor.isReady
      ?.then(async () => {
        if (typeof editor.clear === "function") {
          await editor.clear()
        }
        await editor.render(data)
      })
      .catch(() => null)
  }

  useEffect(() => {
    if (editorRef.current || !holderRef.current) return
    initEditor(editorData)

    return () => {
      editorRef.current?.destroy?.()
      editorRef.current = null
    }
  }, [holderRef])

  return (
    <section className="rounded-3xl bg-white p-6 shadow-soft ring-1 ring-slate-100">
      <div className="mb-6 flex flex-col gap-2">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-brand-600">Berita</p>
        <h3 className="text-xl font-semibold text-slate-900">Kelola Berita dan Sorotan</h3>
        {status.message ? (
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

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-3 rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
          {sortedNews.length === 0 ? (
            <p className="text-sm text-slate-500">Belum ada berita.</p>
          ) : (
            <ul className="space-y-3">
              {sortedNews.map((item) => (
                <li key={item.id} className="rounded-2xl bg-white p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-brand-600">
                        {item.is_featured ? "SOROTAN" : "BERITA"}
                      </p>
                      <p className="text-sm text-slate-500">
                        {new Date(item.published_at || item.created_at).toLocaleDateString("id-ID")}
                      </p>
                      <h4 className="text-base font-semibold text-slate-900">{item.title}</h4>
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
                  </div>
                  <p className="mt-2 text-sm text-slate-500">{item.summary}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-600" htmlFor="title">
              Judul
            </label>
            <input
              id="title"
              name="title"
              type="text"
              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-brand-500 focus:outline-none"
              value={formState.title}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-600" htmlFor="summary">
              Ringkasan
            </label>
            <textarea
              id="summary"
              name="summary"
              rows={3}
              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-brand-500 focus:outline-none"
              value={formState.summary}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-600" htmlFor="body">
              Konten lengkap
            </label>
            <div className="editor-shell mt-2 rounded-2xl border border-slate-200 bg-white px-4 py-3">
              <div ref={holderRef} className="prose max-w-none" />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-600">
              Unggah banyak foto ke konten
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              className="mt-2 w-full rounded-2xl border border-dashed border-slate-200 px-4 py-3 text-sm"
              onChange={handleBulkImageUpload}
              disabled={bulkUploadingImages}
            />
            <p className="mt-1 text-xs text-slate-500">Semua file akan otomatis ditambahkan sebagai blok gambar.</p>
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-600" htmlFor="tags">
              Tag (pisahkan dengan koma)
            </label>
            <input
              id="tags"
              name="tags"
              type="text"
              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-brand-500 focus:outline-none"
              value={formState.tags}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-600" htmlFor="cover_url">
              Sampul berita
            </label>
            <input
              id="cover_url"
              name="cover_url"
              type="url"
              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-brand-500 focus:outline-none"
              value={formState.cover_url}
              onChange={handleChange}
              placeholder="https://cdn..."
            />
            <input
              type="file"
              accept="image/*"
              className="mt-2 w-full rounded-2xl border border-dashed border-slate-200 px-4 py-3 text-sm"
              onChange={handleCoverUpload}
              disabled={uploadingCover}
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-600" htmlFor="link">
              Tautan eksternal (opsional)
            </label>
            <input
              id="link"
              name="link"
              type="url"
              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-brand-500 focus:outline-none"
              value={formState.link}
              onChange={handleChange}
            />
          </div>
          <div className="flex items-center gap-6">
            <label className="inline-flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                name="is_featured"
                checked={formState.is_featured}
                onChange={handleChange}
                className="rounded border-slate-300 text-brand-600"
              />
              Sorotan
            </label>
            <label className="inline-flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                name="is_published"
                checked={formState.is_published}
                onChange={handleChange}
                className="rounded border-slate-300 text-brand-600"
              />
              Terbitkan
            </label>
          </div>
          <div className="flex flex-wrap gap-3 pt-2">
            <button type="submit" className="rounded-2xl bg-brand-700 px-5 py-3 text-sm font-semibold text-white">
              {editingId ? "Perbarui Berita" : "Terbitkan"}
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
