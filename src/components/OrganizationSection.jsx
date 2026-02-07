import { Link } from "react-router-dom"
import SectionHeader from "./SectionHeader"
import { resolvePublicUrl } from "../utils/media"

function sortByOrder(items = []) {
  return [...items].sort((a, b) => {
    const orderA = Number.isFinite(a?.sort_order) ? a.sort_order : Number(a?.sortOrder) || 0
    const orderB = Number.isFinite(b?.sort_order) ? b.sort_order : Number(b?.sortOrder) || 0
    return orderA - orderB
  })
}

export default function OrganizationSection({ organization = [], positions = [] }) {
  if (!organization.length) return null

  const hasPositions = Array.isArray(positions) && positions.length
  const sortedPositions = sortByOrder(positions)
  const visiblePositionIds = new Set(
    sortedPositions.filter((pos) => pos.show_on_landing !== false).map((pos) => pos.id),
  )
  const positionMap = Object.fromEntries(sortedPositions.map((pos) => [pos.id, pos]))
  const filteredMembers = hasPositions
    ? sortByOrder(organization).filter((person) => {
        if (!person.position_id) return false
        const positionVisible = visiblePositionIds.has(person.position_id)
        const showOnLanding = person.show_on_landing === true
        return positionVisible && showOnLanding
      })
    : sortByOrder(organization)

  return (
    <section id="organisasi" className="bg-brand-50/60 py-16">
      <div className="container-section">
        <SectionHeader
          eyebrow="Pemerintahan & Organisasi"
          title="Struktur Pemerintahan & Organisasi"
          description="Struktur pemerintahan dan organisasi Kelurahan Sawah Lama."
        />

        {filteredMembers.length ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredMembers.map((person, index) => {
              const avatar = resolvePublicUrl(person.image_url || person.imageUrl)
              const positionLabel =
                positionMap[person.position_id]?.title || person.role || positionMap[person.position_id]?.name
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
                  {positionLabel ? (
                    <p className="text-sm font-medium text-brand-600">{positionLabel}</p>
                  ) : null}
                  {person.nip ? <p className="mt-2 text-xs text-slate-500">NIP {person.nip}</p> : null}
                </article>
              )
            })}
          </div>
        ) : (
          <div className="mt-10 rounded-3xl bg-white/80 p-6 text-center text-sm text-slate-500">
            Struktur pemerintahan dan organisasi lengkap tersedia di halaman khusus.
          </div>
        )}

        <div className="mt-10 flex justify-center">
          <Link
            to="/organisasi"
            className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-brand-700 transition hover:-translate-y-0.5 hover:bg-brand-50"
          >
            Lihat Selengkapnya
            <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
