import { Link } from "react-router-dom"
import { resolvePublicUrl } from "../utils/media"

export default function InfoCards({ cards = [] }) {
  if (!cards.length) return null

  return (
    <section className="relative z-10 -mt-12 pb-12">
      <div className="container-section grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((card, index) => {
          const cardKey = card.id || card.title || index
          const rawImage = card.image_url || card.imageUrl
          const imageUrl = resolvePublicUrl(rawImage)
          const linkTarget =
            card.link_href || card.linkHref || card.cta_href || card.ctaHref || card.path || card.href
          const isHashLink = typeof linkTarget === "string" && linkTarget.startsWith("#")
          const isExternal = typeof linkTarget === "string" && /^https?:/i.test(linkTarget)
          const animationStyle = { animationDelay: `${index * 80}ms` }

          const content = (
            <article
              className={`card flex h-full flex-col gap-3 transition duration-300 hover:-translate-y-1 hover:shadow-xl animate-fade-up ${linkTarget ? "cursor-pointer" : ""}`.trim()}
              style={animationStyle}
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

          if (linkTarget) {
            if (isExternal) {
              return (
                <a
                  key={cardKey}
                  href={linkTarget}
                  target="_blank"
                  rel="noreferrer"
                  className="group block h-full"
                  aria-label={`Buka ${card.title}`}
                >
                  {content}
                </a>
              )
            }

            if (isHashLink) {
              return (
                <a key={cardKey} href={linkTarget} className="group block h-full" aria-label={card.title}>
                  {content}
                </a>
              )
            }

            return (
              <Link key={cardKey} to={linkTarget} className="group block h-full" aria-label={card.title}>
                {content}
              </Link>
            )
          }

          return (
            <div key={cardKey} className="h-full">
              {content}
            </div>
          )
        })}
      </div>
    </section>
  )
}
