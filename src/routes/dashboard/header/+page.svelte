<script lang="ts">
  import Icon from "@iconify/svelte";

  import { enhance } from "$app/forms";
  import { resolve } from "$app/paths";

  import type { ActionData, PageProps } from "./$types";

  let { data, form }: PageProps & { form?: ActionData } = $props();

  let isCreating = $state(false);
  let newTitle = $state("");
  let submitting = $state(false);
</script>

<svelte:head>
  <title>Kelola Header · Nawra CMS</title>
</svelte:head>

<div class="mx-auto max-w-6xl space-y-6">
  <!-- Top Bar -->
  <div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
    <div>
      <h1 class="text-xl font-bold tracking-tight text-gray-900 md:text-2xl">
        Kelola Header Situs
      </h1>
      <p class="mt-1 text-xs text-gray-500 md:text-sm">
        Buat beragam variasi header dan tentukan mana yang sedang aktif ditampilkan di website.
      </p>
    </div>

    <button
      type="button"
      onclick={() => (isCreating = !isCreating)}
      class="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#0d99ff] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#008ae6]"
    >
      <Icon icon={isCreating ? "lucide:x" : "lucide:plus"} class="h-4 w-4" />
      <span>{isCreating ? "Tutup Form" : "Buat Header Baru"}</span>
    </button>
  </div>

  {#if form?.error}
    <div
      class="flex items-center gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-700"
    >
      <Icon icon="lucide:alert-circle" class="h-4 w-4 shrink-0 text-red-500" />
      <span>{form.error}</span>
    </div>
  {/if}

  <!-- Create Header Card -->
  {#if isCreating}
    <div class="rounded-2xl border border-blue-200/80 bg-blue-50/40 p-5 md:p-6">
      <h2 class="text-sm font-bold text-gray-900">Form Header Baru</h2>
      <p class="mt-0.5 mb-4 text-xs text-gray-500">Beri nama untuk identitas header ini.</p>

      <form
        method="POST"
        action="?/create"
        use:enhance={() => {
          submitting = true;
          return async ({ update }) => {
            submitting = false;
            isCreating = false;
            newTitle = "";
            await update();
          };
        }}
        class="flex flex-col gap-3 sm:flex-row sm:items-center"
      >
        <input
          type="text"
          name="title"
          required
          bind:value={newTitle}
          placeholder="Contoh: Header Navigasi Promo 2026"
          class="h-11 flex-1 rounded-xl border border-gray-200 bg-white px-4 text-xs text-gray-900 placeholder:text-gray-400 focus:border-[#0d99ff] focus:ring-1 focus:ring-[#0d99ff] focus:outline-none"
        />

        <button
          type="submit"
          disabled={submitting || !newTitle.trim()}
          class="flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#0d99ff] px-5 text-xs font-semibold text-white transition hover:bg-[#008ae6] disabled:opacity-50"
        >
          <Icon icon="lucide:check" class="h-4 w-4" />
          <span>{submitting ? "Menyimpan..." : "Simpan Header"}</span>
        </button>
      </form>
    </div>
  {/if}

  <!-- Header List -->
  {#if data.headers.length === 0}
    <div class="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">
      <div
        class="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100 text-gray-400"
      >
        <Icon icon="lucide:panel-top" class="h-6 w-6" />
      </div>
      <h3 class="mt-4 text-sm font-bold text-gray-900">Belum ada header</h3>
      <p class="mt-1 text-xs text-gray-500">
        Mulai dengan membuat header pertama untuk website Anda.
      </p>
      <button
        type="button"
        onclick={() => (isCreating = true)}
        class="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#0d99ff] px-4 py-2 text-xs font-semibold text-white hover:bg-[#008ae6]"
      >
        <Icon icon="lucide:plus" class="h-4 w-4" />
        <span>Buat Sekarang</span>
      </button>
    </div>
  {:else}
    <div class="grid grid-cols-1 gap-4">
      {#each data.headers as header (header.id)}
        {@const isActive = header.isActive === 1}
        <div
          class="flex flex-col justify-between gap-4 rounded-2xl border bg-white p-5 transition md:flex-row md:items-center {isActive
            ? 'border-[#0d99ff] ring-1 ring-[#0d99ff]/30'
            : 'border-gray-200/80'}"
        >
          <div class="flex items-start gap-3.5">
            <div
              class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl {isActive
                ? 'bg-[#0d99ff]/10 text-[#0d99ff]'
                : 'bg-gray-100 text-gray-500'}"
            >
              <Icon icon="lucide:panel-top" class="h-5 w-5" />
            </div>

            <div>
              <div class="flex items-center gap-2">
                <span class="text-sm font-bold text-gray-900">{header.title}</span>
                {#if isActive}
                  <span
                    class="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700"
                  >
                    <Icon icon="lucide:check" class="h-3 w-3" />
                    Sedang Aktif
                  </span>
                {/if}
              </div>

              <div class="mt-1 flex items-center gap-3 text-[11px] text-gray-400">
                <span>ID: <code class="font-mono text-gray-500">{header.id}</code></span>
                <span>•</span>
                <span>Dibuat: {new Date(header.createdAt).toLocaleDateString("id-ID")}</span>
              </div>
            </div>
          </div>

          <div class="flex flex-wrap items-center gap-2">
            {#if !isActive}
              <form method="POST" action="?/activate" use:enhance>
                <input type="hidden" name="id" value={header.id} />
                <button
                  type="submit"
                  class="flex cursor-pointer items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 transition hover:border-[#0d99ff] hover:text-[#0d99ff]"
                  title="Aktifkan header ini"
                >
                  <Icon icon="lucide:power" class="h-3.5 w-3.5" />
                  <span>Aktifkan</span>
                </button>
              </form>
            {/if}

            <a
              href="{resolve('/editor')}?type=header&id={header.id}"
              class="flex items-center gap-1.5 rounded-xl bg-gray-900 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-gray-800"
            >
              <Icon icon="lucide:pen-tool" class="h-3.5 w-3.5" />
              <span>Desain Header</span>
            </a>

            {#if !isActive}
              <form method="POST" action="?/delete" use:enhance>
                <input type="hidden" name="id" value={header.id} />
                <button
                  type="submit"
                  onclick={(e) => {
                    if (!confirm(`Hapus header "${header.title}"?`)) e.preventDefault();
                  }}
                  class="flex cursor-pointer items-center gap-1.5 rounded-xl border border-gray-200 p-2 text-xs text-gray-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                  title="Hapus header"
                >
                  <Icon icon="lucide:trash-2" class="h-3.5 w-3.5" />
                </button>
              </form>
            {/if}
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>
