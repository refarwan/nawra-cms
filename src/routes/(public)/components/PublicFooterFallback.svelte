<script lang="ts">
  import Icon from "@iconify/svelte";

  import { resolve } from "$app/paths";
</script>

<footer class="border-t border-gray-800 bg-gray-900 py-14 text-gray-400">
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div class="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
      <div>
        <div class="flex items-center gap-2.5">
          <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0d99ff] text-white">
            <Icon icon="lucide:sparkles" class="h-4 w-4" />
          </div>
          <span class="text-lg font-bold tracking-tight text-white">Nawra CMS</span>
        </div>
        <p class="mt-3 max-w-md text-sm leading-relaxed text-gray-400">
          Visual No-Code CMS Studio untuk membangun halaman web responsif dengan cepat dan
          menyimpannya langsung di jaringan Cloudflare D1.
        </p>
      </div>

      <div class="flex flex-wrap items-center gap-6 text-sm">
        <a href={resolve("/(public)")} class="transition-colors hover:text-white">Beranda</a>
        <a href="#fitur" class="transition-colors hover:text-white">Fitur Studio</a>
        <a href={resolve("/editor")} class="transition-colors hover:text-white">Coba Editor</a>
      </div>
    </div>

    <div
      class="mt-10 flex flex-col items-center justify-between gap-4 border-t border-gray-800 pt-8 text-xs text-gray-500 sm:flex-row"
    >
      <span
        >© {new Date().getFullYear()} Nawra CMS Visual Studio. Seluruh hak cipta dilindungi.</span
      >
      <span>Cloudflare Workers SSR • D1 Serverless Database</span>
    </div>
  </div>
</footer>
