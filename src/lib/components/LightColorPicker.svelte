<script lang="ts">
  import { parseHex } from "#lib/components/editor/color-converters";
  import ColorBoard from "#lib/components/editor/ColorBoard.svelte";

  const PRESET_COLORS = [
    "#0d99ff",
    "#0284c7",
    "#2563eb",
    "#4f46e5",
    "#7c3aed",
    "#059669",
    "#d97706",
    "#dc2626",
    "#171717"
  ];

  interface Props {
    id?: string;
    name?: string;
    label?: string;
    value?: string;
    isError?: boolean;
    supporting?: string;
    placeholder?: string;
  }

  let {
    id = "color-picker",
    name = "blogAccentColor",
    label = "Warna Aksen",
    value = $bindable("#0d99ff"),
    isError = false,
    supporting = "",
    placeholder = "#0d99ff"
  }: Props = $props();

  let open = $state(false);
  let containerEl: HTMLDivElement | undefined = $state();

  const validColor = $derived(parseHex(value) ?? "#0d99ff");

  function handleWindowClick(e: MouseEvent) {
    if (!open || !containerEl) return;
    if (!containerEl.contains(e.target as Node)) {
      open = false;
    }
  }

  function handleWindowKeydown(e: KeyboardEvent) {
    if (open && e.key === "Escape") {
      open = false;
    }
  }

  function handleInputBlur() {
    const parsed = parseHex(value);
    if (parsed) {
      value = parsed.toLowerCase();
    }
  }
</script>

<svelte:window onclick={handleWindowClick} onkeydown={handleWindowKeydown} />

<div bind:this={containerEl} class="relative flex flex-col gap-1.5">
  {#if label}
    <label for={id} class="block text-xs font-semibold text-gray-700">{label}</label>
  {/if}

  <div class="flex items-center gap-2">
    <button
      type="button"
      onclick={() => (open = !open)}
      aria-label="Buka pemilih warna"
      aria-expanded={open}
      class="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-xl border bg-white transition-colors {isError
        ? 'border-red-600'
        : 'border-gray-200 hover:border-gray-300'}"
    >
      <span class="h-6 w-6 rounded-lg border border-black/10" style:background-color={validColor}
      ></span>
    </button>

    <input
      {id}
      {name}
      type="text"
      bind:value
      onblur={handleInputBlur}
      {placeholder}
      aria-invalid={isError}
      class="h-11 w-full rounded-xl border bg-white px-3.5 font-mono text-sm leading-relaxed text-gray-900 transition-all placeholder:text-gray-400 focus:outline-none {isError
        ? 'border-red-600 focus:border-red-600 focus:ring-1 focus:ring-red-600'
        : 'border-gray-200 focus:border-[#0d99ff] focus:ring-1 focus:ring-[#0d99ff]'}"
    />
  </div>

  {#if supporting}
    <p class="text-[11px] {isError ? 'text-red-600' : 'text-gray-500'}">
      {supporting}
    </p>
  {/if}

  {#if open}
    <div
      class="absolute top-full left-0 z-30 mt-2 w-64 rounded-2xl border border-gray-200 bg-white p-3"
    >
      <ColorBoard bind:value onchange={(color) => (value = color.toLowerCase())} />

      <div class="mt-3 border-t border-gray-100 pt-2.5">
        <p class="mb-2 text-[11px] font-semibold text-gray-500">Warna Cepat</p>
        <div class="flex flex-wrap gap-1.5">
          {#each PRESET_COLORS as preset (preset)}
            <button
              type="button"
              onclick={() => {
                value = preset;
              }}
              aria-label="Pilih warna {preset}"
              class="h-5 w-5 cursor-pointer rounded-md border transition-transform hover:scale-110 {validColor.toLowerCase() ===
              preset
                ? 'border-gray-900 ring-1 ring-gray-900'
                : 'border-black/10'}"
              style:background-color={preset}
            ></button>
          {/each}
        </div>
      </div>
    </div>
  {/if}
</div>
