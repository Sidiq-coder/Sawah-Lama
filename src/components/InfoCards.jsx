import { resolvePublicUrl } from "../utils/media"

export default function InfoCards({ cards = [] }) {
  if (!cards.length) return null

  return (
    <section className="relative z-10 -mt-12 pb-12">
      <div className="container-section grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((card, index) => {
          const rawImage = card.image_url || card.imageUrl
          const imageUrl = resolvePublicUrl(rawImage)
          return (
            <article
            key={card.title}
            className="card flex flex-col gap-3 transition duration-300 hover:-translate-y-1 hover:shadow-xl animate-fade-up"
            style={{ animationDelay: `${index * 80}ms` }}
          >
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={card.title}
                className="h-12 w-12 rounded-xl object-cover"
                loading="lazy"
              />
            ) : (
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-lg">
                {card.icon}
              </div>
            )}
            <h3 className="text-base font-semibold text-slate-900">{card.title}</h3>
            <p className="text-sm text-slate-500">{card.description}</p>
            </article>
          )
        })}
      </div>
    </section>
  )
}
