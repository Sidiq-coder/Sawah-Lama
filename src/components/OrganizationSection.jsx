import SectionHeader from "./SectionHeader"
import { resolvePublicUrl } from "../utils/media"

export default function OrganizationSection({ organization = [] }) {
  if (!organization.length) return null

  return (
    <section id="organisasi" className="bg-brand-50/60 py-16">
      <div className="container-section">
        <SectionHeader
          eyebrow="Organisasi"
          title="Struktur Organisasi"
          description="Struktur organisasi Kelurahan Sawah Lama."
        />

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {organization.map((person, index) => {
            const avatar = resolvePublicUrl(person.image_url || person.imageUrl)
            return (
              <article
                key={person.id || person.name}
                className="card text-center transition duration-300 hover:-translate-y-1 hover:shadow-xl animate-fade-up"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                {avatar ? (
                  <img
                    src={avatar}
                    alt={person.name}
                    className="mx-auto mb-4 h-16 w-16 rounded-full object-cover ring-4 ring-brand-50"
                    loading="lazy"
                  />
                ) : (
                  <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-brand-50 text-xl animate-float">
                    👤
                  </div>
                )}
                <h3 className="text-base font-semibold text-slate-900">{person.name}</h3>
                <p className="text-sm font-medium text-brand-600">{person.role}</p>
                <p className="mt-2 text-xs text-slate-500">NIP {person.nip}</p>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
