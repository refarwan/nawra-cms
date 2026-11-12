<script lang="ts">
  import { generateHtmlFromElements } from "./html-generator";

  import type { EditorState } from "./editor-state.svelte";

  export interface EditorPreviewContext {
    headerHtml: string | null;
    footerHtml: string | null;
    homeHtml: string | null;
  }

  let {
    editor,
    previewContext
  }: {
    editor: EditorState;
    previewContext?: EditorPreviewContext | null;
  } = $props();

  const liveHtml = $derived(
    generateHtmlFromElements(editor.elements, editor.frame, editor.targetType ?? "homepage")
  );
  const isContentTarget = $derived(
    editor.targetType === "article" ||
      editor.targetType === "page" ||
      editor.targetType === "homepage" ||
      editor.targetType === "home"
  );

  const sections = $derived.by(() => {
    const list: { html: string; grow?: boolean }[] = [];
    if (editor.targetType === "header") {
      list.push({ html: liveHtml });
      if (previewContext?.homeHtml) list.push({ html: previewContext.homeHtml, grow: true });
      if (previewContext?.footerHtml) list.push({ html: previewContext.footerHtml });
      return list;
    }
    if (editor.targetType === "footer") {
      if (previewContext?.headerHtml) list.push({ html: previewContext.headerHtml });
      if (previewContext?.homeHtml) list.push({ html: previewContext.homeHtml, grow: true });
      list.push({ html: liveHtml });
      return list;
    }
    if (isContentTarget) {
      if (previewContext?.headerHtml) list.push({ html: previewContext.headerHtml });
      list.push({ html: liveHtml, grow: true });
      if (previewContext?.footerHtml) list.push({ html: previewContext.footerHtml });
      return list;
    }
    return [{ html: liveHtml, grow: true }];
  });
</script>

<div
  class="flex-1 overflow-auto bg-[#141414] p-6 select-none"
  style="background-image: radial-gradient(#2d2d2d 1px, transparent 1px); background-size: 20px 20px;"
>
  <div
    class="mx-auto flex min-h-full flex-col overflow-hidden rounded border border-[#2c2c2c] bg-white transition-all"
    style="width: {editor.frame.width}px; container-type: inline-size;"
  >
    {#each sections as section, index (index)}
      <div class="pointer-events-none {section.grow ? 'flex flex-1 flex-col' : ''}">
        <!-- eslint-disable-next-line svelte/no-at-html-tags -->
        {@html section.html}
      </div>
    {/each}
  </div>
</div>
