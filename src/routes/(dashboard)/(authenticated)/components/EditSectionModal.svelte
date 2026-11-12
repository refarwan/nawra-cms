<script lang="ts">
  import Icon from "@iconify/svelte";

  import { enhance } from "$app/forms";

  import Textfield from "#lib/components/Textfield.svelte";
  import { getRequiredErrors } from "#lib/utils/form-validation";

  let {
    heading,
    fieldLabel,
    inputId,
    item,
    onClose
  }: {
    heading: string;
    fieldLabel: string;
    inputId: string;
    item: { id: string; title: string };
    onClose: () => void;
  } = $props();

  let title = $state("");
  let hasSubmitted = $state(false);
  let submitting = $state(false);
  let serverTitleError = $state<string | undefined>(undefined);

  $effect(() => {
    title = item.title;
    hasSubmitted = false;
    serverTitleError = undefined;
  });

  const titleErrors = $derived(
    getRequiredErrors(title, fieldLabel, hasSubmitted, serverTitleError)
  );
</script>

<div
  role="dialog"
  aria-modal="true"
  class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
>
  <div class="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 text-gray-900">
    <div class="flex items-center justify-between">
      <h3 class="text-base font-bold text-gray-900">{heading}</h3>
      <button
        type="button"
        onclick={onClose}
        class="cursor-pointer rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
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
        if (titleErrors.length > 0) {
          cancel();
          return;
        }
        submitting = true;
        return async ({ result, update }) => {
          submitting = false;
          if (result.type === "failure") {
            const data = result.data as { fieldErrors?: { title?: string } };
            serverTitleError = data?.fieldErrors?.title;
            await update({ reset: false });
            return;
          }
          hasSubmitted = false;
          onClose();
          await update({ reset: false });
        };
      }}
      class="mt-4 space-y-4"
    >
      <input type="hidden" name="id" value={item.id} />

      <Textfield
        id={inputId}
        name="title"
        label={fieldLabel}
        required
        bind:value={title}
        isError={titleErrors.length > 0}
        supporting={titleErrors}
        oninput={() => {
          serverTitleError = undefined;
        }}
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
          disabled={submitting}
          class="cursor-pointer rounded-xl bg-[#0d99ff] px-4 py-2 text-xs font-semibold text-white hover:bg-[#008ae6] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? "Menyimpan..." : "Simpan"}
        </button>
      </div>
    </form>
  </div>
</div>
