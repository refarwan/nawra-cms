<script lang="ts">
  import type { CanvasElement } from "./types";

  let {
    el,
    isDefaultFrame,
    rootWText,
    rootHText,
    onResizeMouseDown
  }: {
    el: CanvasElement;
    isDefaultFrame: boolean;
    rootWText: string;
    rootHText: string;
    onResizeMouseDown: (e: MouseEvent, handle: string) => void;
  } = $props();

  const handles = [
    { id: "nw", label: "Top Left", cls: "-top-1.5 -left-1.5 cursor-nwse-resize" },
    { id: "n", label: "Top Center", cls: "-top-1.5 left-1/2 -translate-x-1/2 cursor-ns-resize" },
    { id: "ne", label: "Top Right", cls: "-top-1.5 -right-1.5 cursor-nesw-resize" },
    {
      id: "e",
      label: "Middle Right",
      cls: "top-1/2 -right-1.5 -translate-y-1/2 cursor-ew-resize"
    },
    { id: "se", label: "Bottom Right", cls: "-right-1.5 -bottom-1.5 cursor-nwse-resize" },
    {
      id: "s",
      label: "Bottom Center",
      cls: "-bottom-1.5 left-1/2 -translate-x-1/2 cursor-ns-resize"
    },
    { id: "sw", label: "Bottom Left", cls: "-bottom-1.5 -left-1.5 cursor-nesw-resize" },
    { id: "w", label: "Middle Left", cls: "top-1/2 -left-1.5 -translate-y-1/2 cursor-ew-resize" }
  ];
</script>

<div
  class="pointer-events-none absolute -inset-px z-30 border border-[#0d99ff]"
  style="border-radius: {Math.max(0, (el.borderRadius || 0) + 1)}px;"
>
  <div
    class="absolute -top-6 left-1/2 -translate-x-1/2 rounded bg-[#0d99ff] px-1.5 py-0.5 font-mono text-[10px] font-medium whitespace-nowrap text-white"
  >
    {el.name}
  </div>
  <div
    class="absolute -bottom-6 left-1/2 -translate-x-1/2 rounded bg-[#0d99ff] px-1.5 py-0.5 font-mono text-[10px] font-medium whitespace-nowrap text-white"
  >
    {rootWText} × {rootHText}
  </div>
</div>

{#if isDefaultFrame}
  <div
    role="slider"
    aria-label="Bottom Center resize handle"
    aria-valuenow={el.height}
    tabindex="0"
    onmousedown={(e) => onResizeMouseDown(e, "s")}
    class="pointer-events-auto absolute -bottom-2 left-1/2 z-50 flex h-3.5 w-12 -translate-x-1/2 cursor-ns-resize items-center justify-center rounded border border-[#0d99ff] bg-white"
    title="Tarik untuk mengubah tinggi flexbox bawaan"
  >
    <div class="h-0.5 w-4 rounded bg-[#0d99ff]"></div>
  </div>
{:else}
  {#each handles as h (h.id)}
    <div
      role="slider"
      aria-label="{h.label} resize handle"
      aria-valuenow={el.width}
      tabindex="0"
      onmousedown={(e) => onResizeMouseDown(e, h.id)}
      class="pointer-events-auto absolute z-50 h-3 w-3 rounded-xs border border-[#0d99ff] bg-white {h.cls}"
    ></div>
  {/each}
{/if}
