<script lang="ts">
  import Icon from "@iconify/svelte";

  import IconSearchInput from "./IconSearchInput.svelte";

  import type { EditorState } from "./editor-state.svelte";
  import type { CanvasElement, SizingMode } from "./types";

  let { editor }: { editor: EditorState } = $props();

  const el = $derived(editor.selectedElement);

  const framePresets = [
    { label: "Komputer / Desktop (1280 px)", w: 1280, h: 480 },
    { label: "Laptop MacBook (1440 × 900)", w: 1440, h: 900 },
    { label: "Tablet iPad (768 × 900)", w: 768, h: 900 },
    { label: "Smartphone (390 × 780)", w: 390, h: 780 }
  ];

  function applyPreset(w: number, h: number) {
    editor.frame.width = w;
    const defaultFb = editor.elements.find(
      (item) => item.isDefault || item.id === "flexbox-default"
    );
    if (defaultFb) {
      defaultFb.width = w;
      editor.frame.height = defaultFb.height;
    } else {
      editor.frame.height = h;
    }
  }

  const shadowPresets = [
    { label: "Tanpa Bayangan (None)", value: "none" },
    {
      label: "Halus (Subtle)",
      value: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)"
    },
    {
      label: "Sedang (Medium)",
      value: "0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -4px rgba(0, 0, 0, 0.2)"
    },
    { label: "Tebal (Heavy)", value: "0 25px 50px -12px rgba(0, 0, 0, 0.5)" },
    { label: "Glow Neon Biru", value: "0 0 25px rgba(13, 153, 255, 0.45)" }
  ];
</script>

<aside
  class="flex h-full w-72 flex-col border-l border-[#2c2c2c] bg-[#1e1e1e] text-xs text-neutral-300"
