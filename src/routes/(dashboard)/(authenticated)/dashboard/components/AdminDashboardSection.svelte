<script lang="ts">
  import Icon from "@iconify/svelte";

  import { resolve } from "$app/paths";

  import RecentArticlesCard from "./RecentArticlesCard.svelte";

  type AdminStats = {
    totalArticles: number;
    publishedArticles: number;
    draftArticles: number;
    totalCategories: number;
    totalPages: number;
    publishedPages: number;
    draftPages: number;
    totalImages: number;
    totalEditors: number;
    totalHomes: number;
    activeHomeTitle: string;
    totalHeaders: number;
    activeHeaderTitle: string;
    totalFooters: number;
    activeFooterTitle: string;
  };

  type RecentArticle = {
    id: string;
    title: string;
    slug: string;
    status: "draft" | "published";
    updatedAt: number;
  };

  let {
    stats,
    recentArticles
  }: {
    stats: AdminStats;
    recentArticles: RecentArticle[];
  } = $props();

  const statCards = $derived([
    {
      label: "Artikel",
      value: stats.totalArticles,
      sub: `${stats.publishedArticles} terbit · ${stats.draftArticles} draf`,
      href: resolve("/(dashboard)/(authenticated)/dashboard/article"),
      icon: "lucide:file-text",
      iconClass: "bg-sky-50 text-sky-600",
      hoverClass: "hover:border-sky-300"
    },
    {
      label: "Kategori",
      value: stats.totalCategories,
      sub: "Kategori artikel",
      href: resolve("/(dashboard)/(authenticated)/dashboard/article-category"),
      icon: "lucide:folder-tree",
      iconClass: "bg-emerald-50 text-emerald-600",
      hoverClass: "hover:border-emerald-300"
    },
    {
      label: "Halaman",
      value: stats.totalPages,
      sub: `${stats.publishedPages} terbit · ${stats.draftPages} draf`,
      href: resolve("/(dashboard)/(authenticated)/dashboard/page"),
      icon: "lucide:file-code-2",
      iconClass: "bg-indigo-50 text-indigo-600",
      hoverClass: "hover:border-indigo-300"
    },
    {
      label: "Galeri",
      value: stats.totalImages,
      sub: "Gambar tersimpan",
      href: resolve("/(dashboard)/(authenticated)/dashboard/image-gallery"),
      icon: "lucide:image",
      iconClass: "bg-amber-50 text-amber-600",
      hoverClass: "hover:border-amber-300"
    },
    {
      label: "Editor",
      value: stats.totalEditors,
      sub: "Akun editor aktif",
      href: resolve("/(dashboard)/(authenticated)/dashboard/editor"),
      icon: "lucide:users",
      iconClass: "bg-rose-50 text-rose-600",
      hoverClass: "hover:border-rose-300"
    }
  ]);

  const themeItems = $derived([
    {
      label: "Laman Utama Aktif",
      value: stats.activeHomeTitle,
      total: `${stats.totalHomes} template`,
      href: resolve("/(dashboard)/(authenticated)/dashboard/home"),
      icon: "lucide:home",
      color: "bg-sky-50 text-sky-600"
    },
    {
      label: "Header Aktif",
      value: stats.activeHeaderTitle,
      total: `${stats.totalHeaders} template`,
      href: resolve("/(dashboard)/(authenticated)/dashboard/header"),
      icon: "lucide:layout-template",
      color: "bg-indigo-50 text-indigo-600"
    },
    {
      label: "Footer Aktif",
      value: stats.activeFooterTitle,
      total: `${stats.totalFooters} template`,
      href: resolve("/(dashboard)/(authenticated)/dashboard/footer"),
      icon: "lucide:panel-bottom",
      color: "bg-violet-50 text-violet-600"
    }
  ]);
</script>

<!-- Statistik Konten & Pengguna (Admin) -->
<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
  {#each statCards as card (card.href)}
    <a
      href={card.href}
      class="group rounded-2xl border border-gray-200/80 bg-white p-5 transition-colors {card.hoverClass}"
    >
      <div class="flex items-center justify-between">
        <span class="text-xs font-semibold tracking-wide text-gray-500 uppercase">{card.label}</span
        >
        <div class="flex h-9 w-9 items-center justify-center rounded-xl {card.iconClass}">
          <Icon icon={card.icon} class="h-4.5 w-4.5" />
        </div>
      </div>
      <p class="mt-3 text-2xl font-bold text-gray-900">{card.value}</p>
      <p class="mt-1 text-xs text-gray-500">{card.sub}</p>
    </a>
  {/each}
</div>

<!-- Artikel Terbaru & Status Tema -->
<div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
  <RecentArticlesCard articles={recentArticles} title="Artikel Terbaru" />

  <div class="rounded-2xl border border-gray-200/80 bg-white p-6">
    <div class="mb-4 flex items-center justify-between">
      <h3 class="text-base font-bold text-gray-900">Status Tema & Pengaturan</h3>
      <a
        href={resolve("/(dashboard)/(authenticated)/dashboard/site-setting")}
        class="inline-flex items-center gap-1 text-xs font-semibold text-gray-600 transition-colors hover:text-gray-900"
      >
        <Icon icon="lucide:settings" class="h-3.5 w-3.5" />
        Pengaturan Situs
      </a>
    </div>

    <div class="space-y-3">
      {#each themeItems as item (item.href)}
        <a
          href={item.href}
          class="flex items-center justify-between gap-3 rounded-xl border border-gray-100 p-3.5 transition-colors hover:border-gray-200 hover:bg-gray-50/70"
        >
          <div class="flex min-w-0 items-center gap-3">
            <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg {item.color}">
              <Icon icon={item.icon} class="h-4 w-4" />
            </div>
            <div class="min-w-0">
              <p class="text-xs font-medium text-gray-500">{item.label}</p>
              <p class="truncate text-sm font-semibold text-gray-900">{item.value}</p>
            </div>
          </div>
          <div class="flex shrink-0 items-center gap-2">
            <span class="text-xs text-gray-400">{item.total}</span>
            <Icon icon="lucide:arrow-right" class="h-4 w-4 text-gray-400" />
          </div>
        </a>
      {/each}
    </div>

    <div class="mt-4 border-t border-gray-100 pt-4">
      <a
        href={resolve("/editor")}
        class="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-sky-200 bg-sky-50/70 px-4 py-2.5 text-sm font-semibold text-sky-700 transition-colors hover:bg-sky-100"
      >
        <Icon icon="lucide:paintbrush" class="h-4 w-4" />
        Buka Visual Page Builder
      </a>
    </div>
  </div>
</div>
