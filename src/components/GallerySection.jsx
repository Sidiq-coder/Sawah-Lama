import SectionHeader from "./SectionHeader"
import { galleryItems } from "../data/siteData"

export default function GallerySection() {
  return (
    <section id="galeri" className="bg-white py-16">
      <div className="container-section">
        <SectionHeader
          eyebrow="Galeri"
          title="Dokumentasi Kegiatan"
          description="Dokumentasi kegiatan dan fasilitas Kelurahan Sawah Lama."
        />

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {galleryItems.map((item, index) => (
            <article
              key={item.title}
              className="group overflow-hidden rounded-2xl bg-white shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-xl animate-fade-up"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <div
                className="relative h-40 w-full bg-gradient-to-br from-brand-500 via-brand-600 to-brand-800"
                style={{
                  backgroundImage: item.imageUrl
                    ? `linear-gradient(135deg, rgba(244,63,94,0.35), rgba(190,18,60,0.35)), url('${item.imageUrl}')`
                    : "linear-gradient(135deg, rgba(244,63,94,0.7), rgba(190,18,60,0.7))",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
                aria-hidden
              />
              <div className="p-4">
                <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                <p className="mt-1 text-xs text-slate-500">{item.caption}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 text-center">
          <button className="rounded-full bg-brand-700 px-6 py-2 text-sm font-semibold text-white shadow-soft">
            Lihat Semua Galeri
          </button>
        </div>
      </div>
    </section>
  )
}
