<script lang="ts">
  import Icon from "@iconify/svelte";

  import { resolve } from "$app/paths";

  let { cfCountry }: { cfCountry?: string } = $props();
</script>

<header
  class="relative z-20 flex h-16 w-full items-center justify-between border-b border-neutral-800/80 bg-[#141416]/80 px-6 backdrop-blur-md lg:px-12"
>
  <div class="flex items-center gap-3">
    <div
      class="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-tr from-[#0d99ff] via-[#9747ff] to-[#ff4785] p-1.5"
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
    {#if cfCountry}
      <div
        class="hidden items-center gap-2 rounded-full border border-neutral-800 bg-neutral-900/60 px-3 py-1 text-xs text-neutral-400 sm:flex"
      >
        <span class="relative flex h-2 w-2">
          <span
            class="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"
          ></span>
          <span class="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
        </span>
        <span>Cloudflare Edge ({cfCountry})</span>
      </div>
    {/if}

    <a
      href={resolve("/(dashboard)/(authenticated)/dashboard")}
      class="flex items-center gap-1.5 rounded-lg border border-neutral-700 bg-neutral-800/80 px-3 py-2 text-xs font-semibold text-neutral-200 transition hover:bg-neutral-700 hover:text-white"
    >
      <Icon icon="lucide:layout-dashboard" class="h-3.5 w-3.5" />
      <span>Dashboard</span>
    </a>

    <a
      href={resolve("/editor")}
      class="group flex items-center gap-2 rounded-lg bg-[#0d99ff] px-4 py-2 text-xs font-semibold text-white transition-all hover:bg-[#0082df] active:scale-95"
    >
      <span>Buka Editor</span>
      <Icon
        icon="lucide:arrow-right"
        class="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
      />
    </a>
  </div>
</header>
