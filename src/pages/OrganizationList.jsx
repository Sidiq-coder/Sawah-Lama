import { Link } from "react-router-dom"
import { usePublicContent } from "../hooks/usePublicContent"
import { resolvePublicUrl } from "../utils/media"

function sortByOrder(items = []) {
  return [...items].sort((a, b) => {
    const orderA = Number.isFinite(a?.sort_order) ? a.sort_order : Number(a?.sortOrder) || 0
    const orderB = Number.isFinite(b?.sort_order) ? b.sort_order : Number(b?.sortOrder) || 0
    return orderA - orderB
  })
}

function OrganizationCard({ person }) {
  const avatar = resolvePublicUrl(person.image_url || person.imageUrl)
  return (
    <article className="card text-center transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      {avatar ? (
        <img
          src={avatar}
          alt={person.name}
          className="mx-auto mb-4 h-20 w-20 rounded-full object-cover ring-4 ring-brand-50"
          loading="lazy"
        />
      ) : (
        <div className="mx-auto mb-4 grid h-20 w-20 place-items-center rounded-full bg-brand-50 text-2xl animate-float">
          👤
        </div>
      )}
      <h3 className="text-base font-semibold text-slate-900">{person.name}</h3>
      {person.positionLabel ? <p className="text-sm font-medium text-brand-600">{person.positionLabel}</p> : null}
      {person.nip ? <p className="mt-2 text-xs text-slate-500">NIP {person.nip}</p> : null}
    </article>
  )
}

export default function OrganizationList() {
  const { data, isLoading } = usePublicContent()
  const members = data?.organization || []
  const positions = data?.organizationPositions || []

  const sortedPositions = sortByOrder(positions)
  const positionMap = Object.fromEntries(sortedPositions.map((pos) => [pos.id, pos]))
  const sortedMembers = sortByOrder(members).map((person) => ({
    ...person,
    positionLabel: positionMap[person.position_id]?.title || person.role,
  }))

  const membersByPosition = sortedMembers.reduce((acc, person) => {
    const hasKnownPosition = person.position_id && positionMap[person.position_id]
    const key = hasKnownPosition ? person.position_id : "__unassigned__"
    if (!acc[key]) acc[key] = []
    acc[key].push(person)
    return acc
  }, {})

  const unassignedMembers = membersByPosition.__unassigned__ || []

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-brand-700">
        <div className="container-section py-12 text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-brand-100">
            Pemerintahan & Organisasi
          </p>
          <h1 className="mt-3 text-3xl font-bold">Struktur Pemerintahan & Organisasi</h1>
          <p className="mt-2 text-sm text-brand-100">
            Susunan jabatan dan pejabat Kelurahan Sawah Lama.
          </p>
          <Link
            to="/"
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/40 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-white hover:text-brand-700"
          >
            ← Kembali ke Beranda
          </Link>
        </div>
      </div>

      <div className="container-section space-y-10 py-10">
        {isLoading ? <div className="h-40 animate-pulse rounded-3xl bg-slate-100" /> : null}

        {!isLoading && sortedMembers.length === 0 ? (
          <div className="rounded-3xl bg-slate-50 p-8 text-center text-sm text-slate-500">
            Belum ada data struktur pemerintahan dan organisasi.
          </div>
        ) : null}

        {sortedPositions.length ? (
          sortedPositions.map((position) => {
            const people = membersByPosition[position.id] || []
            return (
              <section key={position.id} className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="chip">Posisi</span>
                  <h2 className="text-xl font-semibold text-slate-900">{position.title}</h2>
                </div>
                {people.length ? (
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {people.map((person) => (
                      <OrganizationCard key={person.id || person.name} person={person} />
                    ))}
                  </div>
                ) : (
                  <div className="rounded-3xl bg-slate-50 p-6 text-sm text-slate-500">
                    Belum ada pejabat pada posisi ini.
                  </div>
                )}
              </section>
            )
          })
        ) : sortedMembers.length ? (
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="chip">Pemerintahan & Organisasi</span>
              <h2 className="text-xl font-semibold text-slate-900">Daftar pejabat</h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {sortedMembers.map((person) => (
                <OrganizationCard key={person.id || person.name} person={person} />
              ))}
            </div>
          </section>
        ) : null}

        {unassignedMembers.length ? (
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="chip">Lainnya</span>
              <h2 className="text-xl font-semibold text-slate-900">Anggota lainnya</h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {unassignedMembers.map((person) => (
                <OrganizationCard key={person.id || person.name} person={person} />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  )
}
