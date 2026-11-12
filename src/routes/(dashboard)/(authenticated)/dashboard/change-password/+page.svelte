<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import Icon from "@iconify/svelte";

  import { enhance } from "$app/forms";

  import PasswordField from "#lib/components/PasswordField.svelte";

  import { pageTitleStore } from "../../../stores/page-title.svelte";

  import type { ActionData, PageProps } from "./$types";

  let { data, form }: PageProps & { form?: ActionData } = $props();

  let submitting = $state(false);
  let hasSubmitted = $state(false);
  let oldPassword = $state("");
  let newPassword = $state("");
  let confirmPassword = $state("");
  let serverFieldErrors = $state<{
    oldPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});

  $effect(() => {
    const f = form as
      | { fieldErrors?: { oldPassword?: string; newPassword?: string; confirmPassword?: string } }
      | undefined;
    serverFieldErrors = f?.fieldErrors ?? {};
  });

  const oldPasswordErrors = $derived.by(() => {
    if (hasSubmitted && !oldPassword) return ["Kata sandi saat ini wajib diisi."];
    return serverFieldErrors.oldPassword ? [serverFieldErrors.oldPassword] : [];
  });

  const newPasswordErrors = $derived.by(() => {
    if (hasSubmitted) {
      if (!newPassword) return ["Kata sandi baru wajib diisi."];
      if (newPassword.length < 6) return ["Kata sandi baru minimal harus 6 karakter."];
      if (oldPassword && newPassword === oldPassword) {
        return ["Kata sandi baru tidak boleh sama dengan kata sandi saat ini."];
      }
    }
    return serverFieldErrors.newPassword ? [serverFieldErrors.newPassword] : [];
  });

  const confirmPasswordErrors = $derived.by(() => {
    if (hasSubmitted) {
      if (!confirmPassword) return ["Konfirmasi kata sandi wajib diisi."];
      if (newPassword && confirmPassword !== newPassword) {
        return ["Konfirmasi kata sandi tidak cocok dengan kata sandi baru."];
      }
    }
    return serverFieldErrors.confirmPassword ? [serverFieldErrors.confirmPassword] : [];
  });

  onMount(() => {
    pageTitleStore.set("Ubah Kata Sandi");
  });

  onDestroy(() => {
    pageTitleStore.reset();
  });
</script>

<svelte:head>
  <title>Ubah Kata Sandi · {data.siteSettings.siteTitle}</title>
</svelte:head>

<div class="mx-auto max-w-2xl space-y-6">
  <div class="rounded-2xl border border-gray-200/80 bg-white p-6 md:p-8">
    <div class="mb-6">
      <h2 class="text-base font-bold text-gray-900 md:text-lg">Ubah Kata Sandi Akun</h2>
      <p class="mt-1 text-xs text-gray-500">
        Perbarui kata sandi secara berkala. Setelah diubah, semua sesi login aktif di seluruh
        perangkat akan dikeluarkan.
      </p>
    </div>

    {#if form?.error}
      <div
        class="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-red-800"
      >
        <Icon icon="lucide:alert-circle" class="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
        <span class="font-medium">{form.error}</span>
      </div>
    {/if}

    <form
      method="POST"
      novalidate
      use:enhance={({ cancel }) => {
        hasSubmitted = true;
        if (
          oldPasswordErrors.length > 0 ||
          newPasswordErrors.length > 0 ||
          confirmPasswordErrors.length > 0
        ) {
          cancel();
          return;
        }
        submitting = true;
        return async ({ result, update }) => {
          submitting = false;
          if (result.type === "success") {
            hasSubmitted = false;
            oldPassword = "";
            newPassword = "";
            confirmPassword = "";
          }
          await update();
        };
      }}
      class="space-y-4"
    >
      <PasswordField
        id="oldPassword"
        name="oldPassword"
        label="Kata Sandi Saat Ini"
        required
        autocomplete="current-password"
        placeholder="Masukkan kata sandi lama"
        bind:value={oldPassword}
        isError={oldPasswordErrors.length > 0}
        supporting={oldPasswordErrors}
      />

      <PasswordField
        id="newPassword"
        name="newPassword"
        label="Kata Sandi Baru"
        required
        autocomplete="new-password"
        placeholder="Minimal 6 karakter"
        bind:value={newPassword}
        isError={newPasswordErrors.length > 0}
        supporting={newPasswordErrors}
      />

      <PasswordField
        id="confirmPassword"
        name="confirmPassword"
        label="Konfirmasi Kata Sandi Baru"
        required
        autocomplete="new-password"
        placeholder="Ulangi kata sandi baru"
        bind:value={confirmPassword}
        isError={confirmPasswordErrors.length > 0}
        supporting={confirmPasswordErrors}
      />

      <div class="flex justify-end pt-2">
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
