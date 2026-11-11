<script lang="ts">
  import Icon from "@iconify/svelte";

  import { enhance } from "$app/forms";

  let {
    header,
    onClose
  }: {
    header: { id: string; title: string };
    onClose: () => void;
  } = $props();

  // svelte-ignore state_referenced_locally
  let title = $state(header.title);
  let submitting = $state(false);
</script>

<div
  role="dialog"
  aria-modal="true"
  class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
>
  <div class="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 text-gray-900">
    <div class="flex items-center justify-between">
      <h3 class="text-base font-bold text-gray-900">Ubah Nama Header</h3>
      <button
        type="button"
        onclick={onClose}
        class="cursor-pointer rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
      >
        <Icon icon="lucide:x" class="h-4 w-4" />
      </button>
    </div>

    <form
      method="POST"
      action="?/edit"
      use:enhance={() => {
        submitting = true;
        return async ({ update }) => {
          submitting = false;
          onClose();
          await update();
        };
      }}
      class="mt-4 space-y-4"
    >
      <input type="hidden" name="id" value={header.id} />

      <div>
        <label for="header-title-edit" class="block text-xs font-medium text-gray-700">
          Judul Header
        </label>
        <input
          id="header-title-edit"
          type="text"
          name="title"
          required
          bind:value={title}
          class="mt-1 h-10 w-full rounded-xl border border-gray-200 px-3 text-xs text-gray-900 focus:border-[#0d99ff] focus:ring-1 focus:ring-[#0d99ff] focus:outline-none"
        />
      </div>

      <div class="flex items-center justify-end gap-2 pt-2">
        <button
          type="button"
          onclick={onClose}
          class="cursor-pointer rounded-xl border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={submitting || !title.trim()}
          class="flex cursor-pointer items-center gap-1.5 rounded-xl bg-[#0d99ff] px-4 py-2 text-xs font-semibold text-white hover:bg-[#008ae6] disabled:opacity-50"
        >
          <Icon icon="lucide:check" class="h-3.5 w-3.5" />
          <span>{submitting ? "Menyimpan..." : "Simpan Perubahan"}</span>
        </button>
      </div>
    </form>
  </div>
</div>
