<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import Icon from "@iconify/svelte";

  import { enhance } from "$app/forms";

  import { pageTitleStore } from "../../../stores/page-title.svelte";

  import type { ActionData, PageProps } from "./$types";

  let { form }: PageProps & { form?: ActionData } = $props();

  let submitting = $state(false);
  let showOld = $state(false);
  let showNew = $state(false);
  let showConfirm = $state(false);

  onMount(() => {
    pageTitleStore.set("Ubah Kata Sandi");
  });

  onDestroy(() => {
    pageTitleStore.reset();
  });
</script>

<svelte:head>
  <title>Ubah Kata Sandi · Nawra CMS</title>
</svelte:head>

<div class="mx-auto max-w-2xl space-y-6">
  <div class="rounded-2xl border border-gray-200/80 bg-white p-6 md:p-8">
    <div class="mb-6">
      <h2 class="text-base font-bold text-gray-900 md:text-lg">Ubah Kata Sandi Akun</h2>
      <p class="mt-1 text-xs text-gray-500">
        Perbarui kata sandi secara berkala untuk menjaga keamanan akun Nawra CMS Anda.
      </p>
    </div>

    {#if form?.success}
      <div
        class="mb-6 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs text-emerald-800"
      >
        <Icon icon="lucide:check-circle-2" class="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
        <span class="font-medium">{form.message}</span>
      </div>
    {/if}

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
      use:enhance={() => {
        submitting = true;
        return async ({ update }) => {
          submitting = false;
          await update();
        };
      }}
      class="space-y-4"
    >
      <!-- Kata Sandi Saat Ini -->
      <div>
        <label for="oldPassword" class="mb-1.5 block text-xs font-semibold text-gray-700">
          Kata Sandi Saat Ini <span class="text-red-500">*</span>
        </label>
        <div class="relative">
          <input
            id="oldPassword"
            name="oldPassword"
            type={showOld ? "text" : "password"}
            required
            autocomplete="current-password"
            placeholder="Masukkan kata sandi lama"
            class="h-11 w-full rounded-xl border border-gray-200 bg-white px-3.5 pr-10 text-xs text-gray-900 placeholder:text-gray-400 focus:border-[#0d99ff] focus:ring-1 focus:ring-[#0d99ff] focus:outline-none"
          />
          <button
            type="button"
            onclick={() => (showOld = !showOld)}
            class="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <Icon icon={showOld ? "lucide:eye-off" : "lucide:eye"} class="h-4 w-4" />
          </button>
        </div>
      </div>

      <!-- Kata Sandi Baru -->
      <div>
        <label for="newPassword" class="mb-1.5 block text-xs font-semibold text-gray-700">
          Kata Sandi Baru <span class="text-red-500">*</span>
        </label>
        <div class="relative">
          <input
            id="newPassword"
            name="newPassword"
            type={showNew ? "text" : "password"}
            required
            autocomplete="new-password"
            placeholder="Minimal 6 karakter"
            class="h-11 w-full rounded-xl border border-gray-200 bg-white px-3.5 pr-10 text-xs text-gray-900 placeholder:text-gray-400 focus:border-[#0d99ff] focus:ring-1 focus:ring-[#0d99ff] focus:outline-none"
          />
          <button
            type="button"
            onclick={() => (showNew = !showNew)}
            class="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <Icon icon={showNew ? "lucide:eye-off" : "lucide:eye"} class="h-4 w-4" />
          </button>
        </div>
      </div>

      <!-- Konfirmasi Kata Sandi Baru -->
      <div>
        <label for="confirmPassword" class="mb-1.5 block text-xs font-semibold text-gray-700">
          Konfirmasi Kata Sandi Baru <span class="text-red-500">*</span>
        </label>
        <div class="relative">
          <input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirm ? "text" : "password"}
            required
            autocomplete="new-password"
            placeholder="Ulangi kata sandi baru"
            class="h-11 w-full rounded-xl border border-gray-200 bg-white px-3.5 pr-10 text-xs text-gray-900 placeholder:text-gray-400 focus:border-[#0d99ff] focus:ring-1 focus:ring-[#0d99ff] focus:outline-none"
          />
          <button
            type="button"
            onclick={() => (showConfirm = !showConfirm)}
            class="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <Icon icon={showConfirm ? "lucide:eye-off" : "lucide:eye"} class="h-4 w-4" />
          </button>
        </div>
      </div>

      <div class="flex justify-end pt-2">
        <button
          type="submit"
          disabled={submitting}
          class="flex h-10 cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#0d99ff] px-5 text-xs font-semibold text-white transition hover:bg-[#008ae6] disabled:opacity-50"
        >
          {#if submitting}
            <Icon icon="lucide:loader-2" class="h-4 w-4 animate-spin" />
            <span>Menyimpan...</span>
          {:else}
            <Icon icon="lucide:check" class="h-4 w-4" />
            <span>Simpan Kata Sandi</span>
          {/if}
        </button>
      </div>
    </form>
  </div>
</div>
