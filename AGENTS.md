# Agent Instructions & Project Guidelines

## 1. Code Size Constraint (Max 200 Lines)

- **Hard Limit**: Setiap file kode (`.svelte`, `.ts`, `.js`, dll.) tidak boleh melebihi **200 baris** (No file should exceed 200 lines of code).
- **Pemecahan Komponen & Modul (Decomposition Rules)**:
  - Jika sebuah file komponen atau halaman (`+page.svelte`, `+layout.svelte`, atau komponen `.svelte` lainnya) mendekati atau melebihi 200 baris, **wajib dipecah menjadi beberapa sub-komponen terpisah**.
  - Letakkan sub-komponen pada folder `components/` terdekat dari rute terkait (misalnya: `src/routes/<rute>/components/<NamaKomponen>.svelte`) atau di `src/lib/components/` jika bersifat reusable/global.
  - Pisahkan logika TypeScript/JavaScript, data fetching, helper, atau state management (runes/stores/utils) ke file `.ts` terpisah (misalnya: di `src/lib/utils/`, `.svelte.ts`, atau helper lokal) agar file template `.svelte` tetap ringkas dan fokus pada representasi UI.
- **Larangan Bucket / Barrel Export**:
  - **Dilarang keras menggunakan bucket/barrel export** (`index.ts` atau `index.js` yang berisi `export * from ...` atau mengumpulkan re-export dari berbagai komponen/modul).
  - Selalu gunakan direct import secara eksplisit ke file tujuannya masing-masing (misalnya: `import Textfield from "#lib/components/ui/Textfield.svelte"` atau `import { authStore } from "#lib/stores/auth.svelte"`, bukan `import { Textfield, authStore } from "#lib"`).

## 2. Post-Task Verification Pipeline (Definition of Done)

Sebelum menyelesaikan tugas atau menyatakan pekerjaan selesai, Anda **WAJIB** menjalankan tahapan verifikasi berikut secara berurutan:

1. **Format Awal**:
   Jalankan:

   ```bash
   npm run format
   ```

2. **Audit Jumlah Baris**:
   Periksa kembali jumlah baris pada semua file yang baru dibuat atau diubah:
   - Jika setelah di-format ada file yang melebihi 200 baris, **segera pecahkan (refactor) menjadi sub-komponen atau helper terpisah**.
   - Jika ada file yang baru dipecah, jalankan `npm run format` kembali.

3. **Linting**:
   Jalankan:

   ```bash
   npm run lint
   ```

   Perbaiki segera jika terdapat error atau warning.

4. **Type Check & Validasi Akhir**:
   Jalankan:

   ```bash
   npm run check
   ```

   Pastikan tidak ada kesalahan diagnostik Svelte / TypeScript (0 errors & 0 warnings) sebelum mengakhiri tugas.

## 3. Git Operations Constraint

- **Dilarang keras melakukan `git add`, `git commit`, atau `git push`** kecuali secara eksplisit diminta oleh user. Selesaikan seluruh pekerjaan sampai tahap validasi kode (DoD) tanpa menyentuh perintah commit/push git.

## 4. UI & Styling Constraint (No Shadows)

- **Dilarang keras menggunakan shadow / bayangan** (`shadow`, `shadow-xs`, `shadow-sm`, `shadow-md`, `shadow-lg`, `shadow-xl`, `shadow-2xl`, `box-shadow`, `drop-shadow`, dll.) pada elemen/komponen UI mana pun di seluruh aplikasi.
- **Satu-satunya pengecualian yang diizinkan**: efek glow / shadow pada progress bar `TopLoader` (`src/lib/components/TopLoader.svelte`).
