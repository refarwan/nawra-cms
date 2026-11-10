<script lang="ts">
  import Icon from "@iconify/svelte";

  import { handleNumberKeydown, sanitizeNumber } from "./number-input-utils";

  let {
    label = "Padding",
    top = 0,
    right = 0,
    bottom = 0,
    left = 0,
    onChangeAll,
    onChangeSide
  }: {
    label?: string;
    top: number;
    right: number;
    bottom: number;
    left: number;
    onChangeAll: (val: number) => void;
    onChangeSide: (side: "top" | "right" | "bottom" | "left", val: number) => void;
  } = $props();

  // Mode 4 sisi aktif jika salah satu sisi memiliki nilai berbeda atau user memilih toggle individual
  let isIndividual = $state(false);

  // Jika nilai awal sisi-sisinya berbeda, otomatis buka mode individual
  $effect(() => {
    if (top !== right || top !== bottom || top !== left) {
      isIndividual = true;
    }
  });

  function handleAllInput(e: Event) {
    const target = e.target as HTMLInputElement;
    target.value = target.value.replace(/\D/g, "");
    const val = sanitizeNumber(target.value);
    onChangeAll(val);
  }

  function handleSideInput(side: "top" | "right" | "bottom" | "left", e: Event) {
    const target = e.target as HTMLInputElement;
    target.value = target.value.replace(/\D/g, "");
    const val = sanitizeNumber(target.value);
    onChangeSide(side, val);
  }
</script>

<div class="space-y-1.5">
  <div class="flex items-center justify-between text-[11px]">
    <span class="text-neutral-400">{label}</span>
    <button
      type="button"
      onclick={() => (isIndividual = !isIndividual)}
      class="flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] transition {isIndividual
        ? 'bg-[#0d99ff]/20 text-[#0d99ff]'
        : 'text-neutral-400 hover:bg-[#2c2c2c] hover:text-white'}"
      title={isIndividual
        ? "Beralih ke satu nilai seragam"
        : "Atur terpisah (Atas, Kanan, Bawah, Kiri)"}
    >
      <Icon icon={isIndividual ? "lucide:shrink" : "lucide:expand"} class="h-3 w-3" />
      <span>{isIndividual ? "Gabung" : "4 Sisi"}</span>
    </button>
  </div>

  {#if !isIndividual}
    <!-- Single / Uniform Value -->
    <div
      class="flex items-center gap-2 rounded border border-[#333] bg-[#252525] px-2 py-1.5 text-xs"
    >
      <span class="text-[10px] text-neutral-500">Semua</span>
      <input
        type="text"
        inputmode="numeric"
        value={top}
        oninput={handleAllInput}
        onkeydown={(e) => handleNumberKeydown(e, top, onChangeAll, { min: 0 })}
        class="w-full bg-transparent text-right font-mono text-white focus:outline-none"
      />
      <span class="font-mono text-[11px] text-neutral-500">px</span>
    </div>
  {:else}
    <!-- 4 Individual Sides: Atas, Kanan, Bawah, Kiri -->
    <div class="grid grid-cols-2 gap-1.5 text-xs">
      <!-- Atas (Top) -->
      <div
        class="flex items-center gap-1.5 rounded border border-[#333] bg-[#252525] px-2 py-1"
        title="{label} Atas (Top)"
      >
        <span class="font-mono text-[10px] text-neutral-400">Atas</span>
        <input
          type="text"
          inputmode="numeric"
          value={top}
          oninput={(e) => handleSideInput("top", e)}
          onkeydown={(e) =>
            handleNumberKeydown(e, top, (val) => onChangeSide("top", val), { min: 0 })}
          class="w-full bg-transparent text-right font-mono text-white focus:outline-none"
        />
        <span class="text-[10px] text-neutral-500">px</span>
      </div>

      <!-- Kanan (Right) -->
      <div
        class="flex items-center gap-1.5 rounded border border-[#333] bg-[#252525] px-2 py-1"
        title="{label} Kanan (Right)"
      >
        <span class="font-mono text-[10px] text-neutral-400">Kanan</span>
        <input
          type="text"
          inputmode="numeric"
          value={right}
          oninput={(e) => handleSideInput("right", e)}
          onkeydown={(e) =>
            handleNumberKeydown(e, right, (val) => onChangeSide("right", val), { min: 0 })}
          class="w-full bg-transparent text-right font-mono text-white focus:outline-none"
        />
        <span class="text-[10px] text-neutral-500">px</span>
      </div>

      <!-- Bawah (Bottom) -->
      <div
        class="flex items-center gap-1.5 rounded border border-[#333] bg-[#252525] px-2 py-1"
        title="{label} Bawah (Bottom)"
      >
        <span class="font-mono text-[10px] text-neutral-400">Bawah</span>
        <input
          type="text"
          inputmode="numeric"
          value={bottom}
          oninput={(e) => handleSideInput("bottom", e)}
          onkeydown={(e) =>
            handleNumberKeydown(e, bottom, (val) => onChangeSide("bottom", val), { min: 0 })}
          class="w-full bg-transparent text-right font-mono text-white focus:outline-none"
        />
        <span class="text-[10px] text-neutral-500">px</span>
      </div>

      <!-- Kiri (Left) -->
      <div
        class="flex items-center gap-1.5 rounded border border-[#333] bg-[#252525] px-2 py-1"
        title="{label} Kiri (Left)"
      >
        <span class="font-mono text-[10px] text-neutral-400">Kiri</span>
        <input
          type="text"
          inputmode="numeric"
          value={left}
          oninput={(e) => handleSideInput("left", e)}
          onkeydown={(e) =>
            handleNumberKeydown(e, left, (val) => onChangeSide("left", val), { min: 0 })}
          class="w-full bg-transparent text-right font-mono text-white focus:outline-none"
        />
        <span class="text-[10px] text-neutral-500">px</span>
      </div>
    </div>
  {/if}
</div>
