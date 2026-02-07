import { Link } from "react-router-dom"
import { usePublicContent } from "../hooks/usePublicContent"
import { resolvePublicUrl } from "../utils/media"

export default function ServicesList() {
  const { data, isLoading } = usePublicContent()
  const services = data?.services || []

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
          {services.map((service) => {
            const thumbnailUrl = resolvePublicUrl(service.image_url || service.imageUrl)
            const ctaEnabled = service.cta_enabled === true
            const ctaLabel = service.cta_label || "Buat Surat Ini"
            const ctaLink = service.cta_link
            return (
              <article
                key={service.id || service.title}
                className="relative flex h-full flex-col gap-4 overflow-hidden rounded-3xl bg-white p-6 shadow-soft ring-1 ring-slate-100 transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                  <div className="absolute right-0 top-0 h-28 w-28 rounded-bl-[2.5rem] bg-brand-50" />
                  {thumbnailUrl ? (
                    <div className="relative overflow-hidden rounded-2xl">
                      <img
                        src={thumbnailUrl}
                        alt={service.title}
                        className="h-44 w-full object-cover transition duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                  ) : null}
                  <div className="relative flex items-center gap-4">
                    {service.icon ? (
                      <div className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-2xl text-brand-700">
                        {service.icon}
                      </div>
                    ) : null}
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-600">Pelayanan</p>
                      <h2 className="text-xl font-semibold text-slate-900">{service.title}</h2>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600">
                    {service.description || "Deskripsi layanan belum tersedia."}
                  </p>
                  <div className="mt-auto">
                    {ctaEnabled && ctaLink ? (
                      <a
                        href={ctaLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-brand-600 px-5 py-3 text-sm font-semibold text-brand-700 transition hover:bg-brand-600 hover:text-white"
                      >
                        {ctaLabel}
                        <span aria-hidden>→</span>
                      </a>
                    ) : null}
                  </div>
                </article>
            )
          })}
        </div>
      </div>
    </div>
  )
}
