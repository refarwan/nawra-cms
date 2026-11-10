<script lang="ts">
  import Icon from "@iconify/svelte";

  import { parseHex } from "./color-converters";
  import ColorBoard from "./ColorBoard.svelte";

  let {
    value = "#ffffff",
    label = "Warna",
    allowTransparent = true,
    onChange
  }: {
    value: string;
    label?: string;
    allowTransparent?: boolean;
    onChange: (color: string) => void;
  } = $props();

  let isOpen = $state(false);
  let openUpwards = $state(false);
  let containerEl: HTMLElement | undefined = $state();

  const isTransparent = $derived(!value || value === "transparent" || value === "rgba(0, 0, 0, 0)");

  const presets = [
    { name: "Putih", hex: "#FFFFFF" },
    { name: "Hitam", hex: "#000000" },
    { name: "Biru", hex: "#0D99FF" },
    { name: "Ungu", hex: "#8B5CF6" },
    { name: "Hijau", hex: "#10B981" },
    { name: "Kuning", hex: "#F59E0B" },
    { name: "Merah", hex: "#EF4444" },
    { name: "Slate", hex: "#1E293B" }
  ];

  $effect(() => {
    if (!isOpen) return;

    if (containerEl) {
      const rect = containerEl.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      openUpwards = spaceBelow < 300 && rect.top > 300;
    }

    function handlePointerDown(e: PointerEvent) {
      if (containerEl && !containerEl.contains(e.target as Node)) {
        isOpen = false;
      }
    }

    window.addEventListener("pointerdown", handlePointerDown);
    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
    };
  });

  function handleSelectPreset(hex: string) {
    onChange(hex);
  }

  function handleSetTransparent() {
    onChange("transparent");
    isOpen = false;
  }
</script>

<div bind:this={containerEl} class="relative w-full">
  <!-- Trigger Bar -->
  <div
    class="flex items-center justify-between gap-2 rounded border border-[#333] bg-[#252525] p-1.5"
  >
    <div class="flex items-center gap-2">
      <!-- Swatch Button -->
      <button
        type="button"
        onclick={() => (isOpen = !isOpen)}
        class="relative flex h-6 w-6 cursor-pointer items-center justify-center rounded border border-white/20 transition hover:scale-105"
        style={isTransparent
          ? "background-image: repeating-conic-gradient(#333 0% 25%, #222 0% 50%); background-size: 8px 8px;"
          : `background-color: ${value};`}
        title="Klik untuk buka pemilih warna (Color Picker)"
      >
        {#if isTransparent}
          <div class="h-full w-0.5 rotate-45 rounded bg-red-500"></div>
        {/if}
      </button>

      <!-- Hex Input / Text -->
      <input
        type="text"
        value={isTransparent ? "transparent" : value}
        oninput={(e) => {
          const val = (e.target as HTMLInputElement).value;
          if (val.toLowerCase() === "transparent") {
            onChange("transparent");
          } else {
            const parsed = parseHex(val);
            if (parsed) onChange(parsed);
          }
        }}
        class="w-24 bg-transparent font-mono text-xs text-white focus:outline-none"
        placeholder="#000000"
      />
    </div>

    <!-- Quick Transparan Toggle / Indicator -->
    {#if allowTransparent}
      <button
        type="button"
        onclick={() => {
          if (isTransparent) {
            onChange("#FFFFFF");
          } else {
            onChange("transparent");
          }
        }}
        class="rounded px-1.5 py-0.5 text-[10px] font-medium transition {isTransparent
          ? 'bg-[#0d99ff]/20 text-[#0d99ff]'
          : 'text-neutral-400 hover:bg-[#333] hover:text-white'}"
        title="Ubah menjadi transparan"
      >
        {isTransparent ? "Transparan" : "Solid"}
      </button>
    {/if}
  </div>

  <!-- Popover Dialog Dropdown (Teman Dengar style) -->
  {#if isOpen}
    <div
      role="dialog"
      aria-label="Pemilih Warna"
      class="absolute {openUpwards
        ? 'bottom-full mb-1.5'
        : 'top-full mt-1.5'} right-0 z-50 w-64 rounded-xl border border-[#383838] bg-[#1e1e20] p-3 text-xs select-none"
    >
      <div class="mb-2 flex items-center justify-between border-b border-[#2c2c2c] pb-2">
        <span class="font-semibold text-white">{label}</span>
        <button
          type="button"
          onclick={() => (isOpen = false)}
          class="rounded p-1 text-neutral-400 hover:bg-[#2c2c2c] hover:text-white"
        >
          <Icon icon="lucide:x" class="h-3.5 w-3.5" />
        </button>
      </div>

      <!-- Color Board (Interactive Spectrum & Hue Slider) -->
      <ColorBoard
        value={isTransparent ? "#0D99FF" : value}
        onchange={(c) => {
          onChange(c);
        }}
      />

      <!-- Quick Preset Palettes -->
      <div class="mt-2.5 border-t border-[#2c2c2c] pt-2">
        <span class="mb-1.5 block text-[10px] text-neutral-400">Rekomendasi Warna</span>
        <div class="flex flex-wrap gap-1.5">
          {#if allowTransparent}
            <button
              type="button"
              onclick={handleSetTransparent}
              class="relative flex h-5 w-5 cursor-pointer items-center justify-center rounded border border-[#444] transition hover:scale-110"
              style="background-image: repeating-conic-gradient(#333 0% 25%, #222 0% 50%); background-size: 6px 6px;"
              title="Transparan"
            >
              <div class="h-full w-0.5 rotate-45 rounded bg-red-500"></div>
            </button>
          {/if}
          {#each presets as preset (preset.name)}
            <button
              type="button"
              onclick={() => handleSelectPreset(preset.hex)}
              class="h-5 w-5 cursor-pointer rounded border border-[#444] transition hover:scale-110"
              style={`background-color: ${preset.hex}`}
              title={preset.name}
            ></button>
          {/each}
        </div>
      </div>
    </div>
  {/if}
</div>
