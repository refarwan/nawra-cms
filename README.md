# Nawra CMS ✦

Sistem Manajemen Konten (CMS) Visual Modern tanpa koding yang dirancang untuk berjalan di **Cloudflare Workers** dan **Cloudflare D1 (SQLite di Edge)**.

---

## ⚡ Deploy Mandiri via GitHub Fork (100% Tanpa Terminal)

Anda dapat memiliki CMS pribadi yang aktif di jaringan Cloudflare dalam waktu kurang dari 3 menit tanpa perlu menyentuh terminal:

### Langkah 1: Fork Repository Ini

Klik tombol **Fork** di pojok kanan atas halaman GitHub ini untuk menyalin repository ke akun GitHub Anda.

---

### Langkah 2: Buat Database D1 di Cloudflare

1. Buka [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. Di bilah menu samping kiri, pilih **Storage & Databases** ➔ **D1 SQL Database**.
3. Klik tombol **Create database**.
4. Beri nama database (misalnya: `nawra-cms-db`), lalu klik **Create**.

---

### Langkah 3: Sambungkan Fork ke Cloudflare Workers

1. Di Cloudflare Dashboard, buka **Compute (Workers)** ➔ **Create application** ➔ pilih tab **Pages / Workers**.
2. Klik tombol **Connect to Git** dan pilih repository hasil fork Anda (`username/nawra-cms`).
3. Pengaturan build otomatis terdeteksi:
   - **Framework preset**: `SvelteKit`
   - **Build command**: `npm run build`
   - **Build output directory**: `.svelte-kit/cloudflare`
4. Klik **Save and Deploy**.

---

### Langkah 4: Hubungkan Binding Database D1

Setelah proses deployment pertama selesai:

1. Buka halaman aplikasi Worker Anda di Cloudflare Dashboard.
2. Masuk ke tab **Settings** ➔ pilih menu **Bindings**.
3. Klik tombol **Add** ➔ pilih opsi **D1 Database**.
4. Masukkan konfigurasi berikut:
   - **Variable name**: `DB` _(Wajib menggunakan huruf kapital `DB`)_
   - **D1 database**: Pilih database yang telah dibuat pada Langkah 2 (`nawra-cms-db`).
5. Klik **Save and deploy**.

---

### Langkah 5: Selesai & Login ke Dashboard

Kunjungi URL domain Worker Anda (contoh: `https://nawra-cms.workers.dev/login`):

- Database D1 otomatis menginisialisasi skema tabel saat halaman pertama kali dibuka.
- Masuk menggunakan kredensial default admin:
  - **Username**: `admin` (atau **Email**: `admin@nawra.com`)
  - **Kata Sandi**: `admin123`

---

## 🔄 Cara Memperbarui ke Versi Terbaru

Ketika ada pembaruan fitur atau perbaikan pada repository utama:

1. Buka halaman repository hasil fork Anda di GitHub.
2. Klik tombol **Sync fork** ➔ **Update branch**.
3. Cloudflare akan otomatis mendeteksi perubahan, membangun ulang, dan me-redeploy versi terbaru dalam beberapa detik!

---

## 💻 Menjalankan di Lokal (Pengembangan / Kontributor)

Untuk mencoba atau berkontribusi secara lokal, Anda **tidak memerlukan akun Cloudflare**:

```bash
# 1. Clone repository hasil fork Anda
git clone https://github.com/<username>/nawra-cms.git
cd nawra-cms

# 2. Pasang dependensi
npm install

# 3. Jalankan server lokal
npm run dev
```

Buka `http://localhost:5173/login`:

- Sistem secara otomatis menggunakan _in-memory SQLite fallback_ dan _auto-seed_ akun demo.

---

## 🛠️ Perintah Kode & Verifikasi

```bash
# Validasi tipe data (Type Check)
npm run check

# Pemeriksaan linter dan format kode
npm run lint

# Format kode otomatis
npm run format

# Kompilasi produksi (Build bundle)
npm run build
```
