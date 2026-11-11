<script lang="ts">
  import Icon from "@iconify/svelte";

  import { enhance } from "$app/forms";

  let { onClose }: { onClose: () => void } = $props();

  let title = $state("");
  let submitting = $state(false);
</script>

<div class="rounded-2xl border border-blue-200/80 bg-blue-50/40 p-5 md:p-6">
  <h2 class="text-sm font-bold text-gray-900">Form Header Baru</h2>
  <p class="mt-0.5 mb-4 text-xs text-gray-500">Beri nama untuk identitas header ini.</p>

  <form
    method="POST"
    action="?/create"
    use:enhance={() => {
      submitting = true;
      return async ({ update }) => {
        submitting = false;
        title = "";
        onClose();
        await update();
      };
    }}
    class="flex flex-col gap-3 sm:flex-row sm:items-center"
  >
    <input
      type="text"
      name="title"
      required
      bind:value={title}
      placeholder="Contoh: Header Navigasi Promo 2026"
      class="h-11 flex-1 rounded-xl border border-gray-200 bg-white px-4 text-xs text-gray-900 placeholder:text-gray-400 focus:border-[#0d99ff] focus:ring-1 focus:ring-[#0d99ff] focus:outline-none"
    />

    <button
      type="submit"
      disabled={submitting || !title.trim()}
      class="flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#0d99ff] px-5 text-xs font-semibold text-white transition hover:bg-[#008ae6] disabled:opacity-50"
    >
      <Icon icon="lucide:check" class="h-4 w-4" />
      <span>{submitting ? "Menyimpan..." : "Simpan Header"}</span>
    </button>
  </form>
</div>
