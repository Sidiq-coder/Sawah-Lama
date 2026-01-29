import SectionHeader from "./SectionHeader"

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

          <article className="card min-w-0 animate-fade-up" style={{ animationDelay: "120ms" }}>
            <div className="flex h-full min-h-[220px] items-center justify-center rounded-2xl bg-slate-100 text-sm text-slate-400">
              Peta Lokasi (Embed)
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}
