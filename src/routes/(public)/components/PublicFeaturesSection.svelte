<script lang="ts">
  import Icon from "@iconify/svelte";

  import { resolve } from "$app/paths";

  const features = [
    {
      icon: "lucide:layout-template",
      title: "Kanvas Desain & Auto-Layout",
      desc: "Susun elemen secara bebas atau gunakan Flexbox Baris dan Kolom otomatis dengan pengaturan gap, padding, dan perataan presisi."
    },
    {
      icon: "lucide:layers",
      title: "Manajemen Hirarki Layer",
      desc: "Kelola struktur halaman secara visual melalui panel layer: ubah urutan via drag-and-drop, kunci posisi, atau sembunyikan elemen."
    },
    {
      icon: "lucide:smartphone",
      title: "Pratinjau 3 Mode Layar",
      desc: "Uji tampilan halaman pada ukuran Desktop (1280px), Tablet (768px), dan Mobile (390px) secara langsung di dalam ruang kerja editor."
    },
    {
      icon: "lucide:sliders",
      title: "Inspektor Properti Lengkap",
      desc: "Atur tipografi, warna latar, garis pinggir, opasitas, hingga tautan tombol secara real-time tanpa perlu menulis satu baris CSS."
    },
    {
      icon: "lucide:video",
      title: "Embed Gambar & YouTube Instan",
      desc: "Cukup salin dan tempel URL video YouTube biasa atau tautan gambar, dan sistem otomatis mengubahnya menjadi elemen responsif."
    },
    {
      icon: "lucide:database",
      title: "Penyimpanan Cloudflare D1",
      desc: "Setiap perubahan desain disimpan dalam format JSON dan HTML murni di database serverless Cloudflare D1 yang cepat dan aman."
    }
  ];

  const steps = [
    {
      step: "Langkah 01",
      title: "Pilih & Susun Komponen",
      desc: "Tambahkan Flexbox, judul, paragraf, tombol, gambar, atau video YouTube dari dock toolbar bawah langsung ke dalam kanvas.",
      popular: false
    },
    {
      step: "Langkah 02",
      title: "Kustomisasi Gaya Visual",
      desc: "Sesuaikan warna, ukuran font, perataan teks, jarak antar elemen, dan URL tujuan melalui panel inspektor di sisi kanan.",
      popular: true
    },
    {
      step: "Langkah 03",
      title: "Publikasikan Seketika",
      desc: "Klik tombol Publikasikan untuk menghasilkan kode HTML bersih dan menampilkannya langsung di halaman publik situs Anda.",
      popular: false
    }
  ];
</script>

<!-- Features Section -->
<section id="fitur" class="bg-white py-16 sm:py-24">
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-2xl text-center">
      <span class="text-xs font-bold tracking-widest text-[#0d99ff] uppercase">Fitur Studio</span>
      <h2 class="mt-2 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
        Satu Studio untuk Seluruh Kebutuhan Website
      </h2>
      <p class="mt-3 text-lg text-gray-600">
        Dirancang agar kreator, pengembang, dan tim konten dapat membangun halaman web modern dengan
        cepat.
      </p>
    </div>

    <div class="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {#each features as feat (feat.title)}
        <div
          class="rounded-2xl border border-gray-200 bg-white p-7 transition-colors hover:border-sky-300"
        >
          <div
            class="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-sky-50 text-[#0d99ff]"
          >
            <Icon icon={feat.icon} class="h-6 w-6" />
          </div>
          <h3 class="mb-2 text-lg font-bold text-gray-900">{feat.title}</h3>
          <p class="text-sm leading-relaxed text-gray-600">{feat.desc}</p>
        </div>
      {/each}
    </div>
  </div>
</section>

<!-- Workflow Steps Section -->
<section id="cara-kerja" class="border-y border-gray-200 bg-gray-50 py-16 sm:py-24">
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div class="mx-auto max-w-2xl text-center">
      <span class="text-xs font-bold tracking-widest text-[#0d99ff] uppercase">Alur Kerja</span>
      <h2 class="mt-2 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
        Cara Membangun Halaman di Nawra CMS
      </h2>
      <p class="mt-3 text-lg text-gray-600">
        Tiga langkah sederhana dari kanvas desain visual hingga halaman aktif di jaringan edge.
      </p>
    </div>

    <div class="mt-12 grid grid-cols-1 items-stretch gap-6 md:grid-cols-3">
      {#each steps as item (item.title)}
        <div
          class="relative flex flex-col rounded-2xl bg-white p-7 transition-colors {item.popular
            ? 'border-2 border-[#0d99ff]'
            : 'border border-gray-200 hover:border-gray-300'}"
        >
          {#if item.popular}
            <span
              class="absolute -top-3.5 left-7 rounded-full bg-[#0d99ff] px-3.5 py-1 text-xs font-bold tracking-wide text-white uppercase"
            >
              Paling Fleksibel
            </span>
          {/if}
          <span class="text-xs font-bold tracking-wider text-[#0d99ff] uppercase">{item.step}</span>
          <h3 class="mt-2 text-xl font-bold text-gray-900">{item.title}</h3>
          <p class="mt-3 flex-1 text-sm leading-relaxed text-gray-600">{item.desc}</p>
          <div class="mt-8 border-t border-gray-100 pt-5">
            <a
              href={resolve("/editor")}
              class="inline-flex w-full items-center justify-center rounded-xl py-3 text-sm font-semibold transition-colors {item.popular
                ? 'bg-[#0d99ff] text-white hover:bg-[#008ae6]'
                : 'border border-gray-200 bg-white text-gray-800 hover:bg-gray-50'}"
            >
              Coba di Editor →
            </a>
          </div>
        </div>
      {/each}
    </div>
  </div>
</section>
