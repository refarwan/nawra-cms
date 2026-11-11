<script lang="ts">
  import Icon from "@iconify/svelte";

  import { resolve } from "$app/paths";
</script>

<div class="flex flex-col items-center text-center">
  <!-- Pill Badge -->
  <div
    class="mb-6 inline-flex items-center gap-2 rounded-full border border-neutral-700/80 bg-neutral-800/40 px-3.5 py-1.5 text-xs text-neutral-300 backdrop-blur"
  >
    <span
      class="rounded-full bg-linear-to-r from-[#0d99ff] to-[#9747ff] px-2 py-0.5 text-[10px] font-bold tracking-wider text-white uppercase"
    >
      Visual Studio
    </span>
    <span>CMS Visual Tanpa Koding • Deploy Seketika di Edge</span>
  </div>

  <!-- Main Title -->
  <h1 class="max-w-4xl text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
    Bangun & publikasikan konten web
    <span
      class="bg-linear-to-r from-[#0d99ff] via-[#a855f7] to-[#ec4899] bg-clip-text text-transparent"
    >
      layaknya menggambar di kanvas
    </span>
  </h1>

  <!-- Subtitle -->
  <p class="mt-6 max-w-2xl text-base text-neutral-400 sm:text-lg">
    Nawra CMS menghadirkan ruang kerja visual murni: kanvas bebas, panel layer intuitif, kontrol
    trackpad 2 jari, dan inspektor gaya instan tanpa perlu menulis satu baris kode pun.
  </p>

  <!-- Primary Actions -->
  <div class="mt-8 flex flex-wrap items-center justify-center gap-4">
    <a
      href={resolve("/editor")}
      class="group flex items-center gap-3 rounded-xl bg-linear-to-r from-[#0d99ff] to-[#0070d2] px-6 py-3.5 text-sm font-semibold text-white transition-all hover:brightness-110 active:scale-95"
    >
      <Icon icon="lucide:sparkles" class="h-4 w-4" />
      <span>Buka Editor Sekarang</span>
      <Icon
        icon="lucide:arrow-right"
        class="h-4 w-4 transition-transform group-hover:translate-x-1"
      />
    </a>

    <a
      href="#features"
      class="flex items-center gap-2 rounded-xl border border-neutral-800 bg-neutral-900/60 px-5 py-3.5 text-sm font-medium text-neutral-300 backdrop-blur transition hover:bg-neutral-800 hover:text-white"
    >
      <span>Jelajahi Fitur</span>
    </a>
  </div>
</div>
