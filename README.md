# Nawra CMS ✦

Sistem Manajemen Konten (CMS) Visual Modern tanpa koding yang dirancang untuk berjalan di **Cloudflare Pages / Workers** dan **Cloudflare D1 (SQLite di Edge)**.

---

## ⚡ Deploy Mandiri via GitHub Fork (100% Tanpa Terminal)

Anda dapat memiliki CMS pribadi yang aktif di jaringan Cloudflare dalam waktu kurang dari 3 menit tanpa perlu menyentuh terminal:

### Langkah 1: Fork Repository Ini

Klik tombol **Fork** di pojok kanan atas halaman GitHub ini untuk menyalin repository ke akun GitHub Anda.

---

### Langkah 2: Sambungkan Fork ke Cloudflare Workers & Pages

1. Buka [Cloudflare Dashboard](https://dash.cloudflare.com/) ➔ **Compute (Workers)** ➔ **Workers & Pages** ➔ klik **Create**.
2. Klik **Import a repository** (atau **Connect to Git**) dan pilih repository hasil fork Anda (`username/nawra-cms`).
3. Pastikan pengaturan build sebagai berikut:
   - **Build command**: `npm run build`
   - **Deploy command** (jika menggunakan Workers Builds): `npx wrangler deploy`
   - **Build output directory** (jika menggunakan Pages): `.svelte-kit/cloudflare`
4. Klik **Save and Deploy**.

> **Catatan Auto-Provisioning Wrangler 4**: Jika menggunakan **Cloudflare Workers Builds** (`npx wrangler deploy`), Wrangler 4 akan **otomatis membuatkan database D1 baru** dan menghubungkannya ke binding `DB` pada saat deploy pertama kali — atau otomatis mewarisi (_inherit_) binding `DB` jika Anda sudah memasangnya di Dashboard.

---

### Langkah 3: Pastikan Binding Database D1 Bernama `DB` (Jika Menggunakan Pages atau Custom DB)

Jika Anda mengatur binding D1 secara manual melalui Cloudflare Dashboard:

1. Buka halaman project Worker / Pages Anda di Cloudflare Dashboard.
2. Masuk ke tab **Settings** ➔ pilih menu **Bindings**.
3. Pastikan binding **D1 database** menggunakan:
   - **Variable name**: `DB` _(Wajib menggunakan huruf kapital `DB`, bukan `MY_BINDING`)_
   - **D1 database**: Pilih database D1 Anda.

---

### Langkah 4: Selesai & Login ke Dashboard

Kunjungi URL domain aplikasi Anda (contoh: `https://nawra-cms.pages.dev/login`):

- Database D1 otomatis menginisialisasi skema tabel, meng-generate `jwt_secret` unik di tabel `settings`, serta membuat template bawaan (**Header**, **Footer**, dan **Home Page**) saat halaman pertama kali dibuka.
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

Untuk mencoba atau berkontribusi secara lokal, Anda **tidak memerlukan file `.env` maupun akun Cloudflare**:

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

- Melalui `platformProxy` Wrangler, sistem secara otomatis membuat database SQLite D1 lokal yang persisten di folder `.wrangler/state` serta melakukan _auto-seed_ akun admin default (`admin` / `admin123`) beserta template awal Header, Footer, dan Home Page.

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
