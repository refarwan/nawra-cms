<script lang="ts">
  import Icon from "@iconify/svelte";

  let {
    label = "",
    placeholder = "Cari icon (contoh: star, heart, bell)...",
    selectedIcon = "",
    prefix = "",
    onSelect
  }: {
    label?: string;
    placeholder?: string;
    selectedIcon: string;
    prefix?: string;
    onSelect: (icon: string) => void;
  } = $props();

  let query = $state("");
  let results = $state<string[]>([]);
  let loading = $state(false);
  let isOpen = $state(false);
  let containerRef = $state<HTMLDivElement | null>(null);
  let debounceTimeout: ReturnType<typeof setTimeout> | undefined;

  function iconLabel(icon: string): string {
    const name = icon.split(":")[1] ?? icon;
    return name.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
  }

  async function search(q: string) {
    const trimmed = q.trim();
    if (!trimmed) {
      results = [];
      loading = false;
      return;
    }

    loading = true;
    try {
      const prefixParam = prefix ? `&prefix=${encodeURIComponent(prefix)}` : "";
      const url = `https://api.iconify.design/search?query=${encodeURIComponent(trimmed)}${prefixParam}&limit=36`;
      const res = await fetch(url);
      const data = (await res.json()) as { icons?: string[] };
      results = Array.isArray(data.icons) ? data.icons : [];
    } catch {
      results = [];
    } finally {
      loading = false;
    }
  }

  function handleInput(e: Event) {
    query = (e.target as HTMLInputElement).value;
    isOpen = true;
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => search(query), 300);
  }

  function handleSelect(icon: string) {
    onSelect(icon);
    query = "";
    results = [];
    isOpen = false;
  }

  $effect(() => {
    if (!isOpen) return;
    function handleClickOutside(event: MouseEvent) {
      if (containerRef && !containerRef.contains(event.target as Node)) {
        isOpen = false;
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  });
</script>

<div class="relative space-y-1.5" bind:this={containerRef}>
  {#if label}
    <span class="block text-[10px] text-neutral-400">{label}</span>
  {/if}

  <div class="relative flex items-center">
    <div
      class="pointer-events-none absolute left-2.5 flex h-4 w-4 items-center justify-center text-neutral-400"
    >
      {#if selectedIcon}
        <Icon icon={selectedIcon} class="h-3.5 w-3.5 text-[#0d99ff]" />
      {:else}
        <Icon icon="lucide:search" class="h-3.5 w-3.5" />
      {/if}
    </div>

    <input
      type="text"
      value={query}
      oninput={handleInput}
      onfocus={() => {
        if (query.trim()) isOpen = true;
      }}
      placeholder={selectedIcon ? `Terpilih: ${selectedIcon}` : placeholder}
      class="h-8 w-full rounded border border-[#333] bg-[#252525] pr-3 pl-8 text-xs text-white placeholder:text-neutral-500 focus:border-[#0d99ff] focus:outline-none"
    />
  </div>

  {#if isOpen && query.trim()}
    <div
      class="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-[#333338] bg-[#1c1c1f] p-2 text-xs text-white select-none"
    >
      {#if loading}
        <div class="flex items-center justify-center gap-2 py-4 text-xs text-neutral-400">
          <Icon icon="lucide:loader-2" class="h-4 w-4 animate-spin text-[#0d99ff]" />
          <span>Mencari icon...</span>
        </div>
      {:else if results.length === 0}
        <div class="py-4 text-center text-xs text-neutral-400">Tidak ada icon ditemukan</div>
      {:else}
        <div class="grid grid-cols-2 gap-1 sm:grid-cols-3">
          {#each results as icon (icon)}
            <button
              type="button"
              onclick={() => handleSelect(icon)}
              class="flex cursor-pointer items-center gap-1.5 rounded-md p-1.5 text-left text-xs text-neutral-300 transition hover:bg-[#2c2c30] hover:text-white"
              title={icon}
            >
              <Icon {icon} class="h-4 w-4 shrink-0 text-[#0d99ff]" />
              <span class="truncate">{iconLabel(icon)}</span>
            </button>
          {/each}
        </div>
      {/if}
    </div>
  {/if}
</div>
