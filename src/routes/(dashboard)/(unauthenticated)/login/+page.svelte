<script lang="ts">
  import Icon from "@iconify/svelte";

  import { applyAction, enhance } from "$app/forms";
  import { resolve } from "$app/paths";

  import LoginBrandSide from "./components/LoginBrandSide.svelte";

  let {
    data,
    form
  }: {
    data: { isCloudflare?: boolean; isD1Connected?: boolean };
    form?: { error?: string; identifier?: string; username?: string; email?: string };
  } = $props();

  let loading = $state(false);
  let showPassword = $state(false);
</script>

<svelte:head>
  <title>Masuk · Nawra CMS</title>
</svelte:head>

<div class="flex min-h-screen bg-gray-50/80 font-sans">
  <LoginBrandSide />

  <!-- Login Form Side (right column) -->
  <main
    class="flex min-h-screen w-full items-center justify-center p-6 sm:p-10 lg:w-1/2 xl:w-[48%]"
  >
    <div class="w-full max-w-md rounded-2xl border border-gray-200/80 bg-white p-8 sm:p-10">
      <div class="mb-6">
        <h1 class="text-2xl font-extrabold tracking-tight text-gray-900">Selamat datang kembali</h1>
        <p class="mt-1 text-sm text-gray-500">
          Masuk ke dashboard admin <strong class="font-semibold text-gray-700">Nawra CMS</strong>
        </p>
      </div>

      {#if data.isCloudflare && !data.isD1Connected}
        <div
          class="mb-5 flex items-start gap-2.5 rounded-xl border border-amber-300 bg-amber-50 p-3.5 text-xs text-amber-900"
        >
          <Icon icon="lucide:alert-triangle" class="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
          <span>
            <strong>Cloudflare D1 belum terhubung!</strong> Pasang binding <code>DB</code> di Cloudflare
            Settings agar data Anda tidak hilang saat Worker restart.
          </span>
        </div>
      {/if}

      {#if form?.error}
        <div
          class="mb-5 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm text-red-700"
        >
          <Icon icon="lucide:alert-circle" class="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
          <span>{form.error}</span>
        </div>
      {/if}

      <form
        method="POST"
        action="?/login"
        use:enhance={() => {
          loading = true;
          return async ({ result }) => {
            loading = false;
            await applyAction(result);
          };
        }}
        class="space-y-4"
      >
        <!-- Username / Email -->
        <div>
          <label for="username" class="mb-1.5 block text-xs font-semibold text-gray-700">
            Username atau Email <span class="text-red-500">*</span>
          </label>
          <input
            id="username"
            name="username"
            type="text"
            required
            autocomplete="username"
            value={form?.identifier || form?.username || form?.email || ""}
            placeholder="admin atau nama@email.com"
            class="h-11 w-full rounded-xl border border-gray-200 bg-white px-3.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#0d99ff] focus:ring-1 focus:ring-[#0d99ff] focus:outline-none"
          />
        </div>

        <!-- Password -->
        <div>
          <label for="password" class="mb-1.5 block text-xs font-semibold text-gray-700">
            Kata Sandi <span class="text-red-500">*</span>
          </label>
          <div class="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              placeholder="••••••••"
              class="h-11 w-full rounded-xl border border-gray-200 bg-white px-3.5 pr-10 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#0d99ff] focus:ring-1 focus:ring-[#0d99ff] focus:outline-none"
            />
            <button
              type="button"
              onclick={() => (showPassword = !showPassword)}
              class="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              title={showPassword ? "Sembunyikan" : "Tampilkan"}
            >
              <Icon icon={showPassword ? "lucide:eye-off" : "lucide:eye"} class="h-4 w-4" />
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          class="flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#0d99ff] text-sm font-semibold text-white transition hover:bg-[#008ae6] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {#if loading}
            <Icon icon="lucide:loader-2" class="h-4 w-4 animate-spin" />
            <span>Memproses...</span>
          {:else}
            <span>Masuk ke Dashboard</span>
            <Icon icon="lucide:arrow-right" class="h-4 w-4" />
          {/if}
        </button>

        <p class="mt-4 text-center text-xs text-gray-500">
          Database baru atau belum disiapkan?
          <a
            href={resolve("/(dashboard)/(unauthenticated)/startup")}
            class="font-medium text-[#0d99ff] hover:underline"
          >
            Setup database
          </a>
        </p>
      </form>
    </div>
  </main>
</div>
