import SectionHeader from "./SectionHeader"
import { Link } from "react-router-dom"
import { resolvePublicUrl } from "../utils/media"
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay, Navigation, Pagination } from "swiper/modules"
import { motion } from "framer-motion"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"

function formatDate(value) {
  if (!value) return ""
  return new Date(value).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })
}

export default function NewsSection({ news = [] }) {
  if (!news.length) return null
  const displayNews = news.slice(0, 3)

  return (
    <section id="berita" className="bg-white py-16">
      <div className="container-section">
        <SectionHeader
          eyebrow="Berita Terbaru"
          title="Kabar dan Pengumuman Kelurahan"
          description="Sajian informasi terbaru dengan tampilan dinamis untuk memudahkan warga mengikuti perkembangan kelurahan."
        />

        <div className="mt-10">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={32}
            slidesPerView={1}
            autoplay={{ delay: 6000, pauseOnMouseEnter: true }}
            pagination={{ clickable: true }}
            navigation
            breakpoints={{
              768: { slidesPerView: 2 },
              1280: { slidesPerView: 3 },
            }}
            className="py-6"
          >
            {displayNews.map((item, index) => {
              const coverUrl = resolvePublicUrl(item.cover_url || item.coverUrl)
              const newsLink = `/berita/${item.slug || item.id}`
              return (
              <SwiperSlide key={item.id ?? index}>
                  <Link to={newsLink} className="group block h-full" aria-label={`Baca ${item.title}`}>
                    <motion.article
                      layout
                      className="flex h-full flex-col overflow-hidden rounded-3xl bg-slate-50 shadow-soft ring-1 ring-slate-100 transition duration-300 group-hover:-translate-y-1 group-hover:shadow-xl"
                      initial={{ opacity: 0, y: 24 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.05 }}
                      viewport={{ once: true }}
                    >
                      <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900">
                        {coverUrl ? (
                          <img
                            src={coverUrl}
                            alt={item.title}
                            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                            loading="lazy"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-white">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              className="h-12 w-12 opacity-90"
                              aria-hidden
                            >
                              <path
                                fill="currentColor"
                                d="M5 5h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2m7 3a3 3 0 1 0 3 3a3 3 0 0 0-3-3m8 9l-3.5-4.5L14 17l-2.5-3.5L7 17Z"
                              />
                            </svg>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent" />
                        {item.is_featured ? (
                          <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-700">
                            Sorotan
                          </span>
                        ) : null}
                      </div>

                      <div className="flex flex-1 flex-col gap-4 p-6">
                        <div className="space-y-2">
                          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-600">
                            {formatDate(item.published_at || item.created_at)}
                          </p>
                          <h3 className="text-lg font-semibold text-slate-900 clamp-2">{item.title}</h3>
                          <p className="text-sm text-slate-600 clamp-3">
                            {item.summary || item.body || "Konten berita akan segera hadir."}
                          </p>
                        </div>

                        {item.tags?.length ? (
                          <div className="flex flex-wrap gap-2">
                            {item.tags.map((tag) => (
                              <span
                                key={tag}
                                className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-brand-700"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        ) : null}

                        <span className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-brand-700">
                          Baca selengkapnya
                          <span aria-hidden>→</span>
                        </span>
                      </div>
                    </motion.article>
                  </Link>
                </SwiperSlide>
              )
            })}
          </Swiper>
        </div>

        <div className="mt-6 text-center">
          <Link
            to="/berita"
            className="inline-flex rounded-full bg-brand-700 px-6 py-2 text-sm font-semibold text-white shadow-soft"
          >
            Lihat semua berita
          </Link>
        </div>
      </div>
    </section>
  )
}
