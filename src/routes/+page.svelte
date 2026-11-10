<script lang="ts">
  import Icon from "@iconify/svelte";

  import { resolve } from "$app/paths";

  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();
</script>

<svelte:head>
  <title>Nawra CMS — Visual No-Code Canvas Studio</title>
</svelte:head>

<div class="min-h-screen bg-[#0e0e10] text-neutral-100 selection:bg-[#0d99ff] selection:text-white">
  <!-- Ambient Background Glow -->
  <div class="pointer-events-none fixed inset-0 overflow-hidden">
    <div
      class="absolute -top-40 left-1/2 h-125 w-200 -translate-x-1/2 rounded-full bg-linear-to-tr from-[#0d99ff]/15 via-[#9747ff]/15 to-transparent blur-[120px]"
    ></div>
    <div
      class="absolute top-1/2 -right-40 h-100 w-150 rounded-full bg-[#ff4785]/10 blur-[130px]"
    ></div>
  </div>

  <!-- Top Navigation Bar -->
  <header
    class="relative z-20 flex h-16 w-full items-center justify-between border-b border-neutral-800/80 bg-[#141416]/80 px-6 backdrop-blur-md lg:px-12"
  >
    <div class="flex items-center gap-3">
      <div
        class="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-tr from-[#0d99ff] via-[#9747ff] to-[#ff4785] p-1.5 shadow-lg shadow-[#0d99ff]/20"
      >
        <Icon icon="lucide:sparkles" class="h-4 w-4 text-white" />
      </div>
      <div class="flex flex-col">
        <div class="flex items-center gap-2">
          <span class="text-sm font-bold tracking-tight text-white">Nawra CMS</span>
          <span
            class="rounded-full border border-neutral-700 bg-neutral-800/60 px-2 py-0.5 text-[10px] font-medium text-neutral-400"
          >
            No-Code Studio
          </span>
        </div>
      </div>
    </div>

    <div class="flex items-center gap-4">
      <div
        class="hidden items-center gap-2 rounded-full border border-neutral-800 bg-neutral-900/60 px-3 py-1 text-xs text-neutral-400 sm:flex"
      >
        <span class="relative flex h-2 w-2">
          <span
            class="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"
          ></span>
          <span class="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
        </span>
        <span>Cloudflare Edge ({data.cfCountry})</span>
      </div>

      <a
        href={resolve("/editor")}
        class="group flex items-center gap-2 rounded-lg bg-[#0d99ff] px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-[#0d99ff]/25 transition-all hover:bg-[#0082df] hover:shadow-[#0d99ff]/40 active:scale-95"
      >
        <span>Buka Editor</span>
        <Icon
          icon="lucide:arrow-right"
          class="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
        />
      </a>
    </div>
  </header>

  <!-- Hero Section -->
  <main class="relative z-10 mx-auto max-w-6xl px-6 pt-16 pb-24 lg:px-12">
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
      <h1
        class="max-w-4xl text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl"
      >
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
          class="group flex items-center gap-3 rounded-xl bg-linear-to-r from-[#0d99ff] to-[#0070d2] px-6 py-3.5 text-sm font-semibold text-white shadow-xl shadow-[#0d99ff]/30 transition-all hover:brightness-110 active:scale-95"
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

    <!-- Interactive Editor Mockup Preview -->
    <div
      class="mt-14 overflow-hidden rounded-2xl border border-neutral-800/80 bg-[#161619] shadow-2xl"
    >
      <!-- Mockup Title Bar -->
      <div
        class="flex h-10 items-center justify-between border-b border-neutral-800 bg-[#1b1b1e] px-4"
      >
        <div class="flex items-center gap-2">
          <div class="h-3 w-3 rounded-full bg-[#ff5f56]"></div>
          <div class="h-3 w-3 rounded-full bg-[#ffbd2e]"></div>
          <div class="h-3 w-3 rounded-full bg-[#27c93f]"></div>
          <span class="ml-3 font-mono text-[11px] text-neutral-400">nawra-cms.studio / editor</span>
        </div>
        <div class="flex items-center gap-2">
          <a
            href={resolve("/editor")}
            class="flex items-center gap-1.5 rounded bg-[#0d99ff]/15 px-2.5 py-1 text-[11px] font-medium text-[#0d99ff] transition hover:bg-[#0d99ff]/25"
          >
            <span>Buka Langsung</span>
            <Icon icon="lucide:arrow-right" class="h-3 w-3" />
          </a>
        </div>
      </div>

      <!-- Mockup Workspace Canvas Preview -->
      <div class="relative flex h-95 w-full overflow-hidden bg-[#141414]">
        <!-- Left Mockup Layers -->
        <div class="hidden w-56 border-r border-neutral-800 bg-[#1a1a1c] p-3 md:block">
          <div
            class="flex items-center justify-between pb-2 text-[11px] font-semibold text-neutral-400"
          >
            <span class="flex items-center gap-1.5">
              <Icon icon="lucide:layers" class="h-3.5 w-3.5 text-[#0d99ff]" />
              LAYERS (5)
            </span>
          </div>
          <div class="mt-2 space-y-1">
            <div
              class="flex items-center justify-between rounded bg-[#0d99ff]/20 px-2.5 py-1.5 text-xs font-medium text-[#0d99ff]"
            >
              <span>Badge Solusi</span>
              <span class="text-[10px] opacity-70">badge</span>
            </div>
            <div
              class="flex items-center justify-between rounded px-2.5 py-1.5 text-xs text-neutral-400"
            >
              <span>Judul Utama</span>
              <span class="text-[10px] opacity-70">heading</span>
            </div>
            <div
              class="flex items-center justify-between rounded px-2.5 py-1.5 text-xs text-neutral-400"
            >
              <span>Deskripsi Singkat</span>
              <span class="text-[10px] opacity-70">text</span>
            </div>
            <div
              class="flex items-center justify-between rounded px-2.5 py-1.5 text-xs text-neutral-400"
            >
              <span>Tombol CTA</span>
              <span class="text-[10px] opacity-70">button</span>
            </div>
          </div>
        </div>

        <!-- Canvas Artboard Display -->
        <div
          class="relative flex flex-1 items-center justify-center p-6"
          style="background-image: radial-gradient(#2d2d2d 1px, transparent 1px); background-size: 16px 16px;"
        >
          <div
            class="relative flex h-75 w-full max-w-lg flex-col justify-center rounded-xl border border-neutral-800 bg-neutral-900/90 p-8 shadow-2xl backdrop-blur"
          >
            <span
              class="w-fit rounded-full bg-[#0d99ff]/10 px-3 py-1 text-[11px] font-semibold text-[#0d99ff]"
            >
              ✦ Nawra No-Code Builder
            </span>
            <h3 class="mt-3 text-2xl font-bold text-white">Visual Design System</h3>
            <p class="mt-2 text-xs leading-relaxed text-neutral-400">
              Atur tata letak, warna, tipografi, dan elemen visual secara interaktif dengan sistem
              layer yang fleksibel tanpa batasan struktur koding.
            </p>
            <div class="mt-6 flex items-center gap-3">
              <a
                href={resolve("/editor")}
                class="rounded-lg bg-[#0d99ff] px-4 py-2 text-xs font-semibold text-white shadow transition hover:brightness-110"
              >
                Coba Sekarang
              </a>
              <span class="text-xs text-neutral-500">Trackpad 2 Jari didukung</span>
            </div>
          </div>
        </div>

        <!-- Right Mockup Inspector -->
        <div class="hidden w-56 border-l border-neutral-800 bg-[#1a1a1c] p-3 lg:block">
          <div class="text-[11px] font-semibold text-neutral-400">INSPEKTOR GAYA</div>
          <div class="mt-3 space-y-3">
            <div class="rounded border border-neutral-800 bg-neutral-900/50 p-2">
              <div class="text-[10px] text-neutral-400">Posisi & Ukuran</div>
              <div class="mt-1 flex gap-2 font-mono text-[11px] text-neutral-300">
                <span>W: 520</span>
                <span>H: 300</span>
              </div>
            </div>
            <div class="rounded border border-neutral-800 bg-neutral-900/50 p-2">
              <div class="text-[10px] text-neutral-400">Warna Latar</div>
              <div class="mt-1.5 flex items-center gap-2">
                <div class="h-4 w-4 rounded bg-[#0d99ff]"></div>
                <span class="font-mono text-[11px] text-neutral-300">#0D99FF</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Feature Grid Section -->
    <section id="features" class="mt-24">
      <div class="text-center">
        <h2 class="text-2xl font-bold text-white sm:text-3xl">Fitur Utama Nawra Studio</h2>
        <p class="mt-2 text-sm text-neutral-400">
          Dirancang untuk memberikan kebebasan desain maksimal bagi kreator konten dan pembuat web.
        </p>
      </div>

      <div class="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <!-- Feature 1 -->
        <div class="rounded-xl border border-neutral-800/80 bg-neutral-900/40 p-6 backdrop-blur">
          <div
            class="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0d99ff]/10 text-[#0d99ff]"
          >
            <Icon icon="lucide:mouse-pointer" class="h-5 w-5" />
          </div>
          <h3 class="mt-4 text-base font-semibold text-white">Kanvas Desain Bebas</h3>
          <p class="mt-2 text-xs leading-relaxed text-neutral-400">
            Klik, drag, dan resize elemen secara instan di kanvas tanpa terikat hirarki HTML yang
            kaku.
          </p>
        </div>

        <!-- Feature 2 -->
        <div class="rounded-xl border border-neutral-800/80 bg-neutral-900/40 p-6 backdrop-blur">
          <div
            class="flex h-10 w-10 items-center justify-center rounded-lg bg-[#9747ff]/10 text-[#9747ff]"
          >
            <Icon icon="lucide:move" class="h-5 w-5" />
          </div>
          <h3 class="mt-4 text-base font-semibold text-white">Trackpad Pan & Pinch Zoom</h3>
          <p class="mt-2 text-xs leading-relaxed text-neutral-400">
            Navigasi kanvas natural dengan gesture 2 jari untuk zoom halus serta tombol Space untuk
            hand tool pan.
          </p>
        </div>

        <!-- Feature 3 -->
        <div class="rounded-xl border border-neutral-800/80 bg-neutral-900/40 p-6 backdrop-blur">
          <div
            class="flex h-10 w-10 items-center justify-center rounded-lg bg-[#ff4785]/10 text-[#ff4785]"
          >
            <Icon icon="lucide:layers" class="h-5 w-5" />
          </div>
          <h3 class="mt-4 text-base font-semibold text-white">Manajemen Layer Murni</h3>
          <p class="mt-2 text-xs leading-relaxed text-neutral-400">
            Semua objek terorganisir dalam satu panel layer dengan kemampuan sembunyikan, kunci, dan
            atur z-order.
          </p>
        </div>

        <!-- Feature 4 -->
        <div class="rounded-xl border border-neutral-800/80 bg-neutral-900/40 p-6 backdrop-blur">
          <div
            class="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400"
          >
            <Icon icon="lucide:smartphone" class="h-5 w-5" />
          </div>
          <h3 class="mt-4 text-base font-semibold text-white">Mode Responsif Fleksibel</h3>
          <p class="mt-2 text-xs leading-relaxed text-neutral-400">
            Ubah artboard ke ukuran Desktop, Tablet, atau Mobile hanya dengan satu klik untuk
            memastikan tata letak sempurna.
          </p>
        </div>

        <!-- Feature 5 -->
        <div class="rounded-xl border border-neutral-800/80 bg-neutral-900/40 p-6 backdrop-blur">
          <div
            class="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400"
          >
            <Icon icon="lucide:sliders" class="h-5 w-5" />
          </div>
          <h3 class="mt-4 text-base font-semibold text-white">Inspektor Gaya Visual</h3>
          <p class="mt-2 text-xs leading-relaxed text-neutral-400">
            Konfigurasi warna latar, border radius, bayangan, tipografi, dan opasitas tanpa perlu
            kode CSS manual.
          </p>
        </div>

        <!-- Feature 6 -->
        <div class="rounded-xl border border-neutral-800/80 bg-neutral-900/40 p-6 backdrop-blur">
          <div
            class="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-500/10 text-sky-400"
          >
            <Icon icon="lucide:zap" class="h-5 w-5" />
          </div>
          <h3 class="mt-4 text-base font-semibold text-white">Cloudflare Edge & Bun</h3>
          <p class="mt-2 text-xs leading-relaxed text-neutral-400">
            Waktu respon kilat dengan performa SSR di jaringan Cloudflare Workers global dan
            kompilasi cepat Bun.
          </p>
        </div>
      </div>
    </section>

    <!-- Bottom Call-to-Action -->
    <div
      class="mt-24 rounded-2xl border border-neutral-800 bg-linear-to-b from-neutral-900/80 to-[#121215] p-8 text-center sm:p-12"
    >
      <h3 class="text-2xl font-bold text-white sm:text-3xl">Siap Mulai Mendesain?</h3>
      <p class="mx-auto mt-3 max-w-lg text-sm text-neutral-400">
        Buka editor kanvas sekarang dan bangun pengalaman web tanpa repot koding.
      </p>
      <div class="mt-6 flex justify-center">
        <a
          href={resolve("/editor")}
          class="flex items-center gap-2 rounded-xl bg-[#0d99ff] px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[#0d99ff]/30 transition hover:bg-[#0082df] active:scale-95"
        >
          <Icon icon="lucide:sparkles" class="h-4 w-4" />
          <span>Buka Editor Nawra CMS</span>
          <Icon icon="lucide:arrow-right" class="h-4 w-4" />
        </a>
      </div>
    </div>
  </main>

  <!-- Footer -->
  <footer
    class="border-t border-neutral-800/80 bg-[#111113] py-8 text-center text-xs text-neutral-500"
  >
    <div
      class="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 sm:flex-row lg:px-12"
    >
      <div class="flex items-center gap-2">
        <div class="h-4 w-4 rounded bg-linear-to-tr from-[#0d99ff] to-[#ff4785]"></div>
        <span class="font-medium text-neutral-400">Nawra CMS Visual Studio</span>
      </div>
      <div class="flex items-center gap-6">
        <a href={resolve("/editor")} class="text-neutral-400 transition hover:text-[#0d99ff]"
          >Buka Editor</a
        >
        <span>•</span>
        <span>Ditenagai Bun & Cloudflare Workers</span>
      </div>
    </div>
  </footer>
</div>
