<script lang="ts">
  import Icon from "@iconify/svelte";

  import { enhance } from "$app/forms";

  let { onClose }: { onClose: () => void } = $props();
</script>

<div
  role="dialog"
  aria-modal="true"
  class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs"
>
  <div class="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6">
    <div class="flex items-center justify-between border-b border-gray-100 pb-4">
      <div class="flex items-center gap-2.5">
        <div
          class="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 text-[#0d99ff]"
        >
          <Icon icon="lucide:plus" class="h-4 w-4" />
        </div>
        <div>
          <h3 class="text-sm font-bold text-gray-900">Tambah Footer Baru</h3>
          <p class="text-[11px] text-gray-500">Buat template footer baru dengan dasar putih</p>
        </div>
      </div>

      <button
        type="button"
        onclick={onClose}
        class="cursor-pointer rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
      >
        <Icon icon="lucide:x" class="h-4 w-4" />
      </button>
    </div>

    <form
      method="POST"
      action="?/create"
      use:enhance={() => {
        return async ({ result, update }) => {
          await update();
          if (result.type === "success") onClose();
        };
      }}
      class="mt-5 space-y-4"
    >
      <div>
        <label for="create-footer-title" class="block text-xs font-semibold text-gray-700">
          Judul Footer
        </label>
        <input
          id="create-footer-title"
          type="text"
          name="title"
          required
          placeholder="Contoh: Footer Utama / Minimalis"
          class="mt-1.5 w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm text-gray-900 focus:border-[#0d99ff] focus:outline-none"
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
          class="cursor-pointer rounded-xl bg-[#0d99ff] px-4 py-2 text-xs font-semibold text-white hover:bg-[#008ae6]"
        >
          Simpan Template
        </button>
      </div>
    </form>
  </div>
</div>
