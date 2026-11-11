<script lang="ts">
  import Icon from "@iconify/svelte";

  import { resolve } from "$app/paths";

  let { cfCountry }: { cfCountry?: string } = $props();
</script>

<header
  class="relative z-20 flex h-16 w-full items-center justify-between border-b border-gray-200 bg-white px-6 lg:px-12"
>
  <div class="flex items-center gap-3">
    <div
      class="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-tr from-[#0d99ff] via-[#9747ff] to-[#ff4785] p-1.5"
    >
      <Icon icon="lucide:sparkles" class="h-4 w-4 text-white" />
    </div>
    <div class="flex flex-col">
      <div class="flex items-center gap-2">
        <span class="text-sm font-bold tracking-tight text-gray-900">Nawra CMS</span>
        <span
          class="rounded-full border border-gray-200 bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-500"
        >
          No-Code Studio
        </span>
      </div>
    </div>
  </div>

  <div class="flex items-center gap-4">
    {#if cfCountry}
      <div
        class="hidden items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs text-gray-600 sm:flex"
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
      class="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-100 hover:text-gray-900"
    >
      <Icon icon="lucide:layout-dashboard" class="h-3.5 w-3.5" />
      <span>Dashboard</span>
    </a>

    <a
      href={resolve("/editor")}
      class="flex items-center gap-2 rounded-lg bg-[#0d99ff] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#0082df] active:scale-95"
    >
      <Icon icon="lucide:pen-tool" class="h-3.5 w-3.5" />
      <span>Buka Editor</span>
    </a>
  </div>
</header>
