<div align="center">

## Kelurahan Sawah Lama

Landing page + admin dashboard built with React 19, Vite, Tailwind CSS, Supabase, and Cloudflare R2.

</div>

### ✨ Fitur Utama

- **Landing page dinamis** – data hero, layanan, organisasi, galeri, data statistik, dan kontak ditarik dari Supabase dengan fallback konten statis sehingga halaman tetap tampil meski backend belum siap.
- **Berita interaktif** – komponen `NewsSection` menggunakan Swiper + Framer Motion untuk slider berita yang otomatis memutar serta responsif di desktop/mobile.
- **Dashboard tunggal** – login menggunakan Supabase Auth (email/password). Setelah autentikasi, admin bisa melakukan CRUD terhadap semua konten utama lewat form yang sudah dilengkapi dukungan unggah gambar ke Cloudflare R2.
- **Integrasi Cloudflare R2** – unggahan gambar dilakukan melalui endpoint pekerja (worker) yang didefinisikan di variabel lingkungan, sehingga file tetap tersimpan di storage yang terpisah dari database.
- **Data ter-cache** – React Query memegang layer caching agar perubahan dari dashboard langsung memutakhirkan tampilan publik.

### 🧱 Arsitektur & Teknologi

- React 19 + Vite 7
- Tailwind CSS 4 dengan utilitas kustom (`container-section`, `card`, dsb)
- React Router 6 untuk routing publik/login/dashboard
- React Query 5 untuk fetching/caching data
- Supabase (PostgreSQL + Auth) sebagai backend
- Swiper 11 + Framer Motion 11 untuk berita
- Cloudflare R2 (melalui endpoint worker) untuk penyimpanan gambar

### ⚙️ Persiapan Lingkungan

1. **Instalasi dependensi**
	```bash
	npm install
	```

2. **File lingkungan** – gandakan `.env.example` menjadi `.env` lalu isi:
	- `VITE_SUPABASE_URL` & `VITE_SUPABASE_ANON_KEY`
	- `VITE_DASHBOARD_ALLOWED_EMAIL` (opsional, batasi akses dashboard untuk satu email)
	- `VITE_R2_UPLOAD_URL` → endpoint Cloudflare Worker yang menerima file dan mengembalikan `{ key, url }`
	- `VITE_R2_PUBLIC_BASE_URL` → domain CDN/public bucket untuk menyusun URL file bila worker hanya mengembalikan `key`

3. **Supabase schema** – jalankan SQL pada `supabase/schema.sql` (via Supabase SQL Editor atau CLI) agar seluruh tabel + kebijakan RLS tersedia.

4. **Jalankan proyek**
	```bash
	npm run dev
	```

### ☁️ Alur Cloudflare R2

- Dashboard memanggil `VITE_R2_UPLOAD_URL` menggunakan `fetch` + `FormData`.
- Endpoint tersebut bertugas membuat signed URL / langsung meneruskan file ke R2, lalu merespons JSON `{ key, url }`.
- Nilai `url` otomatis diisikan ke form yang relevan (hero, galeri, berita, dsb.). Jika hanya `key` yang diberikan, aplikasi membentuk URL menggunakan `VITE_R2_PUBLIC_BASE_URL`.

### 🔐 Login & Dashboard

- Dashboard berada di `/dashboard` dan dibungkus `ProtectedRoute`.
- Supabase Auth hanya memerlukan **satu akun** email/password. Jika ingin membatasi, set `VITE_DASHBOARD_ALLOWED_EMAIL` agar user lain (meski berhasil login) tetap ditolak.
- CRUD tersedia untuk:
  - Hero slider
  - Kartu informasi
  - Layanan
  - Struktur organisasi
  - Galeri + berita
  - Data groups, statistik wilayah, kontak
  - Profil/about section
- Setiap aksi akan menginvalisasi cache `public-content` sehingga landing page mendapat data terbaru tanpa reload manual.

### 🗄️ Struktur Data

- Navigasi publik berada di `src/data/siteData.js`, sedangkan konten landing page sepenuhnya berasal dari Supabase.
- Service publik: `src/services/contentService.js`
- Service admin: `src/services/adminService.js`
- Supabase client: `src/lib/supabaseClient.js`
- Upload helper R2: `src/services/r2Service.js`

### 🧪 Catatan Pengembangan

- Proyek belum menambahkan test otomatis; jalankan `npm run lint` bila diperlukan.
- Jika menambah tabel baru, ikuti pola yang sama: tambahkan ke schema SQL, update `contentService`, serta buat form di dashboard.

Selamat mengembangkan! 🎉
