import { useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { usePublicContent } from "../hooks/usePublicContent"
import { resolvePublicUrl } from "../utils/media"

function ServiceMediaPreview({ item }) {
  if (!item) return null
  const src = resolvePublicUrl(item.url)
  if (!src) return null

  if (item.media_type === "video") {
    return (
      <figure className="space-y-2">
        <video
          controls
          src={src}
          className="h-40 w-full rounded-2xl bg-black object-cover"
          preload="none"
        >
          <track kind="captions" />
        </video>
        {item.caption ? <figcaption className="text-xs text-slate-500">{item.caption}</figcaption> : null}
      </figure>
    )
  }

  return (
    <figure className="space-y-2">
      <img
        src={src}
        alt={item.caption || "Dokumentasi layanan"}
        className="h-40 w-full rounded-2xl object-cover"
        loading="lazy"
      />
      {item.caption ? <figcaption className="text-xs text-slate-500">{item.caption}</figcaption> : null}
    </figure>
  )
}

export default function ServicesList() {
  const { data, isLoading } = usePublicContent()
  const services = data?.services || []
  const location = useLocation()

  useEffect(() => {
    if (!location.hash || !services.length) return undefined
    const targetId = location.hash.replace("#", "")
    if (!targetId) return undefined
    const element = document.getElementById(targetId)
    if (!element) return undefined
    element.scrollIntoView({ behavior: "smooth", block: "start" })
    element.classList.add("ring-2", "ring-brand-500", "shadow-xl")
    const timer = window.setTimeout(() => {
      element.classList.remove("ring-2", "ring-brand-500", "shadow-xl")
    }, 1800)
    return () => window.clearTimeout(timer)
  }, [location.hash, services.length])

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-brand-700">
        <div className="container-section py-12 text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-brand-100">Layanan</p>
          <h1 className="mt-3 text-3xl font-bold">Daftar Layanan Kelurahan</h1>
          <p className="mt-2 text-sm text-brand-100">
            Informasi lengkap mengenai pelayanan administratif dan kemasyarakatan.
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

        {!isLoading && services.length === 0 ? (
          <div className="rounded-3xl bg-slate-50 p-8 text-center text-sm text-slate-500">
            Belum ada layanan yang dipublikasikan.
          </div>
        ) : null}

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service) => (
            <article
              key={service.id || service.title}
              id={service.id ? `service-${service.id}` : undefined}
              className="flex h-full flex-col gap-4 rounded-3xl bg-white p-6 shadow-soft ring-1 ring-slate-100 transition duration-300"
            >
              <div className="flex items-center gap-4">
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-2xl text-brand-700">
                  {service.icon || "ℹ️"}
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-600">Pelayanan</p>
                  <h2 className="text-xl font-semibold text-slate-900">{service.title}</h2>
                </div>
              </div>
              <p className="text-sm text-slate-600">
                {service.description || "Deskripsi layanan belum tersedia."}
              </p>
              {service.media?.length ? (
                <div className="space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    {service.media.length} dokumentasi
                  </p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {service.media.map((mediaItem) => (
                      <ServiceMediaPreview key={mediaItem.id || mediaItem.url} item={mediaItem} />
                    ))}
                  </div>
                </div>
              ) : (
                <p className="rounded-2xl bg-slate-50 p-3 text-xs text-slate-500">
                  Belum ada media untuk layanan ini.
                </p>
              )}
              {service.sort_order ? (
                <p className="text-xs text-slate-400">Urutan tampilan: {service.sort_order}</p>
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}
