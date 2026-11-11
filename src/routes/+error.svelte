<script lang="ts">
  import Icon from "@iconify/svelte";

  import { resolve } from "$app/paths";
  import { page } from "$app/state";

  $effect(() => {
    console.error("PAGE ERROR DETAIL:", page.status, page.error);
  });

  const errorStack = $derived(
    page.error && typeof page.error === "object" && "stack" in page.error
      ? String(page.error.stack)
      : null
  );
</script>

<svelte:head>
  <title>{page.status} · Nawra CMS</title>
</svelte:head>

<div
  class="flex min-h-screen flex-col items-center justify-center bg-[#141416] px-4 text-center text-white"
>
  <div class="max-w-md space-y-4">
    <div
      class="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10 text-red-400"
    >
      <Icon icon="lucide:alert-triangle" class="h-7 w-7" />
    </div>

    <h1 class="text-3xl font-extrabold tracking-tight text-white md:text-4xl">
      Error {page.status}
    </h1>

    <p class="text-sm text-neutral-400">
      {page.error?.message || "Terjadi kendala saat memproses permintaan Anda."}
    </p>

    {#if page.error}
      <div
        class="mt-4 max-h-48 overflow-auto rounded-xl border border-red-500/30 bg-black/70 p-3 text-left font-mono text-xs text-red-300"
      >
        <div><strong>Status:</strong> {page.status}</div>
        <div><strong>Message:</strong> {page.error.message}</div>
        {#if errorStack}
          <pre
            class="mt-2 max-h-24 overflow-auto text-[10px] whitespace-pre-wrap text-neutral-400">{errorStack}</pre>
        {/if}
      </div>
    {/if}

    <div class="flex flex-wrap items-center justify-center gap-3 pt-4">
      <a
        href={resolve("/(dashboard)/(authenticated)/dashboard")}
        class="inline-flex items-center gap-2 rounded-xl bg-[#0d99ff] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-[#008ae6]"
      >
        <Icon icon="lucide:layout-dashboard" class="h-4 w-4" />
        <span>Dashboard</span>
      </a>

      <a
        href={resolve("/(dashboard)/(authenticated)/dashboard/header")}
        class="inline-flex items-center gap-2 rounded-xl border border-neutral-700 bg-neutral-800 px-4 py-2.5 text-xs font-semibold text-neutral-200 transition hover:bg-neutral-700"
      >
        <Icon icon="lucide:panel-top" class="h-4 w-4" />
        <span>Kelola Header</span>
      </a>

      <a
        href={resolve("/(dashboard)/(authenticated)/dashboard/footer")}
        class="inline-flex items-center gap-2 rounded-xl border border-neutral-700 bg-neutral-800 px-4 py-2.5 text-xs font-semibold text-neutral-200 transition hover:bg-neutral-700"
      >
        <Icon icon="lucide:panel-bottom" class="h-4 w-4" />
        <span>Kelola Footer</span>
      </a>
    </div>
  </div>
</div>
