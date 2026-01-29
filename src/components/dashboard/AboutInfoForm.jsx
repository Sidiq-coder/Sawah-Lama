import { useEffect, useState } from "react"

export default function AboutInfoForm({ data, onSave }) {
  const [formState, setFormState] = useState({
    title: "",
    description: "",
    points: [""],
  })
  const [status, setStatus] = useState({ type: "idle", message: "" })

  useEffect(() => {
    if (!data) return
    setFormState({
      title: data.title || "",
      description: data.description || "",
      points: Array.isArray(data.points) && data.points.length ? data.points : [""],
    })
  }, [data])

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormState((prev) => ({ ...prev, [name]: value }))
  }

  const handlePointChange = (index, value) => {
    setFormState((prev) => {
      const next = [...prev.points]
      next[index] = value
      return { ...prev, points: next }
    })
  }

  const handleAddPoint = () => {
    setFormState((prev) => ({ ...prev, points: [...prev.points, ""] }))
  }

  const handleRemovePoint = (index) => {
    setFormState((prev) => {
      const next = prev.points.filter((_, i) => i !== index)
      return { ...prev, points: next.length ? next : [""] }
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!onSave) return
    setStatus({ type: "loading", message: "Menyimpan..." })
    try {
      await onSave({
        title: formState.title,
        description: formState.description,
        points: formState.points.map((item) => item.trim()).filter(Boolean),
      })
      setStatus({ type: "success", message: "Profil berhasil diperbarui" })
    } catch (error) {
      setStatus({ type: "error", message: error.message || "Gagal menyimpan" })
    }
  }

  return (
    <section className="rounded-3xl bg-white p-6 shadow-soft ring-1 ring-slate-100">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-brand-600">Tentang</p>
        <h3 className="text-xl font-semibold text-slate-900">Profil Kelurahan</h3>
        {status.message ? (
          <p
            className={`mt-2 text-sm ${
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
          />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-600" htmlFor="description">
            Deskripsi
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-brand-500 focus:outline-none"
            value={formState.description}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-600" htmlFor="points">
            Poin Utama
          </label>
          <div className="mt-3 space-y-3">
            {formState.points.map((point, index) => (
              <div key={index} className="flex items-start gap-3">
                <input
                  type="text"
                  value={point}
                  onChange={(event) => handlePointChange(index, event.target.value)}
                  placeholder={`Poin ${index + 1}`}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-brand-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => handleRemovePoint(index)}
                  className="rounded-2xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-500"
                >
                  Hapus
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={handleAddPoint}
            className="mt-3 inline-flex rounded-2xl bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-600"
          >
            Tambah Poin
          </button>
        </div>
        <button type="submit" className="rounded-2xl bg-brand-700 px-5 py-3 text-sm font-semibold text-white">
          Simpan Profil
        </button>
      </form>
    </section>
  )
}
