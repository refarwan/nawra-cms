<script lang="ts">
  import Icon from "@iconify/svelte";
</script>

<aside
  class="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-[#0d99ff] p-12 text-white lg:flex xl:w-[52%] xl:p-14"
>
  <div class="relative z-10 flex h-full flex-col justify-between">
    <!-- Logo Top -->
    <div class="flex items-center gap-3">
      <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#0d99ff]">
        <Icon icon="lucide:layout-template" class="h-6 w-6" />
      </div>
      <div>
        <span class="text-xl font-extrabold tracking-tight">Nawra CMS</span>
        <span
          class="ml-2 rounded bg-white/20 px-1.5 py-0.5 text-[10px] font-semibold tracking-wider uppercase"
        >
          Edge D1
        </span>
      </div>
    </div>

    <!-- Value Propositions -->
    <div class="my-auto py-8">
      <h2 class="mb-6 text-2xl leading-snug font-extrabold tracking-tight text-white xl:text-3xl">
        CMS Visual Modern berbasis Cloudflare Workers & D1.
      </h2>
      <ul class="space-y-4">
        <li class="flex items-start gap-3.5 text-sm leading-relaxed text-white/90">
          <div
            class="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/20 text-white"
          >
            <Icon icon="lucide:heading" class="h-4 w-4" />
          </div>
          <span>
            Buat beragam <strong class="font-bold text-white">Header & Footer</strong> dan pilih mana
            yang aktif dengan 1 klik.
          </span>
        </li>
        <li class="flex items-start gap-3.5 text-sm leading-relaxed text-white/90">
          <div
            class="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/20 text-white"
          >
            <Icon icon="lucide:sparkles" class="h-4 w-4" />
          </div>
          <span>
            Visual drag & drop canvas dengan <strong class="font-bold text-white"
              >Flexbox Auto Layout</strong
            > mirip Figma.
          </span>
        </li>
        <li class="flex items-start gap-3.5 text-sm leading-relaxed text-white/90">
          <div
            class="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/20 text-white"
          >
            <Icon icon="lucide:zap" class="h-4 w-4" />
          </div>
          <span>
            Kinerja secepat kilat dengan <strong class="font-bold text-white"
              >Cloudflare Edge SQLite (D1)</strong
            >.
          </span>
        </li>
      </ul>
    </div>

    <p class="border-t border-white/20 pt-4 text-xs text-white/80">
      Nawra CMS Platform · Cloudflare Serverless Architecture
    </p>
  </div>
</aside>
