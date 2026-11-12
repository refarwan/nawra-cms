<script lang="ts">
  import Icon from "@iconify/svelte";

  import { placeCaretAtPoint } from "./canvas-view-utils";
  import { toYouTubeEmbedUrl } from "./youtube-utils";

  import type { EditorState } from "./editor-state.svelte";
  import type { CanvasElement } from "./types";

  let {
    editor,
    el,
    isSelected,
    isEditing = false,
    editClickPos = null,
    onStopEdit
  }: {
    editor: EditorState;
    el: CanvasElement;
    isSelected: boolean;
    isEditing?: boolean;
    editClickPos?: { x: number; y: number } | null;
    onStopEdit?: () => void;
  } = $props();

  const editClass = $derived(
    el.type === "heading"
      ? "leading-tight tracking-tight"
      : el.type === "text"
        ? "leading-relaxed whitespace-pre-wrap"
        : el.type === "link"
          ? "underline-offset-4"
          : "font-semibold"
  );

  function editableAction(node: HTMLElement, initialText: string) {
    node.innerText = initialText;
    node.focus();
    placeCaretAtPoint(node, editClickPos?.x, editClickPos?.y);
    requestAnimationFrame(() => {
      if (document.activeElement === node) {
        placeCaretAtPoint(node, editClickPos?.x, editClickPos?.y);
      }
    });
    return { update() {} };
  }

  function onInput(e: Event) {
    editor.updateElement(el.id, { content: (e.currentTarget as HTMLElement).innerText });
  }

  function onBlur() {
    editor.commitUpdate();
    onStopEdit?.();
  }

  function onKeydown(e: KeyboardEvent) {
    e.stopPropagation();
    if (e.key === "Escape" || (e.key === "Enter" && el.type !== "text")) {
      e.preventDefault();
      (e.currentTarget as HTMLElement).blur();
    }
  }
</script>

{#if isEditing}
  <div
    role="textbox"
    tabindex="0"
    aria-label="Edit teks {el.name}"
    aria-multiline={el.type === "text"}
    contenteditable="true"
    use:editableAction={el.content || ""}
    oninput={onInput}
    onblur={onBlur}
    onkeydown={onKeydown}
    onmousedown={(e) => e.stopPropagation()}
    style="user-select: text; -webkit-user-select: text;"
    class="w-full cursor-text outline-none select-text {editClass}"
  ></div>
{:else if el.type === "heading"}
  <h2
    class="w-full leading-tight tracking-tight {isSelected
      ? 'cursor-text select-text'
      : 'select-none'}"
  >
    {el.content}
  </h2>
{:else if el.type === "text"}
  <p
    class="w-full leading-relaxed whitespace-pre-wrap {isSelected
      ? 'cursor-text select-text'
      : 'select-none'}"
  >
    {el.content}
  </p>
{:else if el.type === "button" || el.type === "badge"}
  <div class="w-full font-semibold select-none">
    {el.content}
  </div>
{:else if el.type === "link"}
  <span class="pointer-events-none block w-full underline-offset-4 select-none hover:underline">
    {el.content}
  </span>
{:else if el.type === "image"}
  <img
    src={el.src ||
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=800&auto=format&fit=crop&q=80"}
    alt={el.alt || el.name}
    class="pointer-events-none h-full w-full object-cover select-none"
    style="border-radius: inherit;"
  />
{:else if el.type === "icon"}
  <div
    class="pointer-events-none flex h-full w-full items-center justify-center p-0.5 select-none"
    style="color: {el.color || '#0d99ff'};"
  >
    <Icon
      icon={el.icon || el.content || "lucide:smile"}
      class="h-full max-h-full w-full max-w-full"
    />
  </div>
{:else if el.type === "youtube"}
  <div class="relative h-full w-full overflow-hidden rounded bg-black">
    <iframe
      title={el.name}
      src={toYouTubeEmbedUrl(el.src)}
      class="pointer-events-none h-full w-full border-0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    ></iframe>
  </div>
{:else}
  <div class="h-full w-full"></div>
{/if}
