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
            {news.map((item, index) => (
              <SwiperSlide key={item.id ?? index}>
                <motion.article
                  layout
                  className="flex h-full flex-col overflow-hidden rounded-3xl bg-slate-50 shadow-soft ring-1 ring-slate-100"
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  viewport={{ once: true }}
                >
                  {item.cover_url ? (
                    <div className="relative h-48 w-full overflow-hidden">
                      <img
                        src={resolvePublicUrl(item.cover_url)}
                        alt={item.title}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent" />
                      {item.is_featured ? (
                        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-700">
                          Sorotan
                        </span>
                      ) : null}
                    </div>
                  ) : null}

                  <div className="flex flex-1 flex-col gap-4 p-6">
                    <div className="space-y-2">
                      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-600">
                        {formatDate(item.published_at || item.created_at)}
                      </p>
                      <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
                      <p className="text-sm text-slate-600">
                        {item.summary || item.body?.slice(0, 140) || ""}
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

                    <Link
                      to={`/berita/${item.slug || item.id}`}
                      className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-brand-700 hover:underline"
                    >
                      Baca selengkapnya
                      <span aria-hidden>→</span>
                    </Link>
                  </div>
                </motion.article>
              </SwiperSlide>
            ))}
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
