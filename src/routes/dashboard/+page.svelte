<script lang="ts">
  import Icon from "@iconify/svelte";

  import { resolve } from "$app/paths";

  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();
</script>

<svelte:head>
  <title>Ringkasan Dashboard · Nawra CMS</title>
</svelte:head>

<div class="mx-auto max-w-6xl space-y-6">
  <!-- Welcome Banner -->
  <div class="rounded-2xl border border-gray-200/80 bg-white p-6 md:p-8">
    <div class="flex flex-col justify-between gap-4 md:flex-row md:items-center">
      <div>
        <h2 class="text-xl font-bold tracking-tight text-gray-900 md:text-2xl">
          Halo, {data.user?.name}! 👋
        </h2>
        <p class="mt-1 text-sm text-gray-500">
          Selamat datang di panel kontrol Nawra CMS. Kelola tata letak header, footer, dan konten
          website Anda.
        </p>
      </div>

      <div class="flex items-center gap-3">
        <a
          href={resolve("/dashboard/header")}
          class="flex items-center gap-2 rounded-xl bg-[#0d99ff] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#008ae6]"
        >
          <Icon icon="lucide:plus" class="h-4 w-4" />
          <span>Buat Header</span>
        </a>
        <a
          href={resolve("/dashboard/footer")}
          class="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-semibold text-gray-700 transition hover:bg-gray-50"
        >
          <Icon icon="lucide:plus" class="h-4 w-4" />
          <span>Buat Footer</span>
        </a>
      </div>
    </div>
  </div>

  <!-- Stat Grid -->
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
    <!-- Header Count -->
    <div class="rounded-2xl border border-gray-200/80 bg-white p-5">
      <div class="flex items-center justify-between text-gray-500">
        <span class="text-xs font-medium">Total Header</span>
        <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-[#0d99ff]">
          <Icon icon="lucide:panel-top" class="h-4 w-4" />
        </div>
      </div>
      <div class="mt-3 text-2xl font-bold text-gray-900">{data.stats.totalHeaders}</div>
      <a
        href={resolve("/dashboard/header")}
        class="mt-2 block text-xs font-medium text-[#0d99ff] hover:underline"
      >
        Lihat semua header &rarr;
      </a>
    </div>

    <!-- Active Header -->
    <div class="rounded-2xl border border-gray-200/80 bg-white p-5">
      <div class="flex items-center justify-between text-gray-500">
        <span class="text-xs font-medium">Header Aktif</span>
        <div
          class="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600"
        >
          <Icon icon="lucide:check-circle" class="h-4 w-4" />
        </div>
      </div>
      <div class="mt-3 truncate text-lg font-bold text-gray-900">
        {data.stats.activeHeaderTitle}
      </div>
      <span class="mt-2 block text-xs text-gray-400">Ditampilkan di publik</span>
    </div>

    <!-- Footer Count -->
    <div class="rounded-2xl border border-gray-200/80 bg-white p-5">
      <div class="flex items-center justify-between text-gray-500">
        <span class="text-xs font-medium">Total Footer</span>
        <div
          class="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 text-purple-600"
        >
          <Icon icon="lucide:panel-bottom" class="h-4 w-4" />
        </div>
      </div>
      <div class="mt-3 text-2xl font-bold text-gray-900">{data.stats.totalFooters}</div>
      <a
        href={resolve("/dashboard/footer")}
        class="mt-2 block text-xs font-medium text-purple-600 hover:underline"
      >
        Lihat semua footer &rarr;
      </a>
    </div>

    <!-- Active Footer -->
    <div class="rounded-2xl border border-gray-200/80 bg-white p-5">
      <div class="flex items-center justify-between text-gray-500">
        <span class="text-xs font-medium">Footer Aktif</span>
        <div
          class="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600"
        >
          <Icon icon="lucide:check-circle" class="h-4 w-4" />
        </div>
      </div>
      <div class="mt-3 truncate text-lg font-bold text-gray-900">
        {data.stats.activeFooterTitle}
      </div>
      <span class="mt-2 block text-xs text-gray-400">Ditampilkan di publik</span>
    </div>
  </div>

  <!-- Visual Editor Quick Launcher -->
  <div class="rounded-2xl border border-gray-200/80 bg-white p-6 md:p-8">
    <div class="flex flex-col justify-between gap-4 md:flex-row md:items-center">
      <div class="flex items-center gap-4">
        <div
          class="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0d99ff]/10 text-[#0d99ff]"
        >
          <Icon icon="lucide:layout-template" class="h-6 w-6" />
        </div>
        <div>
          <h3 class="text-base font-bold text-gray-900">Visual Page Builder & Editor</h3>
          <p class="text-xs text-gray-500">
            Kanvas interaktif dengan tata letak Flexbox modern, tipografi, dan kontrol styling
            langsung.
          </p>
        </div>
      </div>

      <a
        href={resolve("/editor")}
        class="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0d99ff] px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-[#008ae6]"
      >
        <span>Buka Visual Editor</span>
        <Icon icon="lucide:arrow-up-right" class="h-4 w-4" />
      </a>
    </div>
  </div>
</div>
