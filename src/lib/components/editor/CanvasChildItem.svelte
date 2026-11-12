<script lang="ts">
  import { getElTotalHeight, getElTotalWidth } from "./canvas-gesture";
  import CanvasChildItem from "./CanvasChildItem.svelte";
  import CanvasLeafContent from "./CanvasLeafContent.svelte";
  import { getGapCss, getMarginCss, getPaddingCss } from "./spacing-utils";

  import type { EditorState } from "./editor-state.svelte";
  import type { CanvasElement } from "./types";

  let {
    editor,
    child,
    hoveredElementId,
    editingElementId = null,
    editClickPos = null,
    isPanActive,
    isCanvasPanning,
    onHover,
    onChildMouseDown,
    onStartEdit,
    onStopEdit
  }: {
    editor: EditorState;
    child: CanvasElement;
    hoveredElementId: string | null;
    editingElementId?: string | null;
    editClickPos?: { x: number; y: number } | null;
    isPanActive: boolean;
    isCanvasPanning: boolean;
    onHover: (id: string | null) => void;
    onChildMouseDown: (e: MouseEvent, child: CanvasElement) => void;
    onStartEdit: (el: CanvasElement, e?: MouseEvent) => void;
    onStopEdit: () => void;
  } = $props();

  const isChildSelected = $derived(editor.selectedId === child.id);
  const isEditingChild = $derived(editingElementId === child.id);
  const subChildren = $derived(
    child.type === "frame"
      ? editor.resolvedElements.filter((c) => c.parentId === child.id && !c.hidden)
      : []
  );
  const widthMode = $derived(child.widthMode || "fixed");
  const heightMode = $derived(child.heightMode || "fixed");
  const childTotalW = $derived(getElTotalWidth(child));
  const childTotalH = $derived(getElTotalHeight(child));
  const wText = $derived(
    widthMode === "fill" ? "Penuh" : widthMode === "hug" ? "Ikuti" : `${child.width}px`
  );
  const hText = $derived(
    heightMode === "fill" ? "Penuh" : heightMode === "hug" ? "Ikuti" : `${child.height}px`
  );
</script>

<div
  role="button"
  tabindex={isEditingChild ? -1 : 0}
  onmouseenter={(e) => {
    e.stopPropagation();
    onHover(child.id);
  }}
  onmouseleave={() => {
    if (hoveredElementId === child.id) onHover(null);
  }}
  onmousedown={(e) => onChildMouseDown(e, child)}
  ondblclick={(e) => {
    e.preventDefault();
    e.stopPropagation();
    onStartEdit(child, e);
  }}
  class="relative max-w-full min-w-0 {widthMode === 'fill'
    ? 'w-full'
    : widthMode === 'hug'
      ? 'w-auto shrink-0'
      : 'shrink-0'} {heightMode === 'fill'
    ? 'h-full min-h-0 self-stretch'
    : heightMode === 'hug'
      ? 'h-auto'
      : ''} {isChildSelected ? 'z-20' : ''}"
  style="
    box-sizing: border-box;
    {widthMode === 'fixed'
    ? `width: ${childTotalW}px; max-width: 100%;`
    : widthMode === 'hug'
      ? `width: fit-content; max-width: 100%;`
      : `width: 100%; max-width: 100%; min-width: 0;`}
    {heightMode === 'fixed'
    ? (child.type === 'image' || child.type === 'youtube') &&
      widthMode === 'fixed' &&
      childTotalW > 0
      ? `height: auto; aspect-ratio: ${childTotalW} / ${childTotalH};`
      : child.type === 'image' || child.type === 'icon' || child.type === 'youtube'
        ? `height: ${childTotalH}px; min-height: ${childTotalH}px;`
        : `height: auto; min-height: ${childTotalH}px;`
    : heightMode === 'hug'
      ? child.type === 'frame' && subChildren.length === 0
        ? `height: auto; min-height: ${(child.height || 80) + (child.paddingTop ?? child.padding ?? 0) + (child.paddingBottom ?? child.padding ?? 0)}px;`
        : `height: auto; min-height: fit-content;`
      : `height: 100%; min-height: 0; align-self: stretch;`}
    {child.type !== 'frame' ? 'display: flex; align-items: center;' : ''}
    {child.type === 'button' ? 'justify-content: center;' : ''}
    background-color: {child.fill};
    border-radius: {child.borderRadius}px;
    border-width: {child.borderWidth}px;
    border-color: {child.borderColor};
    border-style: {child.borderStyle};
    opacity: {child.opacity / 100};
    color: {child.color || 'inherit'};
    font-size: {child.fontSize ? child.fontSize + 'px' : 'inherit'};
    font-weight: {child.fontWeight || 'normal'};
    font-family: {child.fontFamily || 'Poppins'};
    text-align: {child.textAlign || 'left'};
    {child.type !== 'frame' ? getPaddingCss(child) : ''}
    {getMarginCss(child)}
    cursor: {isCanvasPanning
    ? 'grabbing'
    : isPanActive
      ? 'grab'
      : editor.isPreviewMode
        ? 'default'
        : child.locked
          ? 'not-allowed'
          : (child.type === 'heading' || child.type === 'text') && isChildSelected
            ? 'text'
            : 'pointer'};
  "
>
  {#if child.type === "frame"}
    <div
      class="flex w-full min-w-0 overflow-hidden {child.flexDirection === 'column'
        ? 'flex-col'
        : 'flex-row'}"
      style="
        min-height: {heightMode === 'fixed'
        ? `${childTotalH}px`
        : subChildren.length === 0
          ? `${childTotalH || 80}px`
          : 'fit-content'};
        justify-content: {child.justifyContent || 'flex-start'};
        align-items: {child.alignItems || 'center'};
        {getGapCss(child)}
        {getPaddingCss(child)}
        flex-wrap: wrap;
      "
    >
      {#each subChildren as subChild (subChild.id)}
        <CanvasChildItem
          {editor}
          child={subChild}
          {hoveredElementId}
          {editingElementId}
          {editClickPos}
          {isPanActive}
          {isCanvasPanning}
          {onHover}
          {onChildMouseDown}
          {onStartEdit}
          {onStopEdit}
        />
      {/each}
    </div>
  {:else}
    <CanvasLeafContent
      {editor}
      el={child}
      isSelected={isChildSelected}
      isEditing={isEditingChild}
      {editClickPos}
      {onStopEdit}
    />
  {/if}

  {#if (isChildSelected || (hoveredElementId === child.id && !child.locked && !isPanActive)) && !editor.isPreviewMode}
    <div
      class="pointer-events-none absolute -inset-px z-30 border border-[#0d99ff]"
      style="border-radius: {Math.max(0, (child.borderRadius || 0) + 1)}px;"
    ></div>
  {/if}

  {#if isChildSelected && !editor.isPreviewMode}
    <div
      class="pointer-events-none absolute -top-5 left-1/2 z-40 -translate-x-1/2 rounded bg-[#0d99ff] px-1.5 py-0.5 font-mono text-[9px] font-medium whitespace-nowrap text-white"
    >
      {child.name}
    </div>
    <div
      class="pointer-events-none absolute -bottom-5 left-1/2 z-40 -translate-x-1/2 rounded bg-[#0d99ff] px-1.5 py-0.5 font-mono text-[9px] font-medium whitespace-nowrap text-white"
    >
      {wText} × {hText}
    </div>
  {/if}
</div>
