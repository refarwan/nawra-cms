<script lang="ts">
  import Icon from "@iconify/svelte";

  import { resolve } from "$app/paths";
  import { page } from "$app/state";

  const siteTitle = $derived(page.data.siteSettings?.siteTitle || "Nawra CMS");
  const isNotFound = $derived(page.status === 404);
</script>

<svelte:head>
  <title
    >{isNotFound ? "Halaman Tidak Ditemukan (404)" : `Error ${page.status}`} · {siteTitle}</title
  >
</svelte:head>

<div class="flex min-h-screen items-center justify-center bg-gray-50/80 px-4 py-12 font-sans">
  <div
    class="w-full max-w-lg rounded-2xl border border-gray-200/80 bg-white p-8 text-center sm:p-10"
  >
    <div
      class="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl {isNotFound
        ? 'bg-sky-50 text-[#0d99ff]'
        : 'bg-red-50 text-red-600'}"
    >
      <Icon icon={isNotFound ? "lucide:file-question" : "lucide:alert-triangle"} class="h-7 w-7" />
    </div>

    <span
      class="inline-flex items-center rounded-full px-3 py-1 text-xs font-bold tracking-wider uppercase {isNotFound
        ? 'bg-sky-50 text-sky-700'
        : 'bg-red-50 text-red-700'}"
    >
      Error {page.status}
    </span>

    <h1 class="mt-4 text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
      {isNotFound ? "Halaman Tidak Ditemukan" : "Terjadi Kesalahan"}
    </h1>

    <p class="mt-2.5 text-sm leading-relaxed text-gray-500">
      {#if isNotFound}
        Maaf, halaman yang Anda cari tidak tersedia, telah dihapus, atau alamat URL yang dimasukkan
        keliru.
      {:else}
        {page.error?.message || "Terjadi kendala saat memproses permintaan Anda."}
      {/if}
    </p>

    <div class="mt-7 flex flex-wrap items-center justify-center gap-3">
      <a
        href={resolve("/(public)")}
        class="inline-flex items-center gap-2 rounded-xl bg-[#0d99ff] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#008ae6]"
      >
        <Icon icon="lucide:home" class="h-4 w-4" />
        <span>Kembali ke Beranda</span>
      </a>

      <a
        href={resolve("/(public)/blog")}
        class="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
      >
        <Icon icon="lucide:book-open" class="h-4 w-4" />
        <span>Lihat Blog</span>
      </a>
    </div>
  </div>
</div>
