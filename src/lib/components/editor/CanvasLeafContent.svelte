<script lang="ts">
  import Icon from "@iconify/svelte";

  import { toYouTubeEmbedUrl } from "./youtube-utils";

  import type { CanvasElement } from "./types";

  let { el, isSelected }: { el: CanvasElement; isSelected: boolean } = $props();
</script>

{#if el.type === "heading"}
  <h2
    class="flex w-full items-center leading-tight tracking-tight {isSelected
      ? 'cursor-text select-text'
      : 'select-none'}"
  >
    {el.content}
  </h2>
{:else if el.type === "text"}
  <p class="w-full leading-relaxed {isSelected ? 'cursor-text select-text' : 'select-none'}">
    {el.content}
  </p>
{:else if el.type === "button" || el.type === "badge"}
  <div class="flex w-full items-center justify-center font-semibold select-none">
    {el.content}
  </div>
{:else if el.type === "link"}
  <span
    class="pointer-events-none flex w-full items-center underline-offset-4 select-none hover:underline"
  >
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
