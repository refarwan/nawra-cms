<script lang="ts">
  import Icon from "@iconify/svelte";

  import { resolve } from "$app/paths";

  type RecentArticle = {
    id: string;
    title: string;
    slug: string;
    status: "draft" | "published";
    updatedAt: number;
  };

  let {
    articles,
    title = "Artikel Terbaru",
    emptyMessage = "Belum ada artikel yang dibuat."
  }: {
    articles: RecentArticle[];
    title?: string;
    emptyMessage?: string;
  } = $props();

  function formatDate(timestamp: number): string {
    return new Date(timestamp).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  }
</script>

<div class="rounded-2xl border border-gray-200/80 bg-white p-6">
  <div class="mb-4 flex items-center justify-between">
    <h3 class="text-base font-bold text-gray-900">{title}</h3>
    <a
      href={resolve("/(dashboard)/(authenticated)/dashboard/article")}
      class="inline-flex items-center gap-1 text-xs font-semibold text-sky-600 transition-colors hover:text-sky-700"
    >
      Kelola Artikel
      <Icon icon="lucide:arrow-right" class="h-3.5 w-3.5" />
    </a>
  </div>

  {#if articles.length === 0}
    <div
      class="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 py-8 text-center"
    >
      <Icon icon="lucide:file-text" class="mb-2 h-7 w-7 text-gray-300" />
      <p class="text-sm text-gray-500">{emptyMessage}</p>
    </div>
  {:else}
    <div class="divide-y divide-gray-100">
      {#each articles as article (article.id)}
        <div class="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
          <div class="min-w-0 flex-1">
            <p class="truncate text-sm font-semibold text-gray-900">{article.title}</p>
            <div class="mt-0.5 flex items-center gap-2 text-xs text-gray-400">
              <span class="truncate">/{article.slug}</span>
              <span>•</span>
              <span class="inline-flex items-center gap-1">
                <Icon icon="lucide:clock" class="h-3 w-3" />
                {formatDate(article.updatedAt)}
              </span>
            </div>
          </div>
          <span
            class="shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium {article.status ===
            'published'
              ? 'bg-emerald-50 text-emerald-700'
              : 'bg-amber-50 text-amber-700'}"
          >
            {article.status === "published" ? "Terbit" : "Draf"}
          </span>
        </div>
      {/each}
    </div>
  {/if}
</div>
