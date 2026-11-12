<script lang="ts">
  import Icon from "@iconify/svelte";

  import ColorPickerInput from "./ColorPickerInput.svelte";
  import { handleNumberKeydown, sanitizeNumber } from "./number-input-utils";

  import type { EditorState } from "./editor-state.svelte";
  import type { CanvasElement } from "./types";

  let { editor, el }: { editor: EditorState; el: CanvasElement } = $props();
</script>

{#if el.type === "heading" || el.type === "text" || el.type === "button" || el.type === "badge" || el.type === "link"}
  <div class="border-t border-[#2c2c2c] pt-4">
    <div class="mb-2 text-[11px] font-semibold tracking-wider text-neutral-400 uppercase">
      Konten & Teks
    </div>

    <div class="space-y-2">
      <div>
        <span class="mb-1 block text-[10px] text-neutral-400">Isi Teks</span>
        {#if el.type === "text"}
          <textarea
            rows={3}
            value={el.content}
            oninput={(e) =>
              editor.updateElement(el.id, { content: (e.target as HTMLTextAreaElement).value })}
            class="w-full resize-none rounded border border-[#333] bg-[#252525] p-2 text-white focus:border-[#0d99ff] focus:outline-none"
          ></textarea>
        {:else}
          <input
            type="text"
            value={el.content}
            oninput={(e) =>
              editor.updateElement(el.id, { content: (e.target as HTMLInputElement).value })}
            class="w-full rounded border border-[#333] bg-[#252525] px-2.5 py-1.5 text-white focus:border-[#0d99ff] focus:outline-none"
          />
        {/if}
      </div>

      {#if el.type === "link" || el.type === "button"}
        <div>
          <span class="mb-1 block text-[10px] text-neutral-400">URL Tautan Tujuan (Href)</span>
          <input
            type="text"
            value={el.href || ""}
            placeholder="https://... atau /halaman"
            oninput={(e) =>
              editor.updateElement(el.id, { href: (e.target as HTMLInputElement).value })}
            class="w-full rounded border border-[#333] bg-[#252525] px-2.5 py-1.5 text-white focus:border-[#0d99ff] focus:outline-none"
          />
        </div>
      {/if}

      <div class="grid grid-cols-2 gap-2">
        <div class="flex items-center gap-2 rounded border border-[#333] bg-[#252525] px-2 py-1.5">
          <span class="text-neutral-500">Ukuran</span>
          <input
            type="text"
            inputmode="numeric"
            value={el.fontSize || 16}
            oninput={(e) => {
              const target = e.target as HTMLInputElement;
              target.value = target.value.replace(/\D/g, "");
              editor.updateElement(el.id, {
                fontSize: Math.max(8, sanitizeNumber(target.value) || 16)
              });
            }}
            onkeydown={(e) =>
              handleNumberKeydown(
                e,
                el.fontSize || 16,
                (val) => editor.updateElement(el.id, { fontSize: val }),
                { min: 8 }
              )}
            class="w-full bg-transparent text-right font-mono text-white focus:outline-none"
          />
        </div>

        <select
          value={el.fontWeight || "400"}
          onchange={(e) =>
            editor.updateElement(el.id, {
              fontWeight: (e.target as HTMLSelectElement).value as CanvasElement["fontWeight"]
            })}
          class="rounded border border-[#333] bg-[#252525] px-2 py-1.5 text-white focus:outline-none"
        >
          <option value="300">Tipis (Light)</option>
          <option value="400">Normal (Regular)</option>
          <option value="500">Sedang (Medium)</option>
          <option value="600">Tebal (Semibold)</option>
          <option value="700">Sangat Tebal (Bold)</option>
          <option value="800">Ekstra Tebal</option>
        </select>
      </div>

      <div class="flex items-center justify-between gap-2 pt-1">
        <div class="flex items-center rounded border border-[#333] bg-[#252525] p-0.5">
          <button
            onclick={() => editor.updateElement(el.id, { textAlign: "left" })}
            class="rounded p-1 {el.textAlign === 'left' || !el.textAlign
              ? 'bg-[#383838] text-white'
              : 'text-neutral-400'}"
            title="Rata Kiri"
          >
            <Icon icon="lucide:align-left" class="h-3.5 w-3.5" />
          </button>
          <button
            onclick={() => editor.updateElement(el.id, { textAlign: "center" })}
            class="rounded p-1 {el.textAlign === 'center'
              ? 'bg-[#383838] text-white'
              : 'text-neutral-400'}"
            title="Rata Tengah"
          >
            <Icon icon="lucide:align-center" class="h-3.5 w-3.5" />
          </button>
          <button
            onclick={() => editor.updateElement(el.id, { textAlign: "right" })}
            class="rounded p-1 {el.textAlign === 'right'
              ? 'bg-[#383838] text-white'
              : 'text-neutral-400'}"
            title="Rata Kanan"
          >
            <Icon icon="lucide:align-right" class="h-3.5 w-3.5" />
          </button>
        </div>

        <div class="w-36">
          <ColorPickerInput
            label="Warna Teks"
            value={el.color || "#ffffff"}
            allowTransparent={false}
            onChange={(color) => editor.updateElement(el.id, { color })}
          />
        </div>
      </div>
    </div>
  </div>
{/if}
