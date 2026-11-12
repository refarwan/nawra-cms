<script lang="ts">
  import Icon from "@iconify/svelte";

  import { popup } from "#lib/stores/popup.svelte";
</script>

{#each popup.items as item, index (item.id)}
  {#if item.type === "custom"}
    <div
      style={`z-index: ${100 + index}`}
      class="fixed inset-0 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs"
    >
      {@render item.component()}
    </div>
  {:else}
    <div
      style={`z-index: ${100 + index}`}
      class="fixed inset-0 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs select-none"
    >
      <div
        class="relative flex w-full max-w-105 flex-col gap-5 rounded-2xl border border-gray-200 bg-white p-6 md:px-7 md:py-6"
      >
        <!-- Header -->
        {#if item.type === "errorAlert"}
          <div class="flex items-center gap-3">
            <Icon icon="lucide:circle-x" class="h-8 w-8 shrink-0 text-red-600" />
            <h3 class="text-lg font-bold text-gray-900">{item.title ?? "Terjadi Kesalahan"}</h3>
          </div>
        {:else if item.type === "warningAlert"}
          <div class="flex items-center gap-3">
            <Icon icon="lucide:circle-alert" class="h-8 w-8 shrink-0 text-amber-500" />
            <h3 class="text-lg font-bold text-gray-900">{item.title ?? "Peringatan"}</h3>
          </div>
        {:else if item.type === "confirm"}
          <div class="flex items-center gap-3">
            <Icon icon="lucide:circle-help" class="h-8 w-8 shrink-0 text-sky-600" />
            <h3 class="text-lg font-bold text-gray-900">
              {item.title ?? "Konfirmasi Tindakan"}
            </h3>
          </div>
        {:else if item.type === "successAlert"}
          <div class="flex items-center gap-3">
            <Icon icon="lucide:circle-check-big" class="h-8 w-8 shrink-0 text-emerald-600" />
            <h3 class="text-lg font-bold text-gray-900">{item.title ?? "Berhasil"}</h3>
          </div>
        {:else}
          <div class="flex items-center">
            <h3 class="text-lg font-bold text-gray-900">{item.title ?? "Pemberitahuan"}</h3>
          </div>
        {/if}

        <hr class="border-gray-200" />

        <p class="text-left text-sm leading-relaxed whitespace-pre-line text-gray-600">
          {item.message}
        </p>

        <div class="flex items-center justify-end gap-3 pt-1">
          {#if item.type === "confirm"}
            <button
              type="button"
              onclick={() => {
                item.onCancel?.();
                popup.remove(item.id);
              }}
              class="cursor-pointer rounded-lg border border-gray-200 bg-gray-100 px-6 py-2.5 text-sm font-semibold text-gray-600 transition-all hover:bg-gray-200 active:scale-95"
            >
              {item.cancelText ?? "Batal"}
            </button>
            <button
              type="button"
              onclick={() => {
                item.onConfirm?.();
                popup.remove(item.id);
              }}
              class="cursor-pointer rounded-lg bg-sky-600 px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-sky-700 active:scale-95"
            >
              {item.confirmText ?? "Konfirmasi"}
            </button>
          {:else if item.type === "errorAlert"}
            <button
              type="button"
              onclick={() => {
                item.onConfirm?.();
                popup.remove(item.id);
              }}
              class="cursor-pointer rounded-lg bg-sky-600 px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-sky-700 active:scale-95"
            >
              {item.confirmText ?? "Tutup"}
            </button>
          {:else if item.type === "warningAlert"}
            <button
              type="button"
              onclick={() => {
                item.onConfirm?.();
                popup.remove(item.id);
              }}
              class="cursor-pointer rounded-lg bg-sky-600 px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-sky-700 active:scale-95"
            >
              {item.confirmText ?? "OK"}
            </button>
          {:else if item.type === "successAlert"}
            <button
              type="button"
              onclick={() => {
                item.onConfirm?.();
                popup.remove(item.id);
              }}
              class="cursor-pointer rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-emerald-700 active:scale-95"
            >
              {item.confirmText ?? "OK"}
            </button>
          {:else}
            <button
              type="button"
              onclick={() => {
                item.onConfirm?.();
                popup.remove(item.id);
              }}
              class="cursor-pointer rounded-lg bg-sky-600 px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-sky-700 active:scale-95"
            >
              {item.confirmText ?? "OK"}
            </button>
          {/if}
        </div>
      </div>
    </div>
  {/if}
{/each}
