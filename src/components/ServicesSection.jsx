import { Link } from "react-router-dom"
import SectionHeader from "./SectionHeader"
import { resolvePublicUrl } from "../utils/media"

export default function ServicesSection({ services = [] }) {
  if (!services.length) return null

  return (
    <section id="pelayanan" className="bg-brand-50/60 py-16">
      <div className="container-section">
        <SectionHeader
          eyebrow="Pelayanan"
          title="Pelayanan Untuk Masyarakat"
          description="Berbagai jenis pelayanan yang tersedia di Kelurahan Sawah Lama."
        />

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {services.map((service, index) => {
            const ctaEnabled = service.cta_enabled === true
            const ctaLabel = service.cta_label || "Buat Surat Ini"
            const ctaLink = service.cta_link
            const previewUrl = resolvePublicUrl(service.image_url || service.imageUrl)
            return (
              <article
                key={service.id || service.title || index}
                className="flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-soft ring-1 ring-slate-100 transition duration-300 hover:-translate-y-1 hover:shadow-xl animate-fade-up"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                  <div className="relative h-28 w-full overflow-hidden bg-gradient-to-br from-brand-500 via-brand-600 to-brand-800">
                    {previewUrl ? (
                      <img
                        src={previewUrl}
                        alt={service.title}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : null}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent" />
                    <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-brand-700">
                      <span>{previewUrl ? "Thumbnail" : "Tanpa thumbnail"}</span>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col gap-3 p-5">
                    {service.icon ? (
                      <div className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-50 text-lg text-brand-700">
                        {service.icon}
                      </div>
                    ) : null}
                    <h3 className="text-base font-semibold text-slate-900 clamp-2">{service.title}</h3>
                    <p className="text-sm text-slate-500 clamp-3">
                      {service.description || "Deskripsi layanan belum tersedia."}
                    </p>
                    {ctaEnabled && ctaLink ? (
                      <a
                        href={ctaLink}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-auto inline-flex items-center gap-1 text-xs font-semibold text-brand-700"
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

        <div className="mt-8 text-center">
          <Link
            to="/layanan"
            className="inline-flex rounded-full bg-brand-700 px-6 py-2 text-sm font-semibold text-white shadow-soft"
          >
            Kunjungi Halaman Layanan
          </Link>
        </div>
      </div>
    </section>
  )
}
