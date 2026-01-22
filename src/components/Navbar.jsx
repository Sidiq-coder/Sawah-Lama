import { navItems } from "../data/siteData"

export default function Navbar() {
  return (
    <header className="sticky top-0 z-30 bg-brand-700 text-white shadow-soft">
      <div className="container-section flex items-center justify-between py-4">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-700">
            <span className="text-lg font-bold">SL</span>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-100">
              Pemerintah Kota
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

        <a
          href="#kontak"
          className="hidden rounded-full border border-white/40 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-white hover:text-brand-700 md:inline-flex"
        >
          Hubungi Kami
        </a>
      </div>
    </header>
  )
}
