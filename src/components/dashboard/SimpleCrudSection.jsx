import { useMemo, useState } from "react"

function createEmptyPair() {
  return { name: "", value: "" }
}

function buildInitialState(fields) {
  return fields.reduce((acc, field) => {
    if (field.type === "dataPairs") {
      acc[field.name] = field.defaultValue ?? [createEmptyPair()]
      return acc
    }
    if (field.type === "boolean") {
      acc[field.name] = Boolean(field.defaultValue)
      return acc
    }
    acc[field.name] = field.defaultValue ?? (field.type === "number" ? 0 : "")
    return acc
  }, {})
}

function formatInputValue(field, value) {
  if (field.type === "dataPairs") {
    if (!value) return [createEmptyPair()]
    if (Array.isArray(value) && value.length) {
      return value.map((entry) => {
        if (typeof entry === "string") {
          const match = entry.match(/^(.*?)\s*[:\-–—|=]\s*(.+)$/)
          if (match) {
            return { name: match[1].trim(), value: match[2].trim() }
          }
          return { name: entry.trim(), value: "" }
        }
        return {
          name: entry?.name || "",
          value: entry?.value || "",
        }
      })
    }
    return [createEmptyPair()]
  }

  if (field.type === "list") {
    if (Array.isArray(value)) {
      return value.join("\n")
    }
    return value || ""
  }

  if (field.type === "number") {
    return typeof value === "number" ? value : Number(value) || 0
  }

  if (field.type === "boolean") {
    return Boolean(value)
  }

  return value ?? ""
}

function parseForSubmit(field, value) {
  if (field.type === "number") {
    return Number(value) || 0
  }

  if (field.type === "dataPairs") {
    if (!Array.isArray(value)) return []
    return value
      .map((entry) => {
        const name = entry?.name?.trim?.() || ""
        const pairValue = entry?.value?.trim?.() || ""
        if (!name && !pairValue) return null
        if (name && pairValue) {
          return `${name}: ${pairValue}`
        }
        return name || pairValue || null
      })
      .filter(Boolean)
  }

  if (field.type === "boolean") {
    return Boolean(value)
  }

  if (field.type === "list") {
    if (!value) return []
    return value
      .split(/\n+/)
      .map((line) => line.trim())
      .filter(Boolean)
  }

  return value
}

function resolveOptions(field) {
  if (typeof field.getOptions === "function") {
    return field.getOptions() || []
  }
  if (Array.isArray(field.options)) {
    return field.options
  }
  return []
}

