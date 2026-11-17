# Nawra CMS ✦

Sistem Manajemen Konten (CMS) Visual Modern tanpa koding yang dirancang untuk berjalan di **Netlify**, **Turso (LibSQL Serverless Database)**, dan **S3 Compatible Storage (dengan Public CDN)**.

---

## ⚡ Deployment di Netlify

1. Hubungkan repository GitHub Anda ke [Netlify Dashboard](https://app.netlify.com/).
2. Konfigurasikan **Environment Variables** di Netlify (Site settings ➔ Environment variables):
   - `TURSO_DATABASE_URL`: URL database Turso (contoh: `libsql://your-db-name.turso.io` atau `file:local.db` untuk lokal).
   - `TURSO_AUTH_TOKEN`: Auth token Turso Anda.
   - `S3_ENDPOINT`: URL endpoint S3 compatible (contoh: `https://<account_id>.r2.cloudflarestorage.com` untuk Cloudflare R2, MinIO, atau AWS S3).
   - `S3_REGION`: Region S3 (default: `auto` atau `us-east-1`).
   - `S3_BUCKET`: Nama bucket S3 tempat file media disimpan.
   - `S3_ACCESS_KEY_ID`: Access Key ID S3.
   - `S3_SECRET_ACCESS_KEY`: Secret Access Key S3.
   - `S3_PUBLIC_CDN_URL`: Domain CDN publik langsung ke bucket S3 (contoh: `https://cdn.domainanda.com` atau `https://pub-xxx.r2.dev`). **Gambar disajikan langsung lewat URL ini sehingga 100% menghemat kuota bandwidth Netlify.**
   - `JWT_SECRET`: _(Opsional)_ Kunci rahasia untuk JWT. Jika kosong, sistem otomatis meng-generate dan menyimpannya di tabel settings database.
3. Klik **Deploy site**.

---

## 💻 Menjalankan di Lokal (Pengembangan)

Untuk mencoba atau berkontribusi secara lokal:

```bash
# 1. Clone repository
git clone https://github.com/<username>/nawra-cms.git
cd nawra-cms

# 2. Pasang dependensi
bun install

# 3. Salin konfigurasi environment
cp .env.example .env

# 4. Jalankan server lokal (menggunakan local SQLite file:local.db secara default)
bun run dev
```

Buka `http://localhost:5173/login`:

- Sistem secara otomatis membuat tabel yang diperlukan serta melakukan _auto-seed_ akun admin default (`admin` / `admin123`) beserta template awal Header, Footer, dan Home Page.

---

## 🛠️ Perintah Kode & Verifikasi

```bash
# Validasi tipe data (Type Check)
bun run check

# Pemeriksaan linter dan format kode
bun run lint

# Format kode otomatis
bun run format

# Kompilasi produksi (Build bundle Netlify)
bun run build

# Menjalankan migrasi database
bun run db:migrate
```
