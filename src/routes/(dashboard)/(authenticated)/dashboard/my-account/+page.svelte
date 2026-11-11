<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import Icon from "@iconify/svelte";

  import { enhance } from "$app/forms";

  import { pageTitleStore } from "../../../stores/page-title.svelte";

  import type { ActionData, PageProps } from "./$types";

  let { data, form }: PageProps & { form?: ActionData } = $props();

  let submitting = $state(false);

  onMount(() => {
    pageTitleStore.set("Akun Saya");
  });

  onDestroy(() => {
    pageTitleStore.reset();
  });

  const formattedCreated = $derived(
    data.user?.createdAt ? new Date(data.user.createdAt).toLocaleDateString("id-ID") : "-"
  );
</script>

<svelte:head>
  <title>Akun Saya · Nawra CMS</title>
</svelte:head>

<div class="mx-auto max-w-2xl space-y-6">
  <!-- Profile Overview Card -->
  <div class="rounded-2xl border border-gray-200/80 bg-white p-6 md:p-8">
    <div class="flex items-center gap-4 border-b border-gray-100 pb-6">
      <div
        class="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0d99ff]/10 text-xl font-bold text-[#0d99ff]"
      >
        {(
          data.user?.name?.[0] ||
          data.user?.username?.[0] ||
          data.user?.email?.[0] ||
          "U"
        ).toUpperCase()}
      </div>
      <div>
        <h2 class="text-base font-bold text-gray-900 md:text-lg">
          {data.user?.name || data.user?.username || "Pengguna Nawra"}
        </h2>
        <p class="text-xs text-gray-500">
          @{data.user?.username || "user"} · {data.user?.email}
        </p>
        <div class="mt-1.5 flex items-center gap-2">
          <span
            class="inline-flex items-center rounded-md bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-[#0d99ff] capitalize"
          >
            {data.user?.role || "Editor"}
          </span>
          <span class="text-[11px] text-gray-400">
            Terdaftar: {formattedCreated}
          </span>
        </div>
      </div>
    </div>

    {#if form?.success}
      <div
        class="mt-6 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs text-emerald-800"
      >
        <Icon icon="lucide:check-circle-2" class="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
        <span class="font-medium">{form.message}</span>
      </div>
    {/if}

    {#if form?.error}
      <div
        class="mt-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-red-800"
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
      class="mt-6 space-y-4"
    >
      <!-- Username -->
      <div>
        <label for="username" class="mb-1.5 block text-xs font-semibold text-gray-700">
          Username <span class="text-red-500">*</span>
        </label>
        <input
          id="username"
          name="username"
          type="text"
          required
          value={data.user?.username || ""}
          placeholder="username_anda"
          class="h-11 w-full rounded-xl border border-gray-200 bg-white px-3.5 text-xs text-gray-900 placeholder:text-gray-400 focus:border-[#0d99ff] focus:ring-1 focus:ring-[#0d99ff] focus:outline-none"
        />
        <p class="mt-1 text-[11px] text-gray-400">
          Username unik untuk login ke dashboard (3-30 karakter).
        </p>
      </div>

      <!-- Nama Lengkap -->
      <div>
        <label for="name" class="mb-1.5 block text-xs font-semibold text-gray-700">
          Nama Lengkap
        </label>
        <input
          id="name"
          name="name"
          type="text"
          value={data.user?.name || ""}
          placeholder="Nama Anda"
          class="h-11 w-full rounded-xl border border-gray-200 bg-white px-3.5 text-xs text-gray-900 placeholder:text-gray-400 focus:border-[#0d99ff] focus:ring-1 focus:ring-[#0d99ff] focus:outline-none"
        />
      </div>

      <!-- Alamat Email -->
      <div>
        <label for="email" class="mb-1.5 block text-xs font-semibold text-gray-700">
          Alamat Email <span class="text-red-500">*</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          value={data.user?.email || ""}
          placeholder="nama@email.com"
          class="h-11 w-full rounded-xl border border-gray-200 bg-white px-3.5 text-xs text-gray-900 placeholder:text-gray-400 focus:border-[#0d99ff] focus:ring-1 focus:ring-[#0d99ff] focus:outline-none"
        />
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
            <span>Simpan Perubahan</span>
          {/if}
        </button>
      </div>
    </form>
  </div>
</div>
