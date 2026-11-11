<script lang="ts">
  import Icon from "@iconify/svelte";

  import { enhance } from "$app/forms";
  import { resolve } from "$app/paths";

  import { pageTitleStore } from "../../../stores/page-title.svelte";
  import CreateHomeCard from "./components/CreateHomeCard.svelte";
  import EditHomeModal from "./components/EditHomeModal.svelte";

  import type { ActionData, PageProps } from "./$types";

  let { data, form }: PageProps & { form?: ActionData } = $props();

  let isCreating = $state(false);
  let editingHome = $state<{ id: string; title: string } | null>(null);

  $effect(() => {
    pageTitleStore.set("Kelola Home Page");
  });
</script>

<svelte:head>
  <title>Kelola Home Page · Nawra CMS</title>
</svelte:head>

<div class="mx-auto max-w-6xl space-y-6">
  <!-- Top Bar -->
  <div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
    <div>
      <h1 class="text-xl font-bold tracking-tight text-gray-900 md:text-2xl">
        Kelola Home Page Situs
      </h1>
      <p class="mt-1 text-xs text-gray-500 md:text-sm">
        Rancang beragam variasi halaman beranda landing page dan tentukan mana yang aktif.
      </p>
    </div>

    <button
      type="button"
      onclick={() => (isCreating = !isCreating)}
      class="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#0d99ff] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#008ae6]"
    >
      <Icon icon={isCreating ? "lucide:x" : "lucide:plus"} class="h-4 w-4" />
      <span>{isCreating ? "Tutup Form" : "Buat Home Page Baru"}</span>
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

  {#if isCreating}
    <CreateHomeCard onClose={() => (isCreating = false)} />
  {/if}

  {#if editingHome}
    <EditHomeModal homepage={editingHome} onClose={() => (editingHome = null)} />
  {/if}

  <!-- Homepage List -->
  {#if data.homepages.length === 0}
    <div class="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">
      <div
        class="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-100 text-gray-400"
      >
        <Icon icon="lucide:home" class="h-6 w-6" />
      </div>
      <h3 class="mt-4 text-sm font-bold text-gray-900">Belum ada home page</h3>
      <p class="mt-1 text-xs text-gray-500">Mulai dengan membuat variasi beranda pertama.</p>
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
      {#each data.homepages as home (home.id)}
        {@const isActive = home.isActive === 1}
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
              <Icon icon="lucide:home" class="h-5 w-5" />
            </div>

            <div>
              <div class="flex items-center gap-2">
                <span class="text-sm font-bold text-gray-900">{home.title}</span>
                {#if isActive}
                  <span
                    class="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700"
                  >
                    <Icon icon="lucide:check" class="h-3 w-3" />
                    Sedang Aktif di Beranda
                  </span>
                {/if}
              </div>

              <div class="mt-1 flex items-center gap-3 text-[11px] text-gray-400">
                <span>ID: <code class="font-mono text-gray-500">{home.id}</code></span>
                <span>•</span>
                <span>Dibuat: {new Date(home.createdAt).toLocaleDateString("id-ID")}</span>
              </div>
            </div>
          </div>

          <div class="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onclick={() => (editingHome = home)}
              class="flex cursor-pointer items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 hover:border-gray-300 hover:bg-gray-50"
              title="Ubah judul home page"
            >
              <Icon icon="lucide:pencil" class="h-3.5 w-3.5" />
              <span>Edit Nama</span>
            </button>

            {#if !isActive}
              <form method="POST" action="?/activate" use:enhance>
                <input type="hidden" name="id" value={home.id} />
                <button
                  type="submit"
                  class="flex cursor-pointer items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 transition hover:border-[#0d99ff] hover:text-[#0d99ff]"
                  title="Aktifkan home page ini"
                >
                  <Icon icon="lucide:power" class="h-3.5 w-3.5" />
                  <span>Aktifkan</span>
                </button>
              </form>
            {/if}

            <a
              href="{resolve('/editor')}?type=homepage&id={home.id}"
              class="flex items-center gap-1.5 rounded-xl bg-gray-900 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-gray-800"
            >
              <Icon icon="lucide:pen-tool" class="h-3.5 w-3.5" />
              <span>Desain Home Page</span>
            </a>

            {#if !isActive}
              <form method="POST" action="?/delete" use:enhance>
                <input type="hidden" name="id" value={home.id} />
                <button
                  type="submit"
                  onclick={(e) => {
                    if (!confirm(`Hapus home page "${home.title}"?`)) e.preventDefault();
                  }}
                  class="flex cursor-pointer items-center gap-1.5 rounded-xl border border-gray-200 p-2 text-xs text-gray-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                  title="Hapus home page"
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
