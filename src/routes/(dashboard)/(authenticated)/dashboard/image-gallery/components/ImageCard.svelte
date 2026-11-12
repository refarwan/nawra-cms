<script lang="ts">
  import { formatFileSize } from "#lib/utils/image-resize";

  import type { ImageLibraryItem } from "#db/schema";

  let {
    item,
    onClick
  }: {
    item: ImageLibraryItem;
    onClick: () => void;
  } = $props();
</script>

<button
  type="button"
  onclick={onClick}
  class="group flex cursor-pointer flex-col overflow-hidden rounded-xl border border-gray-200 bg-white text-left transition-colors hover:border-[#0d99ff]"
>
  <div class="relative aspect-square w-full overflow-hidden bg-gray-50">
    <img
      src={item.url}
      alt={item.altText || item.name}
      class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
    />
    <span
      class="absolute top-2 right-2 rounded-full border px-2 py-0.5 text-[10px] font-semibold {item.isResized
        ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
        : 'border-gray-200 bg-white/90 text-gray-700'}"
    >
      {item.isResized ? "WebP Resized" : "Asli"}
    </span>
  </div>

  <div class="p-3">
    <p class="truncate text-sm font-semibold text-gray-900">{item.name}</p>
    <div class="mt-1 flex items-center justify-between text-[11px] text-gray-500">
      <span>{item.width}×{item.height}</span>
      <span>{formatFileSize(item.size)}</span>
    </div>
  </div>
</button>
