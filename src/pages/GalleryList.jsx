import { Link } from "react-router-dom"
import { usePublicContent } from "../hooks/usePublicContent"
import { resolvePublicUrl } from "../utils/media"

function MediaPreview({ item }) {
  if (!item) return null
  const src = resolvePublicUrl(item.url)

  if (item.media_type === "video") {
    if (!src) return null
    return (
      <div className="overflow-hidden rounded-2xl">
        <video
          controls
          src={src}
          className="h-48 w-full rounded-2xl bg-black object-cover"
          preload="none"
        >
          <track kind="captions" />
        </video>
        {item.caption ? <p className="mt-2 text-sm text-slate-500">{item.caption}</p> : null}
      </div>
    )
  }

  return (
    <figure className="space-y-2">
      <img
        src={src}
        alt={item.caption || "Dokumentasi"}
        className="h-48 w-full rounded-2xl object-cover"
        loading="lazy"
      />
      {item.caption ? <figcaption className="text-sm text-slate-500">{item.caption}</figcaption> : null}
    </figure>
  )
}

export default function GalleryList() {
  const { data, isLoading } = usePublicContent()
  const galleries = data?.galleryItems || []

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-brand-700">
        <div className="container-section py-12 text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-brand-100">Galeri</p>
          <h1 className="mt-3 text-3xl font-bold">Dokumentasi Kegiatan</h1>
          <p className="mt-2 text-sm text-brand-100">
            Kumpulan foto dan video kegiatan Kelurahan Sawah Lama.
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

        {!isLoading && galleries.length === 0 ? (
          <div className="rounded-3xl bg-slate-50 p-8 text-center text-sm text-slate-500">
            Belum ada dokumentasi yang dipublikasikan.
          </div>
        ) : null}

        {galleries.map((gallery) => (
          <article
            key={gallery.id}
            className="rounded-3xl bg-white p-6 shadow-soft ring-1 ring-slate-100"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-600">Galeri</p>
                <h2 className="text-2xl font-semibold text-slate-900">{gallery.title}</h2>
                {gallery.caption ? (
                  <p className="text-sm text-slate-600">{gallery.caption}</p>
                ) : null}
              </div>
              <span className="text-xs text-slate-400">
                {gallery.media?.length ? `${gallery.media.length} file` : "Belum ada media"}
              </span>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {gallery.media?.length
                ? gallery.media.map((mediaItem) => <MediaPreview key={mediaItem.id} item={mediaItem} />)
                : (
                  <p className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">
                    Belum ada foto atau video untuk galeri ini.
                  </p>
                )}
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
