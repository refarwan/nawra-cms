<script lang="ts">
  import Icon from "@iconify/svelte";

  import { enhance } from "$app/forms";

  import { getEmailErrors, getRequiredErrors, getUsernameErrors } from "#lib/utils/form-validation";

  import EditorAvatarField from "./EditorAvatarField.svelte";
  import EditorProfileFields from "./EditorProfileFields.svelte";

  import type { EditorFieldErrors } from "../editor-form";
  import type { EditorRowItem } from "./EditorTable.svelte";

  let { editor, onClose }: { editor: EditorRowItem; onClose: () => void } = $props();

  let name = $state("");
  let username = $state("");
  let email = $state("");
  let avatarUrl = $state("");
  let hasSubmitted = $state(false);
  let submitting = $state(false);
  let serverFieldErrors = $state<EditorFieldErrors>({});

  $effect(() => {
    name = editor.name || "";
    username = editor.username;
    email = editor.email;
    avatarUrl = editor.avatarUrl || "";
    hasSubmitted = false;
    serverFieldErrors = {};
  });

  const nameErrors = $derived(
    getRequiredErrors(name, "Nama lengkap", hasSubmitted, serverFieldErrors.name)
  );
  const usernameErrors = $derived(
    getUsernameErrors(username, hasSubmitted, serverFieldErrors.username)
  );
  const emailErrors = $derived(getEmailErrors(email, hasSubmitted, serverFieldErrors.email));
</script>

<div
  role="dialog"
  aria-modal="true"
  class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs"
>
  <div
    class="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-gray-200 bg-white p-6"
  >
    <div class="flex items-center justify-between border-b border-gray-100 pb-4">
      <div class="flex items-center gap-2.5">
        <div
          class="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 text-[#0d99ff]"
        >
          <Icon icon="lucide:user-cog" class="h-4 w-4" />
        </div>
        <div>
          <h3 class="text-sm font-bold text-gray-900">Ubah Data Editor</h3>
          <p class="text-[11px] text-gray-500">Perbarui foto profil dan informasi akun editor</p>
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
        if (nameErrors.length > 0 || usernameErrors.length > 0 || emailErrors.length > 0) {
          cancel();
          return;
        }
        submitting = true;
        return async ({ result, update }) => {
          submitting = false;
          if (result.type === "failure") {
            const data = result.data as { fieldErrors?: EditorFieldErrors };
            serverFieldErrors = data?.fieldErrors ?? {};
            await update({ reset: false });
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
      <input type="hidden" name="id" value={editor.id} />

      <EditorAvatarField bind:avatarUrl {name} {username} />

      <EditorProfileFields
        idPrefix="edit"
        bind:name
        bind:username
        bind:email
        {nameErrors}
        {usernameErrors}
        {emailErrors}
        onClearError={(field) => {
          serverFieldErrors = { ...serverFieldErrors, [field]: undefined };
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
