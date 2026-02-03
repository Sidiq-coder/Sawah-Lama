import { useState } from "react"

export default function Navbar({ navItems = [] }) {
  const [isOpen, setIsOpen] = useState(false)

  const handleToggle = () => {
    setIsOpen((prev) => !prev)
  }

  const handleClose = () => {
    setIsOpen(false)
  }

  return (
    <header className="sticky top-0 z-30 bg-brand-700 text-white shadow-soft">
      <div className="container-section flex items-center justify-between py-4">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-white text-brand-700">
            <span className="text-lg font-bold">SL</span>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-100">
              WEB KELURAHAN
            </p>
            <p className="text-sm font-bold">Kelurahan Sawah Lama</p>
          </div>
        </div>

        <nav className="hidden items-center gap-6 text-sm font-medium lg:flex">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} className="text-brand-50/90 hover:text-white">
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center md:inline-flex">
          <a
            href="#kontak"
            className="rounded-full border border-white/40 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-white hover:text-brand-700"
          >
            Hubungi Kami
          </a>
        </div>

        <button
          type="button"
          onClick={handleToggle}
          className="inline-flex items-center justify-center rounded-xl border border-white/30 bg-white/10 p-2 text-white transition hover:bg-white/20 lg:hidden"
          aria-label="Buka menu"
          aria-expanded={isOpen}
        >
          ☰
        </button>
      </div>

      <div
        className={`border-t border-white/10 bg-brand-700/95 backdrop-blur transition-all duration-200 lg:hidden ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="container-section flex flex-col gap-4 py-4">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={handleClose}
              className="text-sm font-medium text-brand-50/90 hover:text-white"
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </header>
  )
}
