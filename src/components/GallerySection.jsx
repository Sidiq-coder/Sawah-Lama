import { Link } from "react-router-dom"
import SectionHeader from "./SectionHeader"
import { resolvePublicUrl } from "../utils/media"

export default function GallerySection({ items = [] }) {
  if (!items.length) return null
  const displayItems = items.slice(0, 3)

  return (
    <section id="galeri" className="bg-white py-16">
      <div className="container-section">
        <SectionHeader
          eyebrow="Galeri"
          title="Dokumentasi Kegiatan"
          description="Dokumentasi kegiatan dan fasilitas Kelurahan Sawah Lama."
        />

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {displayItems.map((item, index) => {
            const coverSource =
              item.cover_url || item.coverUrl || item.image_url || item.imageUrl || item.media?.[0]?.url
            const imageUrl = resolvePublicUrl(coverSource)
            const galleryHash = item.id ? `gallery-${item.id}` : "galeri"
            return (
              <Link
                key={item.id || item.title || index}
                to={`/galeri#${galleryHash}`}
                className="group block h-full animate-fade-up"
                style={{ animationDelay: `${index * 80}ms` }}
                aria-label={`Buka galeri ${item.title}`}
              >
                <article className="flex h-full flex-col overflow-hidden rounded-3xl bg-slate-50 shadow-soft ring-1 ring-slate-100 transition duration-300 group-hover:-translate-y-1 group-hover:shadow-xl">
                  <div className="relative h-48 w-full overflow-hidden">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={item.title || "Dokumentasi"}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand-500 via-brand-600 to-brand-800 text-white">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          className="h-10 w-10 opacity-90"
                          aria-hidden
                        >
                          <path
                            fill="currentColor"
                            d="M4 5h3l1-1h8l1 1h3a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2m8 3a3 3 0 1 0 3 3a3 3 0 0 0-3-3m8 10l-3.5-4.5l-2.5 3.01l-1.5-2L7 18Z"
                          />
                        </svg>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/35 via-transparent" />
                  </div>
                  <div className="flex flex-1 flex-col gap-2 p-5">
                    <p className="text-sm font-semibold text-slate-900 clamp-2">{item.title}</p>
                    {item.caption ? (
                      <p className="text-xs text-slate-600 clamp-3">{item.caption}</p>
                    ) : (
                      <p className="text-xs text-slate-500">Belum ada keterangan</p>
                    )}
                    <span className="mt-auto inline-flex items-center gap-2 text-xs font-semibold text-brand-700">
                      Lihat dokumentasi
                      <span aria-hidden>→</span>
                    </span>
                  </div>
                </article>
              </Link>
            )
          })}
        </div>

        <div className="mt-8 text-center">
          <Link
            to="/galeri"
            className="inline-flex rounded-full bg-brand-700 px-6 py-2 text-sm font-semibold text-white shadow-soft"
          >
            Lihat Semua Galeri
          </Link>
        </div>
      </div>
    </section>
  )
}
