import { quickLinks } from "../data/siteData"

export default function Footer() {
  return (
    <footer className="bg-brand-700 text-white">
      <div className="container-section grid gap-8 py-10 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-white text-brand-700">
              <span className="text-lg font-bold">SL</span>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-100">
                Kelurahan
              </p>
              <p className="text-sm font-bold">Sawah Lama</p>
            </div>
          </div>
          <p className="text-sm text-brand-100">
            Website resmi Kelurahan Sawah Lama, Kecamatan Tanjung Karang Timur,
            Kota Bandar Lampung.
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold">Tautan Cepat</p>
          <ul className="mt-3 space-y-2 text-sm text-brand-100">
            {quickLinks.map((link) => (
              <li key={link}>{link}</li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold">Ikuti Kami</p>
          <div className="mt-3 space-y-2 text-sm text-brand-100">
            <p>Instagram: @kelurahan.sawahlama</p>
            <p>Email: kelurahan.sawahlama@bandarlampungkota.go.id</p>
            <p>Telepon: (0721) 123456</p>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-brand-100">
        © 2026 Kelurahan Sawah Lama. All rights reserved.
      </div>
    </footer>
  )
}
