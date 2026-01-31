import { Link } from "react-router-dom"
import { usePublicContent } from "../hooks/usePublicContent"
import { resolvePublicUrl } from "../utils/media"

export default function WilayahInfo() {
  const { data, isLoading } = usePublicContent()
  const stats = data?.wilayahInfo || []

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-brand-700">
        <div className="container-section py-12 text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-brand-100">Wilayah</p>
          <h1 className="mt-3 text-3xl font-bold">Informasi Wilayah</h1>
          <p className="mt-2 text-sm text-brand-100">
            Data persebaran wilayah, fasilitas, dan statistik utama Kelurahan Sawah Lama.
          </p>
          <Link
            to="/"
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/40 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-white hover:text-brand-700"
          >
            ← Kembali ke Beranda
          </Link>
        </div>
      </div>

      <div className="container-section space-y-8 py-10">
        {isLoading ? <div className="h-40 animate-pulse rounded-3xl bg-slate-100" /> : null}

        {!isLoading && !stats.length ? (
          <div className="rounded-3xl bg-slate-50 p-8 text-center text-sm text-slate-500">
            Belum ada informasi wilayah yang dipublikasikan.
          </div>
        ) : null}

        {stats.map((item, index) => {
          const imageUrl = resolvePublicUrl(item.image_url)
          return (
            <article
              key={item.id || item.label}
              className="grid gap-6 rounded-3xl bg-white p-6 shadow-soft ring-1 ring-slate-100 md:grid-cols-[0.35fr_1fr]"
            >
              {imageUrl ? (
                <div className="overflow-hidden rounded-2xl">
                  <img src={imageUrl} alt={item.label} className="h-48 w-full object-cover" loading="lazy" />
                </div>
              ) : (
                <div className="flex h-48 items-center justify-center rounded-2xl bg-slate-50 text-sm text-slate-400">
                  Tidak ada foto
                </div>
              )}
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-600">{`Data #${index + 1}`}</p>
                <h2 className="text-2xl font-semibold text-slate-900">{item.label}</h2>
                {item.value ? (
                  <p className="text-lg font-semibold text-brand-700">{item.value}</p>
                ) : null}
                {item.description ? (
                  <p className="mt-3 text-sm text-slate-600">{item.description}</p>
                ) : null}
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}
