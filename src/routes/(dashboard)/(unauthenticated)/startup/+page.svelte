<script lang="ts">
  import Icon from "@iconify/svelte";

  import { applyAction, enhance } from "$app/forms";
  import { resolve } from "$app/paths";

  import LoginBrandSide from "../login/components/LoginBrandSide.svelte";

  let {
    data,
    form
  }: {
    data: {
      isCloudflare?: boolean;
      isD1Connected?: boolean;
      isInitialized?: boolean;
      tablesExist?: boolean;
      adminExists?: boolean;
      dbError?: string;
    };
    form?: { error?: string; success?: boolean; message?: string };
  } = $props();

  let loading = $state(false);
  const isReady = $derived(data.isInitialized || form?.success);
</script>

<svelte:head>
  <title>Setup & Inisialisasi Database · Nawra CMS</title>
</svelte:head>

<div class="flex min-h-screen bg-gray-50/80 font-sans">
  <LoginBrandSide />

  <main
    class="flex min-h-screen w-full items-center justify-center p-6 sm:p-10 lg:w-1/2 xl:w-[48%]"
  >
    <div class="w-full max-w-md rounded-2xl border border-gray-200/80 bg-white p-8 sm:p-10">
      <div class="mb-6">
        <div
          class="mb-3 inline-flex items-center gap-1.5 rounded-md bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700"
        >
          <Icon icon="lucide:database" class="h-3.5 w-3.5" />
          Setup Pertama Kali
        </div>
        <h1 class="text-2xl font-extrabold tracking-tight text-gray-900">Inisialisasi Database</h1>
        <p class="mt-1 text-sm text-gray-500">
          Siapkan tabel sistem dan akun administrator awal dengan satu klik.
        </p>
      </div>

      {#if data.isCloudflare && !data.isD1Connected}
        <div
          class="mb-5 flex items-start gap-2.5 rounded-xl border border-amber-300 bg-amber-50 p-3.5 text-xs text-amber-900"
        >
          <Icon icon="lucide:alert-triangle" class="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
          <span>
            <strong>Cloudflare D1 belum terhubung!</strong> Binding <code>DB</code> tidak terdeteksi.
          </span>
        </div>
      {/if}

      {#if form?.error || data.dbError}
        <div
          class="mb-5 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm text-red-700"
        >
          <Icon icon="lucide:alert-circle" class="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
          <span>{form?.error || data.dbError}</span>
        </div>
      {/if}

      {#if isReady}
        <div class="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-900">
          <div class="flex items-center gap-2 font-semibold">
            <Icon icon="lucide:check-circle-2" class="h-5 w-5 text-emerald-600" />
            <span>Database Siap Digunakan!</span>
          </div>
          <p class="mt-1.5 text-xs leading-relaxed text-emerald-700">
            Tabel sistem dan akun admin default telah berhasil dibuat. Silakan gunakan informasi
            berikut untuk login:
          </p>
          <div class="mt-3 space-y-1 rounded-lg border border-emerald-200 bg-white/80 p-3 text-xs">
            <div class="flex justify-between">
              <span class="text-gray-500">Username:</span>
              <strong class="font-mono text-gray-800">admin</strong>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">Kata Sandi:</span>
              <strong class="font-mono text-gray-800">admin123</strong>
            </div>
          </div>
        </div>

        <a
          href={resolve("/(dashboard)/(unauthenticated)/login")}
          class="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0d99ff] py-2.5 text-sm font-semibold text-white transition hover:bg-[#0c87e0]"
        >
          <Icon icon="lucide:log-in" class="h-4 w-4" />
          Buka Halaman Login
        </a>
      {:else}
        <div class="mb-6 space-y-2.5 rounded-xl border border-gray-200 bg-gray-50/60 p-4 text-xs">
          <div class="flex items-center justify-between">
            <span class="text-gray-600">Tabel Sistem (Users, Headers, dll):</span>
            <span
              class="inline-flex items-center gap-1 font-medium {data.tablesExist
                ? 'text-emerald-600'
                : 'text-amber-600'}"
            >
              <Icon icon={data.tablesExist ? "lucide:check" : "lucide:clock"} class="h-3.5 w-3.5" />
              {data.tablesExist ? "Siap" : "Belum Ada"}
            </span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-gray-600">Akun Admin Default:</span>
            <span
              class="inline-flex items-center gap-1 font-medium {data.adminExists
                ? 'text-emerald-600'
                : 'text-amber-600'}"
            >
              <Icon icon={data.adminExists ? "lucide:check" : "lucide:clock"} class="h-3.5 w-3.5" />
              {data.adminExists ? "Tersedia" : "Belum Dibuat"}
            </span>
          </div>
        </div>

        <form
          method="POST"
          action="?/initialize"
          use:enhance={() => {
            loading = true;
            return async ({ result }) => {
              loading = false;
              await applyAction(result);
            };
          }}
        >
          <button
            type="submit"
            disabled={loading}
            class="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0d99ff] py-2.5 text-sm font-semibold text-white transition hover:bg-[#0c87e0] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {#if loading}
              <Icon icon="lucide:loader-2" class="h-4 w-4 animate-spin" />
              <span>Memproses Inisialisasi...</span>
            {:else}
              <Icon icon="lucide:sparkles" class="h-4 w-4" />
              <span>Inisialisasi Database Sekarang</span>
            {/if}
          </button>
        </form>

        <p class="mt-4 text-center text-xs text-gray-400">
          Akan membuat seluruh skema tabel & akun admin awal otomatis.
        </p>
      {/if}
    </div>
  </main>
</div>
