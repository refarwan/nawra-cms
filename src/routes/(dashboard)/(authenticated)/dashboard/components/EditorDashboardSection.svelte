<script lang="ts">
  import Icon from "@iconify/svelte";

  import { resolve } from "$app/paths";

  import RecentArticlesCard from "./RecentArticlesCard.svelte";

  type EditorStats = {
    myTotalArticles: number;
    myPublishedArticles: number;
    myDraftArticles: number;
    myCategories: number;
    totalCategories: number;
    myImages: number;
    totalImages: number;
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
    stats: EditorStats;
    recentArticles: RecentArticle[];
  } = $props();

  const quickLinks = [
    {
      label: "Daftar Artikel",
      desc: "Tulis, sunting, dan terbitkan artikel",
      href: resolve("/(dashboard)/(authenticated)/dashboard/article"),
      icon: "lucide:file-text",
      color: "bg-sky-50 text-sky-600"
    },
    {
      label: "Kategori Artikel",
      desc: "Kelola pengelompokan topik artikel",
      href: resolve("/(dashboard)/(authenticated)/dashboard/article-category"),
      icon: "lucide:folder-tree",
      color: "bg-emerald-50 text-emerald-600"
    },
    {
      label: "Galeri Gambar",
      desc: "Unggah dan kelola aset gambar konten",
      href: resolve("/(dashboard)/(authenticated)/dashboard/image-gallery"),
      icon: "lucide:image",
      color: "bg-amber-50 text-amber-600"
    },
    {
      label: "Pengaturan Akun",
      desc: "Perbarui profil dan kata sandi Anda",
      href: resolve("/(dashboard)/(authenticated)/dashboard/my-account"),
      icon: "lucide:user-cog",
      color: "bg-gray-100 text-gray-600"
    }
  ];
</script>

<!-- Statistik Konten (Editor) -->
<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
  <a
    href={resolve("/(dashboard)/(authenticated)/dashboard/article")}
    class="group rounded-2xl border border-gray-200/80 bg-white p-5 transition-colors hover:border-sky-300"
  >
    <div class="flex items-center justify-between">
      <span class="text-xs font-semibold tracking-wide text-gray-500 uppercase">Artikel Saya</span>
      <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
        <Icon icon="lucide:file-text" class="h-4.5 w-4.5" />
      </div>
    </div>
    <p class="mt-3 text-2xl font-bold text-gray-900">{stats.myTotalArticles}</p>
    <p class="mt-1 text-xs text-gray-500">
      {stats.myPublishedArticles} terbit · {stats.myDraftArticles} draf
    </p>
  </a>

  <a
    href={resolve("/(dashboard)/(authenticated)/dashboard/article")}
    class="group rounded-2xl border border-gray-200/80 bg-white p-5 transition-colors hover:border-emerald-300"
  >
    <div class="flex items-center justify-between">
      <span class="text-xs font-semibold tracking-wide text-gray-500 uppercase">Artikel Terbit</span
      >
      <div
        class="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600"
      >
        <Icon icon="lucide:check-circle-2" class="h-4.5 w-4.5" />
      </div>
    </div>
    <p class="mt-3 text-2xl font-bold text-gray-900">{stats.myPublishedArticles}</p>
    <p class="mt-1 text-xs text-gray-500">Sudah dipublikasikan</p>
  </a>

  <a
    href={resolve("/(dashboard)/(authenticated)/dashboard/article-category")}
    class="group rounded-2xl border border-gray-200/80 bg-white p-5 transition-colors hover:border-indigo-300"
  >
    <div class="flex items-center justify-between">
      <span class="text-xs font-semibold tracking-wide text-gray-500 uppercase">Kategori</span>
      <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
        <Icon icon="lucide:folder-tree" class="h-4.5 w-4.5" />
      </div>
    </div>
    <p class="mt-3 text-2xl font-bold text-gray-900">{stats.totalCategories}</p>
    <p class="mt-1 text-xs text-gray-500">{stats.myCategories} dibuat oleh Anda</p>
  </a>

  <a
    href={resolve("/(dashboard)/(authenticated)/dashboard/image-gallery")}
    class="group rounded-2xl border border-gray-200/80 bg-white p-5 transition-colors hover:border-amber-300"
  >
    <div class="flex items-center justify-between">
      <span class="text-xs font-semibold tracking-wide text-gray-500 uppercase"
        >Unggahan Gambar</span
      >
      <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
        <Icon icon="lucide:image" class="h-4.5 w-4.5" />
      </div>
    </div>
    <p class="mt-3 text-2xl font-bold text-gray-900">{stats.myImages}</p>
    <p class="mt-1 text-xs text-gray-500">Dari {stats.totalImages} total di galeri</p>
  </a>
</div>

<!-- Artikel Terbaru Saya & Akses Cepat -->
<div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
  <RecentArticlesCard
    articles={recentArticles}
    title="Artikel Terbaru Saya"
    emptyMessage="Anda belum memiliki artikel. Mulai tulis artikel pertama Anda."
  />

  <div class="rounded-2xl border border-gray-200/80 bg-white p-6">
    <h3 class="mb-4 text-base font-bold text-gray-900">Akses Cepat Editor</h3>
    <div class="space-y-3">
      {#each quickLinks as item (item.href)}
        <a
          href={item.href}
          class="flex items-center justify-between gap-3 rounded-xl border border-gray-100 p-3.5 transition-colors hover:border-gray-200 hover:bg-gray-50/70"
        >
          <div class="flex min-w-0 items-center gap-3">
            <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg {item.color}">
              <Icon icon={item.icon} class="h-4 w-4" />
            </div>
            <div class="min-w-0">
              <p class="text-sm font-semibold text-gray-900">{item.label}</p>
              <p class="truncate text-xs text-gray-500">{item.desc}</p>
            </div>
          </div>
          <Icon icon="lucide:arrow-right" class="h-4 w-4 shrink-0 text-gray-400" />
        </a>
      {/each}
    </div>
  </div>
</div>
