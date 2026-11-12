<script lang="ts">
  import Icon from "@iconify/svelte";

  import { resolve } from "$app/paths";

  let { cfCountry }: { cfCountry?: string } = $props();
</script>

<header
  class="sticky top-0 z-40 flex h-18 w-full items-center justify-center border-b border-gray-200 bg-white/90 backdrop-blur-md"
>
  <div class="flex w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
    <a
      href={resolve("/(public)")}
      class="flex items-center gap-2.5 font-bold tracking-tight text-gray-900"
    >
      <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0d99ff] text-white">
        <Icon icon="lucide:sparkles" class="h-5 w-5" />
      </div>
      <span class="text-lg font-bold text-gray-900">Nawra CMS</span>
    </a>

    <nav class="hidden items-center gap-7 text-sm font-medium text-gray-600 md:flex">
      <a href={resolve("/(public)")} class="font-semibold text-[#0d99ff]">Beranda</a>
      <a href="#fitur" class="transition-colors hover:text-[#0d99ff]">Fitur Studio</a>
      <a href="#cara-kerja" class="transition-colors hover:text-[#0d99ff]">Cara Kerja</a>
      <a href={resolve("/editor")} class="transition-colors hover:text-[#0d99ff]">Live Editor</a>
    </nav>

    <div class="flex items-center gap-2.5">
      {#if cfCountry}
        <div
          class="hidden items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs text-gray-600 lg:flex"
        >
          <span class="inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
          <span>Edge ({cfCountry})</span>
        </div>
      {/if}

      <a
        href={resolve("/editor")}
        class="inline-flex items-center gap-1.5 rounded-xl bg-[#0d99ff] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#008ae6] sm:text-sm"
      >
        <span>Coba Editor</span>
      </a>
    </div>
  </div>
</header>
