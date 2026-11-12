<script lang="ts">
  import { getElTotalHeight, getElTotalWidth } from "./canvas-gesture";
  import CanvasChildItem from "./CanvasChildItem.svelte";
  import CanvasLeafContent from "./CanvasLeafContent.svelte";
  import CanvasResizeHandles from "./CanvasResizeHandles.svelte";
  import { getGapCss, getMarginCss, getPaddingCss } from "./spacing-utils";

  import type { EditorState } from "./editor-state.svelte";
  import type { CanvasElement } from "./types";

  let {
    editor,
    el,
    isDefaultFrame,
    activePresetMinHeight,
    hoveredElementId,
    isPanActive,
    isCanvasPanning,
    defaultFrameHeight = $bindable(0),
    onHover,
    onElementMouseDown,
    onChildMouseDown,
    onResizeMouseDown
  }: {
    editor: EditorState;
    el: CanvasElement;
    isDefaultFrame: boolean;
    activePresetMinHeight: number;
    hoveredElementId: string | null;
    isPanActive: boolean;
    isCanvasPanning: boolean;
    defaultFrameHeight?: number;
    onHover: (id: string | null) => void;
    onElementMouseDown: (e: MouseEvent, el: CanvasElement) => void;
    onChildMouseDown: (e: MouseEvent, child: CanvasElement) => void;
    onResizeMouseDown: (e: MouseEvent, handle: string) => void;
  } = $props();

  const isSelected = $derived(editor.selectedId === el.id);
  const currentX = $derived(isDefaultFrame ? 0 : el.x);
  const currentY = $derived(isDefaultFrame ? 0 : el.y);
  const widthMode = $derived(isDefaultFrame ? "fill" : el.widthMode || "fixed");
  const heightMode = $derived(el.heightMode || "fixed");
  const rootTotalW = $derived(getElTotalWidth(el));
  const rootTotalH = $derived(getElTotalHeight(el));
  const currentWidth = $derived(
    isDefaultFrame || widthMode === "fill" ? editor.frame.width : rootTotalW
  );
  const rootWText = $derived(
    isDefaultFrame
      ? `${editor.frame.width}px`
      : widthMode === "fill"
        ? "Penuh"
        : widthMode === "hug"
          ? "Ikuti"
          : `${el.width}px`
  );
  const rootHText = $derived(
    heightMode === "fill" ? "Penuh" : heightMode === "hug" ? "Ikuti" : `${el.height}px`
  );
  const children = $derived(editor.elements.filter((c) => c.parentId === el.id));
  const frameTag = $derived(
    !isDefaultFrame
      ? "div"
      : editor.targetType === "header" || el.name === "header"
        ? "header"
        : editor.targetType === "footer" || el.name === "footer"
          ? "footer"
          : "main"
  );
  const isAutoHeightType = $derived(
    isDefaultFrame ||
      heightMode === "hug" ||
      (el.type !== "image" && el.type !== "icon" && el.type !== "youtube")
  );
</script>

<div
  role="button"
  tabindex="0"
  onmouseenter={(e) => {
    e.stopPropagation();
    onHover(el.id);
  }}
  onmouseleave={() => {
    if (hoveredElementId === el.id) onHover(null);
  }}
  onmousedown={(e) => onElementMouseDown(e, el)}
  bind:clientHeight={defaultFrameHeight}
  class="absolute {isSelected ? 'z-40' : ''}"
  style="
    left: {currentX}px;
    top: {currentY}px;
    box-sizing: border-box;
    width: {widthMode === 'hug' ? 'auto' : `${currentWidth}px`};
    max-width: 100%;
    min-width: {widthMode === 'hug' ? 'fit-content' : '0'};
    height: {isAutoHeightType ? 'auto' : `${rootTotalH}px`};
    min-height: {isDefaultFrame
    ? `${heightMode === 'fixed' && el.height ? rootTotalH : activePresetMinHeight}px`
    : heightMode === 'hug'
      ? 'fit-content'
      : `${rootTotalH}px`};
    cursor: {isCanvasPanning
    ? 'grabbing'
    : isPanActive
      ? 'grab'
      : editor.isPreviewMode || isDefaultFrame
        ? 'default'
        : el.locked
          ? 'not-allowed'
          : (el.type === 'heading' || el.type === 'text') && isSelected
            ? 'text'
            : 'move'};
  "
>
  <div
    class="w-full {isDefaultFrame ? '' : 'overflow-hidden'}"
    style="
      height: {isAutoHeightType ? 'auto' : `${rootTotalH}px`};
      min-height: {isDefaultFrame
      ? `${heightMode === 'fixed' && el.height ? rootTotalH : activePresetMinHeight}px`
      : heightMode === 'hug'
        ? 'fit-content'
        : `${rootTotalH}px`};
      {el.type !== 'frame' ? 'display: flex; align-items: center;' : ''}
      {el.type === 'button' || el.type === 'badge' ? 'justify-content: center;' : ''}
      background-color: {el.fill};
      border-radius: {el.borderRadius}px;
      border-width: {el.borderWidth}px;
      border-color: {el.borderColor};
      border-style: {el.borderStyle};
      opacity: {el.opacity / 100};
      color: {el.color || 'inherit'};
      font-size: {el.fontSize ? el.fontSize + 'px' : 'inherit'};
      font-weight: {el.fontWeight || 'normal'};
      font-family: {el.fontFamily || 'Poppins'};
      text-align: {el.textAlign || 'left'};
      {el.type !== 'frame' ? getPaddingCss(el) : ''}
      {getMarginCss(el)}
    "
  >
    {#if el.type === "frame"}
      <svelte:element
        this={frameTag}
        class="flex w-full min-w-0 {isDefaultFrame ? '' : 'overflow-hidden'} {el.flexDirection ===
        'column'
          ? 'flex-col'
          : 'flex-row'}"
        style="
          min-height: {isDefaultFrame
          ? `${heightMode === 'fixed' && el.height ? rootTotalH : activePresetMinHeight}px`
          : heightMode === 'fixed'
            ? `${rootTotalH}px`
            : 'fit-content'};
          justify-content: {el.justifyContent || 'flex-start'};
          align-items: {el.alignItems || 'center'};
          {getGapCss(el)}
          {getPaddingCss(el)}
          flex-wrap: wrap;
        "
      >
        {#each children as child (child.id)}
          <CanvasChildItem
            {editor}
            {child}
            {hoveredElementId}
            {isPanActive}
            {isCanvasPanning}
            {onHover}
            {onChildMouseDown}
          />
        {/each}
      </svelte:element>
    {:else}
      <CanvasLeafContent {el} {isSelected} />
    {/if}
  </div>

  {#if !isSelected && hoveredElementId === el.id && !el.locked && !editor.isPreviewMode && !isPanActive}
    <div
      class="pointer-events-none absolute -inset-px z-30 border border-[#0d99ff]"
      style="border-radius: {Math.max(0, (el.borderRadius || 0) + 1)}px;"
    ></div>
  {/if}

  {#if isSelected && !el.locked && !editor.isPreviewMode && !isPanActive}
    <CanvasResizeHandles {el} {isDefaultFrame} {rootWText} {rootHText} {onResizeMouseDown} />
  {/if}
</div>