export default function SimpleCrudSection({
  title,
  description,
  items = [],
  fields = [],
  onSave,
  onDelete,
  ctaLabel = "Simpan",
  imageFields = [],
  onUploadImage,
  groupConfig,
  getGroupKey,
}) {
  const initialState = useMemo(() => buildInitialState(fields), [fields])
  const [formState, setFormState] = useState(initialState)
  const [editingId, setEditingId] = useState(null)
  const [status, setStatus] = useState({ type: "idle", message: "" })
  const [uploadingField, setUploadingField] = useState(null)

  const resetForm = (clearStatus = true) => {
    setFormState(initialState)
    setEditingId(null)
    if (clearStatus) {
      setStatus({ type: "idle", message: "" })
    }
  }

  const handleEdit = (item) => {
    const nextState = { ...initialState }
    fields.forEach((field) => {
      nextState[field.name] = formatInputValue(field, item[field.name])
    })
    setFormState(nextState)
    setEditingId(item.id)
    setStatus({ type: "info", message: "Mengubah data" })
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormState((prev) => ({ ...prev, [name]: value }))
  }

  const handlePairsChange = (fieldName, rows) => {
    setFormState((prev) => ({ ...prev, [fieldName]: rows.length ? rows : [createEmptyPair()] }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!onSave) return
    setStatus({ type: "loading", message: "Menyimpan..." })
    try {
      const payload = fields.reduce((acc, field) => {
        acc[field.name] = parseForSubmit(field, formState[field.name])
        return acc
      }, {})
      await onSave(payload, editingId)
      setStatus({ type: "success", message: "Perubahan berhasil disimpan" })
      resetForm(false)
    } catch (error) {
      setStatus({ type: "error", message: error.message || "Gagal menyimpan" })
    }
  }

  const handleFileSelect = async (event, fieldName) => {
    const input = event.target
    const file = input.files?.[0]
    if (!file || !onUploadImage) return
    setUploadingField(fieldName)
    setStatus({ type: "loading", message: "Mengunggah gambar..." })
    try {
      const url = await onUploadImage(file)
      setFormState((prev) => ({ ...prev, [fieldName]: url }))
      setStatus({ type: "success", message: "Gambar tersimpan di R2" })
    } catch (error) {
      setStatus({ type: "error", message: error.message || "Gagal mengunggah gambar" })
    } finally {
      setUploadingField(null)
      if (input) {
        input.value = ""
      }
    }
  }

  const handleDelete = async (id) => {
    if (!onDelete || !id) return
    const confirmed = window.confirm("Hapus item ini?")
    if (!confirmed) return
    setStatus({ type: "loading", message: "Menghapus..." })
    try {
      await onDelete(id)
      setStatus({ type: "success", message: "Data dihapus" })
      if (editingId === id) {
        resetForm(false)
      }
    } catch (error) {
      setStatus({ type: "error", message: error.message || "Gagal menghapus" })
    }
  }

  return (
    <section className="rounded-3xl bg-white p-6 shadow-soft ring-1 ring-slate-100">
      <div className="mb-6 flex flex-col gap-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-brand-600">{title}</p>
          <h3 className="text-xl font-semibold text-slate-900">{description}</h3>
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

      <div className="grid gap-6 lg:grid-cols-[1fr_0.6fr]">
        <div className="space-y-3 rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
          {items.length === 0 ? (
            <p className="text-sm text-slate-500">Belum ada data.</p>
          ) : getGroupKey && groupConfig ? (
            <div className="space-y-6 text-sm">
              {buildGroupedItems(items, getGroupKey, groupConfig).map((group) => (
                <div key={group.key} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="chip">Posisi</span>
                    <p className="text-sm font-semibold text-slate-900">{group.label}</p>
                  </div>
                  <ul className="space-y-3">
                    {group.items.map((item) => (
                      <li
                        key={item.id}
                        className="flex items-start justify-between gap-4 rounded-2xl bg-white p-3 shadow-sm"
                      >
                        <div>
                          <p className="font-semibold text-slate-900">
                            {item.title || item.name || item.label}
                          </p>
                          {item.description || item.caption || item.value ? (
                            <p className="text-xs text-slate-500">
                              {item.description || item.caption || item.value}
                            </p>
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
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <ul className="space-y-3 text-sm">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="flex items-start justify-between gap-4 rounded-2xl bg-white p-3 shadow-sm"
                >
                  <div>
                    <p className="font-semibold text-slate-900">{item.title || item.name || item.label}</p>
                    {item.description || item.caption || item.value ? (
                      <p className="text-xs text-slate-500">
                        {item.description || item.caption || item.value}
                      </p>
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
              ))}
            </ul>
          )}
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {fields.map((field) => (
            <div key={field.name}>
              <label className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-600" htmlFor={field.name}>
                {field.label}
              </label>
              {field.type === "dataPairs" ? (
                <DataPairsField value={formState[field.name]} onChange={(rows) => handlePairsChange(field.name, rows)} />
              ) : field.type === "select" ? (
                <select
                  id={field.name}
                  name={field.name}
                  className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-brand-500 focus:outline-none"
                  value={formState[field.name]}
                  onChange={handleChange}
                >
                  <option value="">{field.placeholder || "Pilih"}</option>
                  {resolveOptions(field).map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : field.type === "boolean" ? (
                <label
                  htmlFor={field.name}
                  className="mt-3 inline-flex items-center gap-3 text-sm text-slate-600"
                >
                  <div className="relative">
                    <input
                      id={field.name}
                      name={field.name}
                      type="checkbox"
                      className="peer sr-only"
                      checked={Boolean(formState[field.name])}
                      onChange={(event) =>
                        setFormState((prev) => ({ ...prev, [field.name]: event.target.checked }))
                      }
                    />
                    <span className="block h-6 w-11 rounded-full bg-slate-200 transition peer-checked:bg-brand-600" />
                    <span className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition peer-checked:translate-x-5" />
                  </div>
                  <span>{field.placeholder || "Aktif"}</span>
                </label>
              ) : field.type === "textarea" || field.type === "list" ? (
                <textarea
                  id={field.name}
                  name={field.name}
                  rows={field.rows || 3}
                  className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-brand-500 focus:outline-none"
                  value={formState[field.name]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                />
              ) : (
                <input
                  id={field.name}
                  name={field.name}
                  type={field.type || "text"}
                  className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm focus:border-brand-500 focus:outline-none"
                  value={formState[field.name]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                />
              )}
              {field.helper ? <p className="mt-1 text-xs text-slate-500">{field.helper}</p> : null}
              {imageFields.includes(field.name) ? (
                <div className="mt-2">
                  <label className="text-xs font-semibold text-slate-500">Unggah dari komputer</label>
                  <input
                    type="file"
                    accept="image/*"
                    className="mt-1 w-full rounded-2xl border border-dashed border-slate-200 px-4 py-3 text-sm"
                    onChange={(event) => handleFileSelect(event, field.name)}
                    disabled={uploadingField === field.name}
                  />
                </div>
              ) : null}
            </div>
          ))}

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="submit"
              className="rounded-2xl bg-brand-700 px-5 py-3 text-sm font-semibold text-white"
            >
              {editingId ? "Perbarui" : ctaLabel}
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

function buildGroupedItems(items, getGroupKey, groupConfig) {
  const buckets = new Map()
  items.forEach((item) => {
    const key = getGroupKey(item) || "__ungrouped__"
    if (!buckets.has(key)) buckets.set(key, [])
    buckets.get(key).push(item)
  })

  const orderedGroups = []
  const usedKeys = new Set()
  if (Array.isArray(groupConfig.order)) {
    groupConfig.order.forEach((group) => {
      if (buckets.has(group.key)) {
        orderedGroups.push({
          key: group.key,
          label: group.label || group.key,
          items: buckets.get(group.key),
        })
        usedKeys.add(group.key)
      }
    })
  }

  buckets.forEach((groupItems, key) => {
    if (usedKeys.has(key)) return
    const label = groupConfig.labels?.[key] || groupConfig.fallbackLabel || key
    orderedGroups.push({ key, label, items: groupItems })
  })

  return orderedGroups
}

function DataPairsField({ value, onChange }) {
  const rows = Array.isArray(value) && value.length ? value : [createEmptyPair()]

  const updateRow = (index, key, nextValue) => {
    const nextRows = rows.map((row, rowIndex) => (rowIndex === index ? { ...row, [key]: nextValue } : row))
    onChange(nextRows)
  }

  const addRow = () => {
    onChange([...rows, createEmptyPair()])
  }

  const removeRow = (index) => {
    if (rows.length === 1) {
      onChange([createEmptyPair()])
      return
    }
    const nextRows = rows.filter((_, rowIndex) => rowIndex !== index)
    onChange(nextRows.length ? nextRows : [createEmptyPair()])
  }

  return (
    <div className="mt-2 space-y-3 rounded-2xl border border-slate-200 p-3">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm text-slate-700">
          <thead>
            <tr className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              <th className="px-3 py-2">Nama Data</th>
              <th className="px-3 py-2">Nilai / Keterangan</th>
              <th className="px-3 py-2 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row, index) => (
              <tr key={`pair-${index}`}>
                <td className="px-3 py-2">
                  <input
                    type="text"
                    className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
                    value={row.name}
                    onChange={(event) => updateRow(index, "name", event.target.value)}
                    placeholder="Jumlah RW"
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    type="text"
                    className="w-full rounded-2xl border border-slate-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none"
                    value={row.value}
                    onChange={(event) => updateRow(index, "value", event.target.value)}
                    placeholder="15"
                  />
                </td>
                <td className="px-3 py-2 text-right">
                  <button
                    type="button"
                    className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600"
                    onClick={() => removeRow(index)}
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        type="button"
        onClick={addRow}
        className="w-full rounded-2xl border border-dashed border-brand-400 px-4 py-2 text-sm font-semibold text-brand-600"
      >
        + Tambah Baris Data
      </button>
    </div>
  )
}
