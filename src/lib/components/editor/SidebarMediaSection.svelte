<script lang="ts">
  import Icon from "@iconify/svelte";

  import ImagePickerModal from "#lib/components/media/ImagePickerModal.svelte";

  import ColorPickerInput from "./ColorPickerInput.svelte";
  import FlexboxAlignBox from "./FlexboxAlignBox.svelte";
  import FlexboxGapInput from "./FlexboxGapInput.svelte";
  import IconSearchInput from "./IconSearchInput.svelte";

  import type { EditorState } from "./editor-state.svelte";
  import type { CanvasElement } from "./types";

  let { editor, el }: { editor: EditorState; el: CanvasElement } = $props();
  let showImagePicker = $state(false);
</script>

<!-- Image Source (if image) -->
{#if el.type === "image"}
  <div class="border-t border-[#2c2c2c] pt-4">
    <div class="mb-2 flex items-center justify-between">
      <span class="text-[11px] font-semibold tracking-wider text-neutral-400 uppercase">
        Link URL Gambar
      </span>
      <button
        type="button"
        onclick={() => (showImagePicker = true)}
        class="inline-flex cursor-pointer items-center gap-1 rounded bg-[#252525] px-2 py-0.5 text-[10px] font-medium text-[#0d99ff] hover:bg-[#333]"
      >
        <Icon icon="lucide:images" class="h-3 w-3" />
        <span>Galeri</span>
      </button>
    </div>
    <input
      type="text"
      value={el.src || ""}
      placeholder="https://... atau /api/media/..."
      oninput={(e) => editor.updateElement(el.id, { src: (e.target as HTMLInputElement).value })}
      class="w-full rounded border border-[#333] bg-[#252525] px-2.5 py-1.5 text-white focus:border-[#0d99ff] focus:outline-none"
    />
  </div>

  {#if showImagePicker}
    <ImagePickerModal
      onClose={() => (showImagePicker = false)}
      onSelect={(img) => {
        editor.updateElement(el.id, { src: img.url, alt: img.altText || img.name });
        showImagePicker = false;
      }}
    />
  {/if}
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
        <ColorPickerInput
          label="Warna Ikon"
          value={el.color?.startsWith("#") ? el.color : "#0d99ff"}
          allowTransparent={false}
          onChange={(color) => editor.updateElement(el.id, { color })}
        />
      </div>
    </div>
  </div>
{/if}

<!-- YouTube Video Settings -->
{#if el.type === "youtube"}
  <div class="border-t border-[#2c2c2c] pt-4">
    <div class="mb-2 text-[11px] font-semibold tracking-wider text-neutral-400 uppercase">
      Video YouTube
    </div>
    <div class="space-y-1.5">
      <span class="block text-[10px] text-neutral-400">Link URL YouTube</span>
      <input
        type="text"
        value={el.src || ""}
        placeholder="https://www.youtube.com/watch?v=... atau https://youtu.be/..."
        oninput={(e) => editor.updateElement(el.id, { src: (e.target as HTMLInputElement).value })}
        class="w-full rounded border border-[#333] bg-[#252525] px-2.5 py-1.5 font-mono text-xs text-white focus:border-[#0d99ff] focus:outline-none"
      />
      <p class="text-[10px] leading-relaxed text-neutral-500">
        Cukup copy &amp; paste URL video dari YouTube (otomatis dikonversi menjadi player embed).
      </p>
    </div>
  </div>
{/if}

<!-- Flexbox Layout Settings -->
{#if el.type === "frame"}
  <div class="border-t border-[#2c2c2c] pt-4">
    <div class="mb-2 text-[11px] font-semibold tracking-wider text-neutral-400 uppercase">
      Pengaturan Flexbox
    </div>
    <div class="space-y-3">
      <div>
        <span class="mb-1 block text-[10px] text-neutral-400">Arah Tata Letak</span>
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

      <div class="flex items-start gap-2">
        <div class="w-30 shrink-0">
          <FlexboxAlignBox
            flexDirection={el.flexDirection || "row"}
            justifyContent={el.justifyContent || "flex-start"}
            alignItems={el.alignItems || "center"}
            onChange={(justify, align) => {
              editor.updateElement(el.id, { justifyContent: justify, alignItems: align });
            }}
          />
        </div>

        <div class="flex-1">
          <FlexboxGapInput
            gapX={el.gapX ?? el.gap ?? 0}
            gapY={el.gapY ?? el.gap ?? 0}
            isAuto={el.justifyContent === "space-between"}
            flexDirection={el.flexDirection || "row"}
            onChangeGapX={(val) => editor.updateElement(el.id, { gapX: val, gap: val })}
            onChangeGapY={(val) => editor.updateElement(el.id, { gapY: val })}
            onSetAuto={() => editor.updateElement(el.id, { justifyContent: "space-between" })}
            onUnsetAuto={(val) =>
              editor.updateElement(el.id, {
                gap: val,
                gapX: val,
                gapY: val,
                justifyContent: "flex-start"
              })}
          />
        </div>
      </div>
    </div>
  </div>
{/if}
