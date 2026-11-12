<script lang="ts">
  import ColorPickerInput from "./ColorPickerInput.svelte";
  import { handleNumberKeydown, sanitizeNumber } from "./number-input-utils";

  import type { EditorState } from "./editor-state.svelte";
  import type { CanvasElement } from "./types";

  let { editor, el }: { editor: EditorState; el: CanvasElement } = $props();
</script>

<!-- Fill / Background -->
<div class="border-t border-[#2c2c2c] pt-4">
  <div class="mb-2 text-[11px] font-semibold tracking-wider text-neutral-400 uppercase">
    Warna Latar (Background)
  </div>
  <div class="space-y-2">
    <ColorPickerInput
      label="Warna Latar"
      value={el.fill}
      allowTransparent={true}
      onChange={(fill) => editor.updateElement(el.id, { fill })}
    />

    <div
      class="flex items-center justify-between rounded border border-[#333] bg-[#252525] px-2.5 py-1.5"
    >
      <span class="text-[10px] text-neutral-400">Opasitas</span>
      <div class="flex items-center gap-1 font-mono text-xs">
        <input
          type="text"
          inputmode="numeric"
          value={el.opacity}
          oninput={(e) => {
            const target = e.target as HTMLInputElement;
            target.value = target.value.replace(/\D/g, "");
            const val = Math.min(100, Math.max(0, sanitizeNumber(target.value)));
            editor.updateElement(el.id, { opacity: val });
          }}
          onkeydown={(e) =>
            handleNumberKeydown(
              e,
              el.opacity,
              (val) => editor.updateElement(el.id, { opacity: val }),
              { min: 0, max: 100 }
            )}
          class="w-12 bg-transparent text-right text-white focus:outline-none"
        />
        <span class="text-neutral-500">%</span>
      </div>
    </div>
  </div>
</div>

<!-- Stroke / Border -->
<div class="border-t border-[#2c2c2c] pt-4">
  <div class="mb-2 text-[11px] font-semibold tracking-wider text-neutral-400 uppercase">
    Garis Pinggir (Border)
  </div>
  <div class="space-y-2">
    <div class="grid grid-cols-2 gap-2">
      <div class="flex items-center gap-2 rounded border border-[#333] bg-[#252525] px-2 py-1.5">
        <span class="text-neutral-500">Tebal</span>
        <input
          type="text"
          inputmode="numeric"
          value={el.borderWidth}
          oninput={(e) => {
            const target = e.target as HTMLInputElement;
            target.value = target.value.replace(/\D/g, "");
            editor.updateElement(el.id, { borderWidth: sanitizeNumber(target.value) });
          }}
          onkeydown={(e) =>
            handleNumberKeydown(
              e,
              el.borderWidth,
              (val) => editor.updateElement(el.id, { borderWidth: val }),
              { min: 0 }
            )}
          class="w-full bg-transparent text-right font-mono text-white focus:outline-none"
        />
      </div>
      <select
        value={el.borderStyle}
        onchange={(e) =>
          editor.updateElement(el.id, {
            borderStyle: (e.target as HTMLSelectElement).value as CanvasElement["borderStyle"]
          })}
        class="rounded border border-[#333] bg-[#252525] px-2 py-1.5 text-white focus:outline-none"
      >
        <option value="solid">Garis Lurus</option>
        <option value="dashed">Garis Putus</option>
        <option value="dotted">Titik-titik</option>
        <option value="none">Tanpa Garis</option>
      </select>
    </div>

    <ColorPickerInput
      label="Warna Garis Pinggir"
      value={el.borderColor}
      allowTransparent={true}
      onChange={(borderColor) => editor.updateElement(el.id, { borderColor })}
    />
  </div>
</div>
