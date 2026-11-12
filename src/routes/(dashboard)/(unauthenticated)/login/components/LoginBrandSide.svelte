<script lang="ts">
  import Icon from "@iconify/svelte";

  let {
    title = "Nawra CMS",
    favicon = "/favicon.svg"
  }: {
    title?: string;
    favicon?: string;
  } = $props();
</script>

<aside
  class="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-[#0d99ff] p-12 text-white lg:flex xl:w-[52%] xl:p-14"
>
  <div class="relative z-10 flex h-full flex-col justify-between">
    <!-- Logo Top -->
    <div class="flex items-center gap-3">
      <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-white p-1">
        <img src={favicon} alt={title} class="h-full w-full rounded-lg object-contain" />
      </div>
      <div class="flex items-center gap-2">
        <span class="text-xl font-extrabold tracking-tight">{title}</span>
        <span
          class="rounded bg-white/20 px-1.5 py-0.5 text-[10px] font-semibold tracking-wider uppercase"
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
            <Icon icon="lucide:sparkles" class="h-4 w-4" />
          </div>
          <span>
            <strong class="font-bold text-white">Visual Page Builder</strong> dengan kanvas drag & drop
            dan Flexbox Auto Layout.
          </span>
        </li>
        <li class="flex items-start gap-3.5 text-sm leading-relaxed text-white/90">
          <div
            class="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/20 text-white"
          >
            <Icon icon="lucide:file-text" class="h-4 w-4" />
          </div>
          <span>
            Kelola <strong class="font-bold text-white">Artikel, Kategori & Halaman</strong> dengan alur
            publikasi draf dan terbit.
          </span>
        </li>
        <li class="flex items-start gap-3.5 text-sm leading-relaxed text-white/90">
          <div
            class="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/20 text-white"
          >
            <Icon icon="lucide:layout-template" class="h-4 w-4" />
          </div>
          <span>
            Atur <strong class="font-bold text-white">Laman Utama, Header & Footer</strong> serta galeri
            media Cloudflare R2 secara terpusat.
          </span>
        </li>
      </ul>
    </div>

    <p class="border-t border-white/20 pt-4 text-xs text-white/80">
      {title} · Cloudflare Serverless Architecture
    </p>
  </div>
</aside>
