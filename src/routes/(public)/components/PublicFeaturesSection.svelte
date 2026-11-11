<script lang="ts">
  import Icon from "@iconify/svelte";
</script>

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
        Klik, drag, dan resize elemen secara instan di kanvas tanpa terikat hirarki HTML yang kaku.
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
        Navigasi kanvas natural dengan gesture 2 jari untuk zoom halus serta tombol Space untuk hand
        tool pan.
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
        Ubah artboard ke ukuran Desktop, Tablet, atau Mobile hanya dengan satu klik untuk memastikan
        tata letak sempurna.
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
        Konfigurasi warna latar, border radius, bayangan, tipografi, dan opasitas tanpa perlu kode
        CSS manual.
      </p>
    </div>

    <!-- Feature 6 -->
    <div class="rounded-xl border border-neutral-800/80 bg-neutral-900/40 p-6 backdrop-blur">
      <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-500/10 text-sky-400">
        <Icon icon="lucide:zap" class="h-5 w-5" />
      </div>
      <h3 class="mt-4 text-base font-semibold text-white">Cloudflare Edge & D1</h3>
      <p class="mt-2 text-xs leading-relaxed text-neutral-400">
        Waktu respon kilat dengan performa SSR di jaringan Cloudflare Workers global dan database D1
        serverless.
      </p>
    </div>
  </div>
</section>
