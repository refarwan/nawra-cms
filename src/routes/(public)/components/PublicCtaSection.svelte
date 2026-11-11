<script lang="ts">
  import Icon from "@iconify/svelte";

  import { resolve } from "$app/paths";
</script>

<div
  class="mt-24 rounded-2xl border border-neutral-800 bg-linear-to-b from-neutral-900/80 to-[#121215] p-8 text-center sm:p-12"
>
  <h3 class="text-2xl font-bold text-white sm:text-3xl">Siap Mulai Mendesain?</h3>
  <p class="mx-auto mt-3 max-w-lg text-sm text-neutral-400">
    Buka editor kanvas sekarang dan bangun pengalaman web tanpa repot koding.
  </p>
  <div class="mt-6 flex justify-center">
    <a
      href={resolve("/editor")}
      class="flex items-center gap-2 rounded-xl bg-[#0d99ff] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#0082df] active:scale-95"
    >
      <Icon icon="lucide:sparkles" class="h-4 w-4" />
      <span>Buka Editor Nawra CMS</span>
      <Icon icon="lucide:arrow-right" class="h-4 w-4" />
    </a>
  </div>
</div>
