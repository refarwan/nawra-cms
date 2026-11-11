<script lang="ts">
  import BoxSpacingInput from "./BoxSpacingInput.svelte";
  import { handleNumberKeydown, sanitizeNumber } from "./number-input-utils";

  import type { EditorState } from "./editor-state.svelte";
  import type { CanvasElement } from "./types";

  let { editor, el }: { editor: EditorState; el: CanvasElement } = $props();
</script>

<div class="space-y-3">
  <div
    class="flex items-center gap-2 rounded border border-[#333] bg-[#252525] px-2 py-1.5 text-xs"
    title="Kelengkungan Sudut (Radius)"
  >
    <span class="text-neutral-500">Radius</span>
    <input
      type="text"
      inputmode="numeric"
      value={el.borderRadius}
      oninput={(e) => {
        const target = e.target as HTMLInputElement;
        target.value = target.value.replace(/\D/g, "");
        editor.updateElement(el.id, { borderRadius: sanitizeNumber(target.value) });
      }}
      onkeydown={(e) =>
        handleNumberKeydown(
          e,
          el.borderRadius,
          (val) => editor.updateElement(el.id, { borderRadius: val }),
          { min: 0 }
        )}
      class="w-full bg-transparent text-right font-mono text-white focus:outline-none"
    />
    <span class="font-mono text-[11px] text-neutral-500">px</span>
  </div>

  <BoxSpacingInput
    label="Padding"
    top={el.paddingTop ?? el.padding ?? 0}
    right={el.paddingRight ?? el.padding ?? 0}
    bottom={el.paddingBottom ?? el.padding ?? 0}
    left={el.paddingLeft ?? el.padding ?? 0}
    onChangeAll={(val) => {
      editor.updateElement(el.id, {
        padding: val,
        paddingTop: val,
        paddingRight: val,
        paddingBottom: val,
        paddingLeft: val
      });
    }}
    onChangeSide={(side, val) => {
      const key =
        side === "top"
          ? "paddingTop"
          : side === "right"
            ? "paddingRight"
            : side === "bottom"
              ? "paddingBottom"
              : "paddingLeft";
      editor.updateElement(el.id, { [key]: val });
    }}
  />

  <BoxSpacingInput
    label="Margin"
    top={el.marginTop ?? el.margin ?? 0}
    right={el.marginRight ?? el.margin ?? 0}
    bottom={el.marginBottom ?? el.margin ?? 0}
    left={el.marginLeft ?? el.margin ?? 0}
    onChangeAll={(val) => {
      editor.updateElement(el.id, {
        margin: val,
        marginTop: val,
        marginRight: val,
        marginBottom: val,
        marginLeft: val
      });
    }}
    onChangeSide={(side, val) => {
      const key =
        side === "top"
          ? "marginTop"
          : side === "right"
            ? "marginRight"
            : side === "bottom"
              ? "marginBottom"
              : "marginLeft";
      editor.updateElement(el.id, { [key]: val });
    }}
  />
</div>
