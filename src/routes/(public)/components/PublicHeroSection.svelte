<script lang="ts">
  import Icon from "@iconify/svelte";

  import { resolve } from "$app/paths";

  const stats = [
    { value: "100%", label: "Visual Tanpa Koding" },
    { value: "3 Mode", label: "Responsif Desktop, Tablet & Mobile" },
    { value: "< 50ms", label: "Render Cepat di Cloudflare Edge" },
    { value: "Real-Time", label: "Tersimpan Otomatis di Cloudflare D1" }
  ];

  const highlights = ["Kanvas Visual Interaktif", "Auto-Layout Flexbox", "Cloudflare Workers & D1"];
</script>

<!-- Top Announcement Banner -->
<div
  class="border-b border-blue-200 bg-blue-50 px-4 py-3 text-center text-sm font-medium text-gray-800"
>
  <div class="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-2">
    <span
      >Eksplorasi ruang kerja visual tanpa perlu daftar atau login — langsung coba dari browser
      Anda.</span
    >
    <a href={resolve("/editor")} class="font-bold text-[#2563eb] hover:underline">
      Coba Editor Sekarang →
    </a>
  </div>
</div>

<!-- Hero 2-Column Section (Teman Dengar Style) -->
<section class="border-b border-gray-100 bg-white py-14 sm:py-20 lg:py-24">
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div class="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
      <div class="lg:col-span-7">
        <span
          class="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-bold tracking-wider text-blue-700 uppercase"
        >
          <Icon icon="lucide:sparkles" class="h-3.5 w-3.5" />
          Visual No-Code CMS Studio
        </span>

        <h1
          class="mb-5 text-4xl leading-tight font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl"
        >
          Bangun & Kelola Website Visual Tanpa Koding
        </h1>

        <p class="mb-8 max-w-2xl text-lg leading-relaxed text-gray-600 sm:text-xl">
          Rancang tata letak header, beranda, dan footer secara langsung di atas kanvas interaktif.
          Atur Flexbox, warna, tipografi, gambar, dan video YouTube lalu terbitkan ke Cloudflare
          Edge.
        </p>

        <div class="flex flex-wrap items-center gap-3.5">
          <a
            href={resolve("/editor")}
            class="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2563eb] px-6 py-3.5 text-base font-semibold text-white transition-colors hover:bg-[#1d4ed8]"
          >
            <span>Coba Editor Sekarang</span>
            <Icon icon="lucide:arrow-right" class="h-4 w-4" />
          </a>

          <a
            href="#fitur"
            class="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-6 py-3.5 text-base font-semibold text-gray-700 transition-colors hover:border-gray-300 hover:bg-gray-50"
          >
            Lihat Fitur Studio
          </a>
        </div>

        <div class="mt-10 flex flex-wrap items-center gap-6 text-sm font-semibold text-gray-600">
          {#each highlights as item (item)}
            <span class="inline-flex items-center gap-2">
              <Icon icon="lucide:check-circle-2" class="h-4 w-4 text-[#2563eb]" />
              {item}
            </span>
          {/each}
        </div>
      </div>

      <div class="relative flex justify-center lg:col-span-5">
        <a href={resolve("/editor")} class="block w-full">
          <img
            src="/editor-preview.svg"
            alt="Pratinjau Studio Kanvas Nawra CMS"
            class="w-full rounded-2xl border border-gray-200 object-cover transition-transform hover:scale-[1.01]"
          />
        </a>
      </div>
    </div>
  </div>
</section>

<!-- Stats Strip -->
<section class="border-y border-gray-200 bg-white">
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div class="grid grid-cols-2 divide-y divide-gray-200 lg:grid-cols-4 lg:divide-x lg:divide-y-0">
      {#each stats as stat (stat.label)}
        <div class="px-4 py-8 text-center">
          <div class="text-3xl font-extrabold tracking-tight text-[#2563eb] sm:text-4xl">
            {stat.value}
          </div>
          <div class="mt-2 text-sm font-medium text-gray-600">{stat.label}</div>
        </div>
      {/each}
    </div>
  </div>
</section>
