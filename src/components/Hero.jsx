import { useEffect, useState } from "react"
import { heroSlides } from "../data/siteData"

export default function Hero() {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const intervalId = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % heroSlides.length)
    }, 5000)

    return () => clearInterval(intervalId)
  }, [])

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
  }

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % heroSlides.length)
  }

  return (
    <section id="beranda" className="relative overflow-hidden bg-brand-700 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.18),_transparent_55%)]" />
      <div className="container-section relative py-20 sm:py-24 lg:py-28">
        <div className="relative px-10 text-center sm:px-14">
          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-0 top-1/2 hidden -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-white/10 p-3 text-white transition hover:bg-white/20 sm:flex"
            aria-label="Slide sebelumnya"
          >
            ‹
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="absolute right-0 top-1/2 hidden -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-white/10 p-3 text-white transition hover:bg-white/20 sm:flex"
            aria-label="Slide berikutnya"
          >
            ›
          </button>

          <div key={activeIndex} className="animate-fade-up">
            <h1 className="text-3xl font-bold sm:text-4xl lg:text-5xl">
              {heroSlides[activeIndex].title}
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-sm text-white/90 sm:text-base">
              {heroSlides[activeIndex].description}
            </p>
            <a
              href={heroSlides[activeIndex].ctaHref}
              className="mt-8 inline-flex rounded-full border-2 border-brand-200 px-8 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-brand-700"
            >
              {heroSlides[activeIndex].ctaLabel}
            </a>
          </div>

          <div className="mt-10 flex items-center justify-center gap-2">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`h-2 w-8 rounded-full transition ${
                  activeIndex === index ? "bg-white" : "bg-white/40"
                }`}
                aria-label={`Slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
