<script lang="ts">
  import { resolve } from "$app/paths";
</script>

<footer
  class="border-t border-neutral-800/80 bg-[#111113] py-8 text-center text-xs text-neutral-500"
>
  <div
    class="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 sm:flex-row lg:px-12"
  >
    <div class="flex items-center gap-2">
      <div class="h-4 w-4 rounded bg-linear-to-tr from-[#0d99ff] to-[#ff4785]"></div>
      <span class="font-medium text-neutral-400">Nawra CMS Visual Studio</span>
    </div>
    <div class="flex items-center gap-6">
      <a href={resolve("/editor")} class="text-neutral-400 transition hover:text-[#0d99ff]">
        Buka Editor
      </a>
      <span>•</span>
      <span>Ditenagai Cloudflare Workers & D1</span>
    </div>
  </div>
</footer>
