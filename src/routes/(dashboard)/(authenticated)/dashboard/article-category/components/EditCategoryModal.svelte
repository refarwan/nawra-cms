<script lang="ts">
  import Icon from "@iconify/svelte";

  import { enhance } from "$app/forms";

  import Textfield from "#lib/components/Textfield.svelte";
  import { getRequiredErrors } from "#lib/utils/form-validation";
  import { normalizeSlug } from "#lib/utils/slug";

  import type { CategoryRowItem } from "./CategoryTable.svelte";

  let { category, onClose }: { category: CategoryRowItem; onClose: () => void } = $props();

  let name = $state("");
  let slug = $state("");
  let description = $state("");
  let hasSubmitted = $state(false);
  let isSubmitting = $state(false);
  let serverFieldErrors = $state<{ name?: string; slug?: string }>({});

  $effect(() => {
    name = category.name;
    slug = category.slug;
    description = category.description ?? "";
    hasSubmitted = false;
    serverFieldErrors = {};
  });

  const normalized = $derived(normalizeSlug(slug));
  const nameErrors = $derived(
    getRequiredErrors(name, "Nama kategori", hasSubmitted, serverFieldErrors.name)
  );
  const slugErrors = $derived.by(() => {
    if (hasSubmitted && !normalized) return ["Slug kategori wajib diisi."];
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
          <Icon icon="lucide:square-pen" class="h-4 w-4" />
        </div>
        <div>
          <h3 class="text-sm font-bold text-gray-900">Edit Kategori Artikel</h3>
          <p class="text-[11px] text-gray-500">Perbarui nama, slug, dan deskripsi kategori</p>
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
        if (nameErrors.length > 0 || slugErrors.length > 0) {
          cancel();
          return;
        }
        isSubmitting = true;
        return async ({ result, update }) => {
          isSubmitting = false;
          if (result.type === "failure") {
            const data = result.data as { fieldErrors?: { name?: string; slug?: string } };
            serverFieldErrors = data?.fieldErrors ?? {};
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
      <input type="hidden" name="id" value={category.id} />

      <Textfield
        id="edit-cat-name"
        name="name"
        label="Nama Kategori"
        required
        bind:value={name}
        isError={nameErrors.length > 0}
        supporting={nameErrors}
        oninput={() => {
          serverFieldErrors = { ...serverFieldErrors, name: undefined };
        }}
      />

      <Textfield
        id="edit-cat-slug"
        name="slug"
        label="Slug Kategori"
        required
        bind:value={slug}
        inputClass="font-mono"
        isError={slugErrors.length > 0}
        supporting={slugErrors}
        oninput={() => {
          serverFieldErrors = { ...serverFieldErrors, slug: undefined };
        }}
      />

      <div>
        <label for="edit-cat-desc" class="block text-xs font-semibold text-gray-700">
          Deskripsi
        </label>
        <textarea
          id="edit-cat-desc"
          name="description"
          rows={3}
          bind:value={description}
          class="mt-1.5 w-full resize-none rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm text-gray-900 focus:border-[#0d99ff] focus:ring-1 focus:ring-[#0d99ff] focus:outline-none"
        ></textarea>
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
          {isSubmitting ? "Menyimpan..." : "Simpan"}
        </button>
      </div>
    </form>
  </div>
</div>
