<script lang="ts">
  import Icon from "@iconify/svelte";

  import { enhance } from "$app/forms";

  import Textfield from "#lib/components/Textfield.svelte";
  import { isSlugReserved } from "#lib/constants/reserved-slugs";
  import { getRequiredErrors } from "#lib/utils/form-validation";
  import { normalizeSlug } from "#lib/utils/slug";

  let { onClose }: { onClose: () => void } = $props();

  let title = $state("");
  let slugInput = $state("");
  let slugEdited = $state(false);
  let description = $state("");
  let status = $state<"draft" | "published">("draft");
  let hasSubmitted = $state(false);
  let isSubmitting = $state(false);
  let serverFieldErrors = $state<{ title?: string; slug?: string }>({});

  $effect(() => {
    if (!slugEdited) {
      slugInput = normalizeSlug(title);
    }
  });

  const effectiveSlug = $derived(normalizeSlug(slugInput));
  const isReserved = $derived(effectiveSlug ? isSlugReserved(effectiveSlug) : false);

  const titleErrors = $derived(
    getRequiredErrors(title, "Judul halaman", hasSubmitted, serverFieldErrors.title)
  );

  const slugErrors = $derived.by(() => {
    if (isReserved) {
      return [`Slug "/${effectiveSlug}" dicadangkan untuk rute sistem (seperti login/dashboard).`];
    }
    if (hasSubmitted && !effectiveSlug) {
      return ["Slug URL wajib diisi."];
    }
    return serverFieldErrors.slug ? [serverFieldErrors.slug] : [];
  });
</script>

<div
  role="dialog"
  aria-modal="true"
  class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs"
>
  <div class="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6">
    <div class="flex items-center justify-between border-b border-gray-100 pb-4">
      <div class="flex items-center gap-2.5">
        <div
          class="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 text-[#0d99ff]"
        >
          <Icon icon="lucide:file-plus" class="h-4 w-4" />
        </div>
        <div>
          <h3 class="text-sm font-bold text-gray-900">Buat Halaman Baru</h3>
          <p class="text-[11px] text-gray-500">Halaman kustom dapat diakses di /[slug]</p>
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
      action="?/create"
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
            return;
          }
          if (result.type === "success" || result.type === "redirect") {
            hasSubmitted = false;
            onClose();
          }
          await update({ reset: false });
        };
      }}
      class="mt-5 space-y-4"
    >
      <Textfield
        id="create-page-title"
        name="title"
        label="Judul Halaman"
        required
        bind:value={title}
        placeholder="Contoh: Tentang Kami"
        isError={titleErrors.length > 0}
        supporting={titleErrors}
        oninput={() => {
          serverFieldErrors = { ...serverFieldErrors, title: undefined, slug: undefined };
        }}
      />

      <Textfield
        id="create-page-slug"
        name="slug"
        label="Slug URL"
        prefix="/"
        required
        bind:value={slugInput}
        placeholder="tentang-kami"
        inputClass="font-mono"
        isError={slugErrors.length > 0}
        supporting={slugErrors.length > 0
          ? slugErrors
          : effectiveSlug
            ? [`URL publik: /${effectiveSlug}`]
            : []}
        oninput={() => {
          slugEdited = true;
          serverFieldErrors = { ...serverFieldErrors, slug: undefined };
        }}
      />

      <div>
        <div class="flex items-center justify-between">
          <label for="create-page-description" class="block text-xs font-semibold text-gray-700">
            Metadata Description
          </label>
          <span class="text-[11px] text-gray-400">{description.length}/160</span>
        </div>
        <textarea
          id="create-page-description"
          name="description"
          rows={3}
          bind:value={description}
          placeholder="Ringkasan singkat halaman untuk SEO dan metadata..."
          class="mt-1.5 w-full resize-none rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm text-gray-900 focus:border-[#0d99ff] focus:ring-1 focus:ring-[#0d99ff] focus:outline-none"
        ></textarea>
      </div>

      <div>
        <label for="create-page-status" class="block text-xs font-semibold text-gray-700">
          Status Awal
        </label>
        <select
          id="create-page-status"
          name="status"
          bind:value={status}
          class="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 focus:border-[#0d99ff] focus:outline-none"
        >
          <option value="draft">Draft (Belum Publik)</option>
          <option value="published">Published (Langsung Publik)</option>
        </select>
      </div>

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
          {isSubmitting ? "Menyimpan..." : "Tambah"}
        </button>
      </div>
    </form>
  </div>
</div>
