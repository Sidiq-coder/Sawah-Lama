import { Link, useParams } from "react-router-dom"
import { useMemo } from "react"
import { usePublicContent } from "../hooks/usePublicContent"
import { resolvePublicUrl } from "../utils/media"

export default function ServiceDetail() {
  const { id } = useParams()
  const { data, isLoading } = usePublicContent()
  const services = data?.services || []

  const service = useMemo(() => {
    if (!services.length) return null
    const found = services.find((item) => item.id === id)
    if (found) return found
    const index = Number(id)
    if (Number.isFinite(index)) return services[index] || null
    return null
  }, [services, id])

  if (isLoading) {
    return <div className="min-h-screen bg-white" />
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container-section py-20 text-center">
          <h1 className="text-2xl font-semibold text-slate-900">Layanan tidak ditemukan</h1>
          <Link to="/layanan" className="mt-4 inline-flex text-sm font-semibold text-brand-700">
            Kembali ke daftar layanan
          </Link>
        </div>
      </div>
    )
  }

  const ctaEnabled = service.cta_enabled === true
  const ctaLabel = service.cta_label || "Buat Surat Ini"
  const ctaLink = service.cta_link
  const thumbnailUrl = resolvePublicUrl(service.image_url || service.imageUrl)

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-brand-700">
        <div className="container-section py-12 text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-brand-100">Pelayanan</p>
          <h1 className="mt-3 text-3xl font-bold">{service.title}</h1>
          <p className="mt-2 text-sm text-brand-100">
            {service.description || "Deskripsi layanan belum tersedia."}
          </p>
          <Link
            to="/layanan"
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/40 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-white hover:text-brand-700"
          >
            ← Kembali ke daftar layanan
          </Link>
        </div>
      </div>

      <div className="container-section py-10">
        <div className="rounded-3xl bg-white p-6 shadow-soft ring-1 ring-slate-100">
          <div className="relative overflow-hidden rounded-3xl bg-brand-50 p-6">
            {thumbnailUrl ? (
              <div className="mb-6 overflow-hidden rounded-2xl bg-white">
                <img
                  src={thumbnailUrl}
                  alt={service.title}
                  className="h-64 w-full object-cover"
                  loading="lazy"
                />
              </div>
            ) : null}
            <div className="flex items-center gap-4">
              <div className="grid h-16 w-16 place-items-center rounded-2xl bg-white text-3xl text-brand-700 shadow-soft">
                {service.icon || "ℹ️"}
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-600">Pelayanan</p>
                <h2 className="text-2xl font-semibold text-slate-900">{service.title}</h2>
              </div>
            </div>
            <p className="mt-4 text-sm text-slate-600">
              {service.description || "Deskripsi layanan belum tersedia."}
            </p>
            {ctaEnabled && ctaLink ? (
              <a
                href={ctaLink}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-brand-600 px-5 py-3 text-sm font-semibold text-brand-700 transition hover:bg-brand-600 hover:text-white"
              >
                {ctaLabel}
                <span aria-hidden>→</span>
              </a>
            ) : null}
          </div>

        </div>
      </div>
    </div>
  )
}
