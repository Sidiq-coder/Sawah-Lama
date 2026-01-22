import SectionHeader from "./SectionHeader"
import { aboutInfo, wilayahInfo } from "../data/siteData"

export default function AboutSection() {
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
              {aboutInfo.points.map((point) => (
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
              {wilayahInfo.map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="text-slate-500">{item.label}</span>
                  <span className="font-semibold text-slate-800">{item.value}</span>
                </div>
              ))}
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}
