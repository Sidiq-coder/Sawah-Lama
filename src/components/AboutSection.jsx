import { Link } from "react-router-dom"
import SectionHeader from "./SectionHeader"

export default function AboutSection({ aboutInfo, wilayahInfo = [] }) {
  if (!aboutInfo) return null

  return (
    <section id="tentang" className="py-16">
      <div className="container-section">
        <SectionHeader
          eyebrow="Tentang Kami"
          title="Kelurahan Sawah Lama"
          description="Profil ringkas kelurahan dan informasi wilayah untuk masyarakat."
        />

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <article className="card space-y-4 animate-fade-up">
            <h3 className="text-lg font-semibold text-slate-900">{aboutInfo.title}</h3>
            <p className="text-sm text-slate-600">{aboutInfo.description}</p>
            <ul className="space-y-2 text-sm text-slate-600">
              {aboutInfo.points?.map((point) => (
                <li key={point} className="flex items-start gap-2">
                  <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-brand-500" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </article>

          <article className="card animate-fade-up" style={{ animationDelay: "120ms" }}>
            <div className="flex items-center justify-between">
              <h4 className="text-base font-semibold text-slate-900">Informasi Wilayah</h4>
              <span className="chip">Update</span>
            </div>
            <div className="mt-4 space-y-3 text-sm">
              {wilayahInfo?.map((item) => (
                <Link
                  key={item.label}
                  to="/wilayah"
                  className="flex items-center justify-between rounded-2xl px-3 py-2 text-slate-600 transition hover:bg-brand-50/80"
                >
                  <span>{item.label}</span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-brand-700">
                    {item.value || "Lihat"}
                  </span>
                </Link>
              ))}
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}
