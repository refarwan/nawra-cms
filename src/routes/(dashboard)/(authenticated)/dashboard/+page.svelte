<script lang="ts">
  import Icon from "@iconify/svelte";

  import { resolve } from "$app/paths";

  import AdminDashboardSection from "./components/AdminDashboardSection.svelte";
  import EditorDashboardSection from "./components/EditorDashboardSection.svelte";

  import type { PageData } from "./$types";

  let { data }: { data: PageData } = $props();

  const isAdmin = $derived(data.user?.role === "admin");
</script>

<svelte:head>
  <title>Ringkasan Dashboard · {data.siteSettings.siteTitle}</title>
</svelte:head>

<div class="mx-auto max-w-6xl space-y-6">
  <!-- Welcome Banner -->
  <div class="rounded-2xl border border-gray-200/80 bg-white p-6 md:p-8">
    <div class="flex flex-col justify-between gap-4 md:flex-row md:items-center">
      <div>
        <div class="flex items-center gap-2.5">
          <h2 class="text-xl font-bold tracking-tight text-gray-900 md:text-2xl">
            Halo, {data.user?.name || data.user?.username}!
          </h2>
          <span
            class="rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize {isAdmin
              ? 'bg-sky-50 text-sky-700'
              : 'bg-emerald-50 text-emerald-700'}"
          >
            {data.user?.role}
          </span>
        </div>
        <p class="mt-1.5 text-sm text-gray-500">
          {#if isAdmin}
            Selamat datang di panel kontrol {data.siteSettings.siteTitle}. Kelola artikel, halaman,
            tata letak situs, akun editor, dan pengaturan website Anda.
          {:else}
            Selamat datang di panel kontrol {data.siteSettings.siteTitle}. Tulis dan kelola artikel,
            kategori artikel, serta aset galeri gambar Anda.
          {/if}
        </p>
      </div>

      <div class="flex flex-wrap gap-2.5">
        <a
          href={resolve("/(dashboard)/(authenticated)/dashboard/article")}
          class="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-sky-700"
        >
          <Icon icon="lucide:file-text" class="h-4 w-4" />
          Kelola Artikel
        </a>

        {#if isAdmin}
          <a
            href={resolve("/(dashboard)/(authenticated)/dashboard/page")}
            class="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
          >
            <Icon icon="lucide:file-code-2" class="h-4 w-4" />
            Kelola Halaman
          </a>
          <a
            href={resolve("/(dashboard)/(authenticated)/dashboard/site-setting")}
            class="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
          >
            <Icon icon="lucide:settings" class="h-4 w-4" />
            Pengaturan
          </a>
        {:else}
          <a
            href={resolve("/(dashboard)/(authenticated)/dashboard/image-gallery")}
            class="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
          >
            <Icon icon="lucide:image" class="h-4 w-4" />
            Galeri Gambar
          </a>
        {/if}
      </div>
    </div>
  </div>

  {#if isAdmin && data.adminStats}
    <AdminDashboardSection stats={data.adminStats} recentArticles={data.recentArticles} />
  {:else if data.editorStats}
    <EditorDashboardSection stats={data.editorStats} recentArticles={data.recentArticles} />
  {/if}
</div>
