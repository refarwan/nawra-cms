<script lang="ts">
  import Icon from "@iconify/svelte";

  import { enhance } from "$app/forms";

  import { getRequiredErrors } from "#lib/utils/form-validation";
  import { normalizeSlug } from "#lib/utils/slug";

  import ArticleFormFields from "./ArticleFormFields.svelte";

  import type { ArticleRowItem } from "./ArticleTable.svelte";
  import type { CategoryOption } from "./ArticleToolbar.svelte";

  let {
    article,
    categories,
    onClose
  }: {
    article: ArticleRowItem;
    categories: CategoryOption[];
    onClose: () => void;
  } = $props();

  let title = $state("");
  let slug = $state("");
  let categoryId = $state("");
  let coverImage = $state("");
  let excerpt = $state("");
  let status = $state<"draft" | "published">("draft");
  let hasSubmitted = $state(false);
  let isSubmitting = $state(false);
  let serverFieldErrors = $state<{ title?: string; slug?: string }>({});

  $effect(() => {
    title = article.title;
    slug = article.slug;
    categoryId = article.categoryId ?? "";
    coverImage = article.coverImage ?? "";
    excerpt = article.excerpt ?? "";
    status = article.status;
    hasSubmitted = false;
    serverFieldErrors = {};
  });

  const normalized = $derived(normalizeSlug(slug));
  const titleErrors = $derived(
    getRequiredErrors(title, "Judul artikel", hasSubmitted, serverFieldErrors.title)
  );
  const slugErrors = $derived.by(() => {
    if (hasSubmitted && !normalized) return ["Slug artikel wajib diisi."];
    return serverFieldErrors.slug ? [serverFieldErrors.slug] : [];
  });
</script>

<div
  role="dialog"
  aria-modal="true"
  class="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4 backdrop-blur-xs"
>
  <div class="my-auto w-full max-w-2xl rounded-2xl border border-gray-200 bg-white p-6">
    <div class="flex items-center justify-between border-b border-gray-100 pb-4">
      <div class="flex items-center gap-2.5">
        <div
          class="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 text-[#0d99ff]"
        >
          <Icon icon="lucide:square-pen" class="h-4 w-4" />
        </div>
        <div>
          <h3 class="text-sm font-bold text-gray-900">Edit Artikel</h3>
          <p class="text-[11px] text-gray-500">Perbarui konten, kategori, dan status publikasi</p>
        </div>
      </div>

      <button
        type="button"
        onclick={onClose}
        class="cursor-pointer rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
      >
        <Icon icon="lucide:x" class="h-4 w-4" />
      </button>
    </div>

    <form
      method="POST"
      action="?/edit"
      novalidate
      use:enhance={({ cancel }) => {
        hasSubmitted = true;
        if (titleErrors.length > 0 || slugErrors.length > 0) {
          cancel();
          return;
        }
        isSubmitting = true;
        return async ({ result, update }) => {
          isSubmitting = false;
          if (result.type === "failure") {
            const data = result.data as { fieldErrors?: { title?: string; slug?: string } };
            serverFieldErrors = data?.fieldErrors ?? {};
            await update({ reset: false });
            return;
          }
          if (result.type === "success") {
            hasSubmitted = false;
            onClose();
          }
          await update({ reset: false });
        };
      }}
      class="mt-5 space-y-4"
    >
      <input type="hidden" name="id" value={article.id} />

      <ArticleFormFields
        idPrefix="edit-art"
        bind:title
        slugValue={slug}
        {titleErrors}
        {slugErrors}
        onTitleInput={() => {
          serverFieldErrors = { ...serverFieldErrors, title: undefined };
        }}
        onSlugInput={(val) => {
          slug = val;
          serverFieldErrors = { ...serverFieldErrors, slug: undefined };
        }}
        bind:categoryId
        bind:status
        bind:coverImage
        bind:excerpt
        {categories}
      />

      <div class="flex items-center justify-end gap-2 pt-2">
        <button
          type="button"
          onclick={onClose}
          class="cursor-pointer rounded-xl border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          class="cursor-pointer rounded-xl bg-[#0d99ff] px-4 py-2 text-xs font-semibold text-white hover:bg-[#008ae6] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "Menyimpan..." : "Simpan"}
        </button>
      </div>
    </form>
  </div>
</div>
