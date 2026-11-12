<script lang="ts">
  import ColorPickerInput from "./ColorPickerInput.svelte";
  import { handleNumberKeydown, sanitizeNumber } from "./number-input-utils";

  import type { EditorState } from "./editor-state.svelte";

  let { editor }: { editor: EditorState } = $props();

  const framePresets = [
    { label: "Komputer / Desktop (1280 x 720)", w: 1280, h: 720 },
    { label: "Tablet iPad (768 × 900)", w: 768, h: 900 },
    { label: "Smartphone (390 × 780)", w: 390, h: 780 }
  ];

  function applyPreset(w: number) {
    if (w === 1280) editor.setDevice("desktop");
    else if (w === 768) editor.setDevice("tablet");
    else if (w === 390) editor.setDevice("mobile");
  }
</script>

<div class="border-b border-[#2c2c2c] px-4 py-3">
  <span class="font-medium text-white">Pengaturan Kanvas Halaman</span>
</div>

<div class="flex-1 space-y-5 overflow-y-auto p-4">
  <div>
    <span class="mb-2 block text-[11px] font-semibold tracking-wider text-neutral-400 uppercase"
      >Preset Ukuran Layar</span
    >
    <div class="space-y-1.5">
      {#each framePresets as preset (preset.label)}
        <button
          onclick={() => applyPreset(preset.w)}
          class="flex w-full items-center justify-between rounded border border-[#333] bg-[#252525] px-3 py-2 text-left transition hover:border-[#0d99ff] hover:text-white"
        >
          <span class="text-xs">{preset.label}</span>
        </button>
      {/each}
    </div>
  </div>

  <div>
    <div class="mb-2 text-[11px] font-semibold tracking-wider text-neutral-400 uppercase">
      Ukuran Kustom
    </div>
    <div class="grid grid-cols-2 gap-2">
      <div class="flex items-center gap-2 rounded border border-[#333] bg-[#252525] px-2 py-1.5">
        <span class="font-mono text-neutral-500">L</span>
        <input
          type="text"
          inputmode="numeric"
          value={editor.frame.width}
          oninput={(e) => {
            const target = e.target as HTMLInputElement;
            target.value = target.value.replace(/\D/g, "");
            const val = Math.max(300, sanitizeNumber(target.value));
            editor.frame.width = val;
            const defaultFb = editor.elements.find(
              (item) => item.isDefault || item.id === "flexbox-default"
            );
            if (defaultFb) editor.updateElement(defaultFb.id, { width: val });
          }}
          onkeydown={(e) =>
            handleNumberKeydown(
              e,
              editor.frame.width,
              (val) => {
                editor.frame.width = val;
                const defaultFb = editor.elements.find(
                  (item) => item.isDefault || item.id === "flexbox-default"
                );
                if (defaultFb) editor.updateElement(defaultFb.id, { width: val });
              },
              { min: 300 }
            )}
          class="w-full bg-transparent text-right font-mono text-white focus:outline-none"
        />
      </div>
      <div
        class="flex items-center gap-2 rounded border border-[#333] bg-[#252525] px-2 py-1.5"
        title="Tinggi Minimal Kanvas (Auto mengikuti konten)"
      >
        <span class="font-mono text-neutral-500">T.Min</span>
        <input
          type="text"
          inputmode="numeric"
          value={editor.frame.minHeight ?? 720}
          oninput={(e) => {
            const target = e.target as HTMLInputElement;
            target.value = target.value.replace(/\D/g, "");
            editor.frame.minHeight = Math.max(200, sanitizeNumber(target.value));
          }}
          onkeydown={(e) =>
            handleNumberKeydown(
              e,
              editor.frame.minHeight ?? 720,
              (val) => (editor.frame.minHeight = val),
              { min: 200 }
            )}
          class="w-full bg-transparent text-right font-mono text-white focus:outline-none"
        />
      </div>
    </div>
  </div>

  <div>
    <div class="mb-2 text-[11px] font-semibold tracking-wider text-neutral-400 uppercase">
      Warna Latar Halaman
    </div>
    <ColorPickerInput
      label="Warna Latar Halaman"
      value={editor.frame.background}
      allowTransparent={false}
      onChange={(bg) => (editor.frame.background = bg)}
    />
  </div>

  <div class="rounded-lg border border-[#333] bg-[#252525] p-3 text-[11px] text-neutral-400">
    <p class="mb-1 font-medium text-white">CMS Visual</p>
    <p>
      Klik elemen apa saja di kanvas untuk mengedit teks, gambar, tata letak, dan gayanya secara
      langsung tanpa koding.
    </p>
  </div>
</div>
