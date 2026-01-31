import { Link } from "react-router-dom"
import { usePublicContent } from "../hooks/usePublicContent"
import { buildNewsPath } from "../utils/news"
import { resolvePublicUrl } from "../utils/media"

function formatDate(value) {
  if (!value) return ""
  return new Date(value).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })
}

export default function NewsList() {
  const { data, isLoading } = usePublicContent()
  const news = data?.newsPosts || []

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-brand-700">
        <div className="container-section py-12 text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-brand-100">Berita</p>
          <h1 className="mt-3 text-3xl font-bold">Berita & Pengumuman</h1>
          <p className="mt-2 text-sm text-brand-100">
            Ikuti informasi terbaru Kelurahan Sawah Lama.
          </p>
          <Link
            to="/"
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/40 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-white hover:text-brand-700"
          >
            ← Kembali ke Beranda
          </Link>
        </div>
      </div>

      <div className="container-section py-10">
        {isLoading ? <div className="h-40 animate-pulse rounded-3xl bg-slate-100" /> : null}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {news.map((item) => (
            <article
              key={item.id || item.slug}
              className="flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-soft ring-1 ring-slate-100"
            >
              {item.cover_url ? (
                <img
                  src={resolvePublicUrl(item.cover_url)}
                  alt={item.title}
                  className="h-44 w-full object-cover"
                  loading="lazy"
                />
              ) : null}
              <div className="flex flex-1 flex-col gap-3 p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-600">
                  {formatDate(item.published_at || item.created_at)}
                </p>
                <h2 className="text-lg font-semibold text-slate-900">{item.title}</h2>
                <p className="text-sm text-slate-600">
                  {item.summary || item.body?.slice?.(0, 140) || ""}
                </p>
                <Link
                  to={buildNewsPath(item)}
                  className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-brand-700 hover:underline"
                >
                  Baca berita
                  <span aria-hidden>→</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}
