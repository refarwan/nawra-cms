<script lang="ts">
  import { handleNumberKeydown, sanitizeNumber } from "./number-input-utils";

  import type { EditorState } from "./editor-state.svelte";
  import type { CanvasElement, SizingMode } from "./types";

  let { editor, el }: { editor: EditorState; el: CanvasElement } = $props();
</script>

<div>
  <div
    class="mb-2 flex items-center justify-between text-[11px] font-semibold tracking-wider text-neutral-400 uppercase"
  >
    <span>Posisi & Ukuran</span>
    {#if el.isDefault || el.id === "flexbox-default"}
      <span class="text-[10px] font-normal text-[#0d99ff] lowercase">(penuh di atas)</span>
    {:else if el.parentId}
      <span class="text-[10px] font-normal text-[#0d99ff] lowercase">(di dalam flexbox)</span>
    {/if}
  </div>

  {#if !el.parentId && !el.isDefault && el.id !== "flexbox-default"}
    <div class="mb-2 grid grid-cols-2 gap-2 text-xs">
      <div class="flex items-center gap-2 rounded border border-[#333] bg-[#252525] px-2 py-1.5">
        <span class="font-mono text-neutral-500">X</span>
        <input
          type="text"
          inputmode="numeric"
          value={el.x}
          oninput={(e) => {
            const target = e.target as HTMLInputElement;
            target.value = target.value.replace(/(?!^-)[^0-9]/g, "");
            editor.updateElement(el.id, { x: sanitizeNumber(target.value, true) });
          }}
          onkeydown={(e) =>
            handleNumberKeydown(e, el.x, (val) => editor.updateElement(el.id, { x: val }), {
              allowNegative: true
            })}
          class="w-full bg-transparent text-right font-mono text-white focus:outline-none"
        />
      </div>
      <div class="flex items-center gap-2 rounded border border-[#333] bg-[#252525] px-2 py-1.5">
        <span class="font-mono text-neutral-500">Y</span>
        <input
          type="text"
          inputmode="numeric"
          value={el.y}
          oninput={(e) => {
            const target = e.target as HTMLInputElement;
            target.value = target.value.replace(/(?!^-)[^0-9]/g, "");
            editor.updateElement(el.id, { y: sanitizeNumber(target.value, true) });
          }}
          onkeydown={(e) =>
            handleNumberKeydown(e, el.y, (val) => editor.updateElement(el.id, { y: val }), {
              allowNegative: true
            })}
          class="w-full bg-transparent text-right font-mono text-white focus:outline-none"
        />
      </div>
    </div>
  {/if}

  <!-- Pengaturan Lebar -->
  <div class="mb-2 space-y-1">
    <div class="flex items-center justify-between text-[11px]">
      <span class="text-neutral-400">Lebar (L)</span>
      {#if el.isDefault || el.id === "flexbox-default"}
        <span
          class="rounded border border-[#2d2d2d] bg-[#1a1a1a] px-1.5 py-0.5 text-[10px] text-[#0d99ff]"
        >
          Penuhi Kontainer
        </span>
      {:else}
        <select
          value={el.widthMode || "fixed"}
          onchange={(e) =>
            editor.updateElement(el.id, {
              widthMode: (e.target as HTMLSelectElement).value as SizingMode
            })}
          class="cursor-pointer rounded border border-[#333] bg-[#252525] px-1.5 py-0.5 text-[11px] text-neutral-200 focus:border-[#0d99ff] focus:outline-none"
        >
          <option value="fixed">Tetap</option>
          <option value="hug">Ikuti Konten</option>
          <option value="fill">Penuhi Kontainer</option>
        </select>
      {/if}
    </div>
    <div
      class="flex items-center gap-2 rounded border border-[#333] bg-[#252525] px-2 py-1.5 text-xs"
    >
      <span class="font-mono text-neutral-500">L</span>
      {#if el.isDefault || el.id === "flexbox-default"}
        <span class="w-full text-right font-mono text-neutral-400"
          >{editor.frame.width} px (Penuh Kanvas)</span
        >
      {:else if (el.widthMode || "fixed") === "fixed"}
        <input
          type="text"
          inputmode="numeric"
          value={el.width}
          oninput={(e) => {
            const target = e.target as HTMLInputElement;
            target.value = target.value.replace(/\D/g, "");
            editor.updateElement(el.id, { width: Math.max(10, sanitizeNumber(target.value)) });
          }}
          onkeydown={(e) =>
            handleNumberKeydown(e, el.width, (val) => editor.updateElement(el.id, { width: val }), {
              min: 10
            })}
          class="w-full bg-transparent text-right font-mono text-white focus:outline-none"
        />
        <span class="font-mono text-[11px] text-neutral-500">px</span>
      {:else if el.widthMode === "hug"}
        <span class="w-full text-right font-mono text-[11px] text-[#0d99ff]"
          >Ikuti Konten (Otomatis)</span
        >
      {:else if el.widthMode === "fill"}
        <span class="w-full text-right font-mono text-[11px] text-[#0d99ff]"
          >Penuhi Kontainer (100%)</span
        >
      {/if}
    </div>
  </div>

  <!-- Pengaturan Tinggi -->
  <div class="mb-2 space-y-1">
    <div class="flex items-center justify-between text-[11px]">
      <span class="text-neutral-400">Tinggi (T)</span>
      <select
        value={el.heightMode || "fixed"}
        onchange={(e) => {
          const mode = (e.target as HTMLSelectElement).value as SizingMode;
          editor.updateElement(el.id, { heightMode: mode });
          if ((el.isDefault || el.id === "flexbox-default") && mode === "fixed") {
            editor.frame.height = el.height;
          }
        }}
        class="cursor-pointer rounded border border-[#333] bg-[#252525] px-1.5 py-0.5 text-[11px] text-neutral-200 focus:border-[#0d99ff] focus:outline-none"
      >
        <option value="fixed">Tetap</option>
        <option value="hug">Ikuti Konten</option>
        {#if !el.isDefault && el.id !== "flexbox-default"}
          <option value="fill">Penuhi Kontainer</option>
        {/if}
      </select>
    </div>
    <div
      class="flex items-center gap-2 rounded border border-[#333] bg-[#252525] px-2 py-1.5 text-xs"
    >
      <span class="font-mono text-neutral-500">T</span>
      {#if (el.heightMode || "fixed") === "fixed"}
        <input
          type="text"
          inputmode="numeric"
          value={el.height}
          oninput={(e) => {
            const target = e.target as HTMLInputElement;
            target.value = target.value.replace(/\D/g, "");
            const val = Math.max(20, sanitizeNumber(target.value));
            editor.updateElement(el.id, { height: val });
          }}
          onkeydown={(e) =>
            handleNumberKeydown(
              e,
              el.height,
              (val) => editor.updateElement(el.id, { height: val }),
              { min: 20 }
            )}
          class="w-full bg-transparent text-right font-mono text-white focus:outline-none"
        />
        <span class="font-mono text-[11px] text-neutral-500">px</span>
      {:else if el.heightMode === "hug"}
        <span class="w-full text-right font-mono text-[11px] text-[#0d99ff]"
          >Ikuti Konten (Otomatis)</span
        >
      {:else if el.heightMode === "fill"}
        <span class="w-full text-right font-mono text-[11px] text-[#0d99ff]"
          >Penuhi Kontainer (100%)</span
        >
      {/if}
    </div>
  </div>
</div>
