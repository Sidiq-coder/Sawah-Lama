import SectionHeader from "./SectionHeader"

export default function DataSection({ dataGroups = [] }) {
  if (!dataGroups.length) return null

  return (
    <section id="data" className="bg-brand-50/60 py-16">
      <div className="container-section">
        <SectionHeader
          eyebrow="Data"
          title="Kumpulan Data"
          description="Informasi dan data Kelurahan Sawah Lama yang dapat diakses masyarakat."
        />

        <div className="mt-10 space-y-4">
          {dataGroups.map((group, index) => (
            <details
              key={group.title}
              className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-soft transition duration-300 hover:shadow-xl animate-fade-up"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-semibold text-slate-900">
                {group.title}
                <span className="text-brand-600 transition group-open:rotate-180">⌄</span>
              </summary>
              <div className="mt-4 space-y-2 text-sm text-slate-600">
                {group.items?.map((item) => (
                  <div key={item} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
                    <span>{item}</span>
                    <span className="rounded-full bg-brand-600 px-3 py-1 text-xs font-semibold text-white">
                      Lihat
                    </span>
                  </div>
                ))}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
