import { Link } from "react-router-dom"
import { usePublicContent } from "../hooks/usePublicContent"
import { slugify } from "../utils/news"

function parseDataItem(raw) {
  if (typeof raw !== "string") {
    return { name: "-", value: "-" }
  }

  const trimmed = raw.trim()
  if (!trimmed) {
    return { name: "-", value: "-" }
  }

  const match = trimmed.match(/^(.*?)\s*[:\-–—|=]\s*(.+)$/)
  if (match) {
    return {
      name: match[1].trim() || "-",
      value: match[2].trim() || "-",
    }
  }

  return { name: trimmed, value: "-" }
}

export default function DataPage() {
  const { data, isLoading } = usePublicContent()
  const groups = data?.dataGroups || []

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-brand-700">
        <div className="container-section py-12 text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-brand-100">Data</p>
          <h1 className="mt-3 text-3xl font-bold">Daftar Data Kelurahan</h1>
          <p className="mt-2 text-sm text-brand-100">
            Semua kelompok data ditampilkan dalam tabel terpisah untuk memudahkan pencarian informasi.
          </p>
          <Link
            to="/"
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/40 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-white hover:text-brand-700"
          >
            ← Kembali ke Beranda
          </Link>
        </div>
      </div>

      <div className="container-section space-y-10 py-10">
        {isLoading ? <div className="h-40 animate-pulse rounded-3xl bg-slate-100" /> : null}

        {!isLoading && !groups.length ? (
          <div className="rounded-3xl bg-slate-50 p-8 text-center text-sm text-slate-500">
            Belum ada data yang dipublikasikan.
          </div>
        ) : null}

        {groups.map((group) => {
          const anchor = slugify(group.title || "data")
          const items = group.items || []
          return (
            <section
              key={group.id || group.title}
              id={anchor}
              className="rounded-3xl bg-white p-6 shadow-soft ring-1 ring-slate-100"
            >
              <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-600">Kelompok Data</p>
                  <h2 className="text-2xl font-semibold text-slate-900">{group.title}</h2>
                </div>
                <span className="text-xs text-slate-400">
                  {items.length ? `${items.length} entri` : "Belum ada entri"}
                </span>
              </div>

              <div className="mt-6 overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 text-left text-sm text-slate-700">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 font-semibold uppercase tracking-wide text-slate-500">Nama Data</th>
                      <th className="px-4 py-3 font-semibold uppercase tracking-wide text-slate-500">Nilai / Keterangan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {items.length ? (
                      items.map((item, index) => {
                        const parsed = parseDataItem(item)
                        return (
                          <tr key={`${group.title}-${index}`} className="hover:bg-slate-50">
                            <td className="px-4 py-3 text-sm font-medium text-slate-900">{parsed.name}</td>
                            <td className="px-4 py-3 text-sm text-slate-600">{parsed.value}</td>
                          </tr>
                        )
                      })
                    ) : (
                      <tr>
                        <td colSpan={2} className="px-4 py-6 text-center text-sm text-slate-500">
                          Belum ada data pada kelompok ini.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}