>
  {#if el}
    <!-- Element Header -->
    <div class="flex items-center justify-between border-b border-[#2c2c2c] px-4 py-3">
      <div class="flex items-center gap-2">
        <span
          class="rounded bg-[#2c2c2c] px-1.5 py-0.5 text-[10px] font-semibold tracking-wider text-[#0d99ff] uppercase"
        >
          {el.type}
        </span>
        {#if el.isDefault || el.id === "flexbox-default"}
          <span class="px-1 font-medium text-white select-none">Container</span>
        {:else}
          <input
            type="text"
            value={el.name}
            oninput={(e) => {
              editor.updateElement(el.id, { name: (e.target as HTMLInputElement).value });
            }}
            class="-mx-1 rounded bg-transparent px-1 font-medium text-white focus:ring-1 focus:ring-[#0d99ff] focus:outline-none"
          />
        {/if}
      </div>
      <div class="flex items-center gap-1">
        <button
          onclick={() => editor.duplicateElement(el.id)}
          class="rounded p-1 text-neutral-400 hover:bg-[#2c2c2c] hover:text-white"
          title="Duplikat (Ctrl+D)"
        >
          <Icon icon="lucide:copy" class="h-3.5 w-3.5" />
        </button>
        {#if !el.isDefault && el.id !== "flexbox-default"}
          <button
            onclick={() => editor.deleteElement(el.id)}
            class="rounded p-1 text-red-400 hover:bg-red-500/20 hover:text-red-300"
            title="Hapus Elemen"
          >
            <Icon icon="lucide:trash-2" class="h-3.5 w-3.5" />
          </button>
        {/if}
      </div>
    </div>

    <!-- Properties Form -->
    <div class="flex-1 space-y-5 overflow-y-auto p-4">
      <!-- Position & Size -->
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

        <!-- Koordinat X & Y (hanya untuk elemen root bebas) -->
        {#if !el.parentId && !el.isDefault && el.id !== "flexbox-default"}
          <div class="mb-2 grid grid-cols-2 gap-2 text-xs">
            <div
              class="flex items-center gap-2 rounded border border-[#333] bg-[#252525] px-2 py-1.5"
            >
              <span class="font-mono text-neutral-500">X</span>
              <input
                type="number"
                value={el.x}
                oninput={(e) =>
                  editor.updateElement(el.id, { x: +(e.target as HTMLInputElement).value })}
                class="w-full bg-transparent text-right font-mono text-white focus:outline-none"
              />
            </div>
            <div
              class="flex items-center gap-2 rounded border border-[#333] bg-[#252525] px-2 py-1.5"
            >
              <span class="font-mono text-neutral-500">Y</span>
              <input
                type="number"
                value={el.y}
                oninput={(e) =>
                  editor.updateElement(el.id, { y: +(e.target as HTMLInputElement).value })}
                class="w-full bg-transparent text-right font-mono text-white focus:outline-none"
              />
            </div>
          </div>
        {/if}

        <!-- Pengaturan Lebar (Width Mode: Tetap, Ikuti Konten, Penuhi Kontainer) -->
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
                type="number"
                value={el.width}
                oninput={(e) =>
                  editor.updateElement(el.id, {
                    width: Math.max(10, +(e.target as HTMLInputElement).value)
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

        <!-- Pengaturan Tinggi (Height Mode: Tetap, Ikuti Konten, Penuhi Kontainer) -->
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
                type="number"
                value={el.height}
                oninput={(e) => {
                  const val = Math.max(20, +(e.target as HTMLInputElement).value);
                  editor.updateElement(el.id, { height: val });
                  if (el.isDefault || el.id === "flexbox-default") {
                    editor.frame.height = val;
                  }
                }}
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

        <div class="mt-2 grid grid-cols-2 gap-2 text-xs">
          <div
            class="flex items-center gap-2 rounded border border-[#333] bg-[#252525] px-2 py-1.5"
          >
            <span class="text-neutral-500">Radius</span>
            <input
              type="number"
              value={el.borderRadius}
              oninput={(e) =>
                editor.updateElement(el.id, {
                  borderRadius: +(e.target as HTMLInputElement).value
                })}
              class="w-full bg-transparent text-right font-mono text-white focus:outline-none"
            />
          </div>
          <div
            class="flex items-center gap-2 rounded border border-[#333] bg-[#252525] px-2 py-1.5"
          >
            <span class="text-neutral-500">Rotasi</span>
            <input
              type="number"
              value={el.rotation}
              oninput={(e) =>
                editor.updateElement(el.id, {
                  rotation: +(e.target as HTMLInputElement).value
                })}
              class="w-full bg-transparent text-right font-mono text-white focus:outline-none"
            />
          </div>
        </div>
      </div>

      <!-- Typography (if text, heading, button, badge, link) -->
      {#if el.type === "heading" || el.type === "text" || el.type === "button" || el.type === "badge" || el.type === "link"}
        <div class="border-t border-[#2c2c2c] pt-4">
          <div class="mb-2 text-[11px] font-semibold tracking-wider text-neutral-400 uppercase">
            Konten & Teks
          </div>

          <div class="space-y-2">
            <!-- Content -->
            <div>
              <span class="mb-1 block text-[10px] text-neutral-400">Isi Teks</span>
              {#if el.type === "text"}
                <textarea
                  rows={3}
                  value={el.content}
                  oninput={(e) =>
                    editor.updateElement(el.id, {
                      content: (e.target as HTMLTextAreaElement).value
                    })}
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

            <!-- Link target URL if link -->
            {#if el.type === "link"}
              <div>
                <span class="mb-1 block text-[10px] text-neutral-400">URL Tautan Tujuan (Href)</span
                >
                <input
                  type="text"
                  value={el.href || ""}
                  placeholder="https://..."
                  oninput={(e) =>
                    editor.updateElement(el.id, { href: (e.target as HTMLInputElement).value })}
                  class="w-full rounded border border-[#333] bg-[#252525] px-2.5 py-1.5 text-white focus:border-[#0d99ff] focus:outline-none"
                />
              </div>
            {/if}

            <div class="grid grid-cols-2 gap-2">
              <!-- Font Size -->
              <div
                class="flex items-center gap-2 rounded border border-[#333] bg-[#252525] px-2 py-1.5"
              >
                <span class="text-neutral-500">Ukuran</span>
                <input
                  type="number"
                  value={el.fontSize || 16}
                  oninput={(e) =>
                    editor.updateElement(el.id, {
                      fontSize: +(e.target as HTMLInputElement).value
                    })}
                  class="w-full bg-transparent text-right font-mono text-white focus:outline-none"
                />
              </div>

              <!-- Weight -->
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

            <!-- Text Align & Text Color -->
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

              <div
                class="flex items-center gap-1.5 rounded border border-[#333] bg-[#252525] px-2 py-1"
              >
                <input
                  type="color"
                  value={el.color || "#ffffff"}
                  oninput={(e) =>
                    editor.updateElement(el.id, { color: (e.target as HTMLInputElement).value })}
                  class="h-4 w-4 cursor-pointer rounded border-0 bg-transparent p-0"
                />
                <span class="font-mono text-[11px] text-neutral-300">{el.color || "#fff"}</span>
              </div>
            </div>
          </div>
        </div>
      {/if}

      <!-- Image Source (if image) -->
      {#if el.type === "image"}
        <div class="border-t border-[#2c2c2c] pt-4">
          <div class="mb-2 text-[11px] font-semibold tracking-wider text-neutral-400 uppercase">
            Link URL Gambar
          </div>
          <input
            type="text"
            value={el.src || ""}
            placeholder="https://..."
            oninput={(e) =>
              editor.updateElement(el.id, { src: (e.target as HTMLInputElement).value })}
            class="w-full rounded border border-[#333] bg-[#252525] px-2.5 py-1.5 text-white focus:border-[#0d99ff] focus:outline-none"
          />
        </div>
      {/if}

      <!-- Icon Settings (if icon) -->
      {#if el.type === "icon"}
        <div class="border-t border-[#2c2c2c] pt-4">
          <div class="mb-2 text-[11px] font-semibold tracking-wider text-neutral-400 uppercase">
            Pengaturan Ikon
          </div>

          <div class="space-y-3">
            <IconSearchInput
              label="Cari & Pilih Ikon (Iconify)"
              placeholder="Cari ikon (contoh: star, heart, bell)..."
              selectedIcon={el.icon || el.content || "lucide:smile"}
              onSelect={(iconName) => {
                editor.updateElement(el.id, { icon: iconName, content: iconName });
              }}
            />

            <div>
              <span class="mb-1 block text-[10px] text-neutral-400">Warna Ikon</span>
              <div class="flex items-center gap-2 rounded border border-[#333] bg-[#252525] p-2">
                <input
                  type="color"
                  value={el.color?.startsWith("#") ? el.color : "#0d99ff"}
                  oninput={(e) =>
                    editor.updateElement(el.id, { color: (e.target as HTMLInputElement).value })}
                  class="h-6 w-6 cursor-pointer rounded border border-white/20 bg-transparent p-0"
                />
                <input
                  type="text"
                  value={el.color || "#0d99ff"}
                  oninput={(e) =>
                    editor.updateElement(el.id, { color: (e.target as HTMLInputElement).value })}
                  class="w-full bg-transparent font-mono text-xs text-white focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      {/if}

      <!-- Fill / Background -->
      <div class="border-t border-[#2c2c2c] pt-4">
        <div class="mb-2 text-[11px] font-semibold tracking-wider text-neutral-400 uppercase">
          Warna Latar (Background)
        </div>
        <div
          class="flex items-center justify-between gap-2 rounded border border-[#333] bg-[#252525] p-2"
        >
          <div class="flex items-center gap-2">
            <input
              type="color"
              value={el.fill.startsWith("#") ? el.fill : "#1e293b"}
              oninput={(e) =>
                editor.updateElement(el.id, { fill: (e.target as HTMLInputElement).value })}
              class="h-6 w-6 cursor-pointer rounded border border-white/20 bg-transparent p-0"
            />
            <input
              type="text"
              value={el.fill}
              oninput={(e) =>
                editor.updateElement(el.id, { fill: (e.target as HTMLInputElement).value })}
              class="w-24 bg-transparent font-mono text-white focus:outline-none"
            />
          </div>

          <div class="flex items-center gap-1 text-neutral-400">
            <span class="text-[10px]">Opasitas</span>
            <input
              type="number"
              min="0"
              max="100"
              value={el.opacity}
              oninput={(e) =>
                editor.updateElement(el.id, { opacity: +(e.target as HTMLInputElement).value })}
              class="w-12 bg-transparent text-right font-mono text-white focus:outline-none"
            />
            <span>%</span>
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
            <div
              class="flex items-center gap-2 rounded border border-[#333] bg-[#252525] px-2 py-1.5"
            >
              <span class="text-neutral-500">Tebal</span>
              <input
                type="number"
                min="0"
                value={el.borderWidth}
                oninput={(e) =>
                  editor.updateElement(el.id, {
                    borderWidth: +(e.target as HTMLInputElement).value
                  })}
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

          <div class="flex items-center gap-2 rounded border border-[#333] bg-[#252525] p-2">
            <input
              type="color"
              value={el.borderColor.startsWith("#") ? el.borderColor : "#334155"}
              oninput={(e) =>
                editor.updateElement(el.id, {
                  borderColor: (e.target as HTMLInputElement).value
                })}
              class="h-5 w-5 cursor-pointer rounded border border-white/20 bg-transparent p-0"
            />
            <input
              type="text"
              value={el.borderColor}
              oninput={(e) =>
                editor.updateElement(el.id, {
                  borderColor: (e.target as HTMLInputElement).value
                })}
              class="w-full bg-transparent font-mono text-white focus:outline-none"
            />
          </div>
        </div>
      </div>

      <!-- YouTube Video Settings -->
      {#if el.type === "youtube"}
        <div class="border-t border-[#2c2c2c] pt-4">
          <div class="mb-2 text-[11px] font-semibold tracking-wider text-neutral-400 uppercase">
            Video YouTube
          </div>
          <div>
            <span class="mb-1 block text-[10px] text-neutral-400">Embed URL YouTube</span>
            <input
              type="text"
              value={el.src || ""}
              placeholder="https://www.youtube.com/embed/..."
              oninput={(e) =>
                editor.updateElement(el.id, { src: (e.target as HTMLInputElement).value })}
              class="w-full rounded border border-[#333] bg-[#252525] px-2.5 py-1.5 font-mono text-xs text-white focus:border-[#0d99ff] focus:outline-none"
            />
          </div>
        </div>
      {/if}

      <!-- Flexbox Layout Settings -->
      {#if el.type === "frame"}
        <div class="border-t border-[#2c2c2c] pt-4">
          <div class="mb-2 text-[11px] font-semibold tracking-wider text-neutral-400 uppercase">
            Arah Flexbox
          </div>
          <div class="grid grid-cols-2 gap-2">
            <button
              onclick={() => editor.updateElement(el.id, { flexDirection: "row" })}
              class="rounded border border-[#333] px-2 py-1.5 text-xs transition {el.flexDirection ===
              'row'
                ? 'bg-[#0d99ff] text-white'
                : 'bg-[#252525] text-neutral-400 hover:text-white'}"
            >
              Baris (Horizontal)
            </button>
            <button
              onclick={() => editor.updateElement(el.id, { flexDirection: "column" })}
              class="rounded border border-[#333] px-2 py-1.5 text-xs transition {el.flexDirection ===
              'column'
                ? 'bg-[#0d99ff] text-white'
                : 'bg-[#252525] text-neutral-400 hover:text-white'}"
            >
              Kolom (Vertikal)
            </button>
          </div>
        </div>
      {/if}

      <!-- Effects / Shadow -->
      <div class="border-t border-[#2c2c2c] pt-4">
        <div class="mb-2 text-[11px] font-semibold tracking-wider text-neutral-400 uppercase">
          Efek Bayangan (Shadow)
        </div>
        <select
          value={el.boxShadow}
          onchange={(e) =>
            editor.updateElement(el.id, { boxShadow: (e.target as HTMLSelectElement).value })}
          class="w-full rounded border border-[#333] bg-[#252525] px-2.5 py-1.5 text-white focus:outline-none"
        >
          {#each shadowPresets as preset (preset.value)}
            <option value={preset.value}>{preset.label}</option>
          {/each}
        </select>
      </div>
    </div>
  {:else}
    <!-- Canvas / Frame Properties (when no element is selected) -->
    <div class="border-b border-[#2c2c2c] px-4 py-3">
      <span class="font-medium text-white">Pengaturan Kanvas Halaman</span>
    </div>

    <div class="flex-1 space-y-5 overflow-y-auto p-4">
      <!-- Preset Device -->
      <div>
        <span class="mb-2 block text-[11px] font-semibold tracking-wider text-neutral-400 uppercase"
          >Preset Ukuran Layar</span
        >
        <div class="space-y-1.5">
          {#each framePresets as preset (preset.label)}
            <button
              onclick={() => applyPreset(preset.w, preset.h)}
              class="flex w-full items-center justify-between rounded border border-[#333] bg-[#252525] px-3 py-2 text-left transition hover:border-[#0d99ff] hover:text-white"
            >
              <span class="text-xs">{preset.label}</span>
            </button>
          {/each}
        </div>
      </div>

      <!-- Custom Size -->
      <div>
        <div class="mb-2 text-[11px] font-semibold tracking-wider text-neutral-400 uppercase">
          Ukuran Kustom
        </div>
        <div class="grid grid-cols-2 gap-2">
          <div
            class="flex items-center gap-2 rounded border border-[#333] bg-[#252525] px-2 py-1.5"
          >
            <span class="font-mono text-neutral-500">L</span>
            <input
              type="number"
              value={editor.frame.width}
              oninput={(e) => {
                const val = +(e.target as HTMLInputElement).value;
                editor.frame.width = val;
                const defaultFb = editor.elements.find(
                  (item) => item.isDefault || item.id === "flexbox-default"
                );
                if (defaultFb) {
                  editor.updateElement(defaultFb.id, { width: val });
                }
              }}
              class="w-full bg-transparent text-right font-mono text-white focus:outline-none"
            />
          </div>
          <div
            class="flex items-center gap-2 rounded border border-[#333] bg-[#252525] px-2 py-1.5"
          >
            <span class="font-mono text-neutral-500">T</span>
            <input
              type="number"
              value={editor.frame.height}
              oninput={(e) => {
                const val = +(e.target as HTMLInputElement).value;
                editor.frame.height = val;
                const defaultFb = editor.elements.find(
                  (item) => item.isDefault || item.id === "flexbox-default"
                );
                if (defaultFb) {
                  editor.updateElement(defaultFb.id, { height: val });
                }
              }}
              class="w-full bg-transparent text-right font-mono text-white focus:outline-none"
            />
          </div>
        </div>
      </div>

      <!-- Frame Background -->
      <div>
        <div class="mb-2 text-[11px] font-semibold tracking-wider text-neutral-400 uppercase">
          Warna Latar Halaman
        </div>
        <div class="flex items-center gap-2 rounded border border-[#333] bg-[#252525] p-2">
          <input
            type="color"
            value={editor.frame.background}
            oninput={(e) => (editor.frame.background = (e.target as HTMLInputElement).value)}
            class="h-6 w-6 cursor-pointer rounded border border-white/20 bg-transparent p-0"
          />
          <input
            type="text"
            value={editor.frame.background}
            oninput={(e) => (editor.frame.background = (e.target as HTMLInputElement).value)}
            class="w-full bg-transparent font-mono text-white focus:outline-none"
          />
        </div>
      </div>

      <div class="rounded-lg border border-[#333] bg-[#252525] p-3 text-[11px] text-neutral-400">
        <p class="mb-1 font-medium text-white">CMS Visual</p>
        <p>
          Klik elemen apa saja di kanvas untuk mengedit teks, gambar, tata letak, dan gayanya secara
          langsung tanpa koding.
        </p>
      </div>
    </div>
  {/if}
</aside>
