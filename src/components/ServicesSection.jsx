import SectionHeader from "./SectionHeader"

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
          {services.map((service, index) => (
            <article
              key={service.title}
              className="card space-y-3 transition duration-300 hover:-translate-y-1 hover:shadow-xl animate-fade-up"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand-100 text-lg">
                {service.icon}
              </div>
              <h3 className="text-base font-semibold text-slate-900">{service.title}</h3>
              <p className="text-sm text-slate-500">{service.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
