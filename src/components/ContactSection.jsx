import SectionHeader from "./SectionHeader"

const MAP_QUERY = encodeURIComponent("Kelurahan Sawah Lama, Tanjung Karang Timur, Bandar Lampung")
const MAP_EMBED_URL = `https://maps.google.com/maps?q=${MAP_QUERY}&z=16&output=embed`
const MAP_LINK_URL = `https://maps.google.com/maps?q=${MAP_QUERY}&z=16`

export default function ContactSection({ contactInfo = [] }) {
  if (!contactInfo.length) return null

  return (
    <section id="kontak" className="bg-white py-16">
      <div className="container-section">
        <SectionHeader
          eyebrow="Hubungi Kami"
          title="Informasi Kontak"
          description="Silakan hubungi kami untuk informasi lebih lanjut."
        />

        <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_1.2fr]">
          <article className="card min-w-0 space-y-4 animate-fade-up">
            {contactInfo.map((info) => (
              <div key={info.label} className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-widest text-brand-600">
                  {info.label}
                </p>
                <p className="break-words text-sm text-slate-600">{info.value}</p>
              </div>
            ))}
          </article>

          <article className="card min-w-0 space-y-4 animate-fade-up" style={{ animationDelay: "120ms" }}>
            <div className="overflow-hidden rounded-2xl shadow-inner">
              <iframe
                title="Lokasi Kelurahan Sawah Lama"
                src={MAP_EMBED_URL}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-72 w-full"
                allowFullScreen
              />
            </div>
            <a
              href={MAP_LINK_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold text-brand-700"
            >
              Buka di Google Maps
              <span aria-hidden>↗</span>
            </a>
          </article>
        </div>
      </div>
    </section>
  )
}
