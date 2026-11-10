<script lang="ts">
  import Icon from "@iconify/svelte";

  import { enhance } from "$app/forms";

  let { form }: { form?: { error?: string; email?: string } } = $props();

  let loading = $state(false);
  let showPassword = $state(false);
</script>

<svelte:head>
  <title>Masuk · Nawra CMS</title>
</svelte:head>

<div class="flex min-h-screen bg-gray-50/80 font-sans">
  <!-- Brand Side (Teman Dengar style, left column) -->
  <aside
    class="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-[#0d99ff] p-12 text-white lg:flex xl:w-[52%] xl:p-14"
  >
    <div class="relative z-10 flex h-full flex-col justify-between">
      <!-- Logo Top -->
      <div class="flex items-center gap-3">
        <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#0d99ff]">
          <Icon icon="lucide:layout-template" class="h-6 w-6" />
        </div>
        <div>
          <span class="text-xl font-extrabold tracking-tight">Nawra CMS</span>
          <span
            class="ml-2 rounded bg-white/20 px-1.5 py-0.5 text-[10px] font-semibold tracking-wider uppercase"
          >
            Edge D1
          </span>
        </div>
      </div>

      <!-- Value Propositions -->
      <div class="my-auto py-8">
        <h2 class="mb-6 text-2xl leading-snug font-extrabold tracking-tight text-white xl:text-3xl">
          CMS Visual Modern berbasis Cloudflare Workers & D1.
        </h2>
        <ul class="space-y-4">
          <li class="flex items-start gap-3.5 text-sm leading-relaxed text-white/90">
            <div
              class="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/20 text-white"
            >
              <Icon icon="lucide:heading" class="h-4 w-4" />
            </div>
            <span>
              Buat beragam <strong class="font-bold text-white">Header & Footer</strong> dan pilih mana
              yang aktif dengan 1 klik.
            </span>
          </li>
          <li class="flex items-start gap-3.5 text-sm leading-relaxed text-white/90">
            <div
              class="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/20 text-white"
            >
              <Icon icon="lucide:sparkles" class="h-4 w-4" />
            </div>
            <span>
              Visual drag & drop canvas dengan <strong class="font-bold text-white"
                >Flexbox Auto Layout</strong
              > mirip Figma.
            </span>
          </li>
          <li class="flex items-start gap-3.5 text-sm leading-relaxed text-white/90">
            <div
              class="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/20 text-white"
            >
              <Icon icon="lucide:zap" class="h-4 w-4" />
            </div>
            <span>
              Kinerja secepat kilat dengan <strong class="font-bold text-white"
                >Cloudflare Edge SQLite (D1)</strong
              >.
            </span>
          </li>
        </ul>
      </div>

      <p class="border-t border-white/20 pt-4 text-xs text-white/80">
        Nawra CMS Platform · Cloudflare Serverless Architecture
      </p>
    </div>
  </aside>

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

      {#if form?.error}
        <div
          class="mb-5 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm text-red-700"
        >
          <Icon icon="lucide:alert-circle" class="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
          <span>{form.error}</span>
        </div>
      {/if}

      <!-- Quick Demo Login Hint -->
      <div class="mb-5 rounded-xl border border-blue-100 bg-blue-50/70 p-3 text-xs text-blue-900">
        <div class="flex items-center gap-1.5 font-semibold text-[#0d99ff]">
          <Icon icon="lucide:info" class="h-4 w-4" />
          <span>Akun Demo Admin Bawaan</span>
        </div>
        <p class="mt-1 text-blue-800">
          Email: <code class="font-mono font-medium">admin@nawra.com</code><br />
          Sandi: <code class="font-mono font-medium">admin123</code>
        </p>
      </div>

      <form
        method="POST"
        action="?/login"
        use:enhance={() => {
          loading = true;
          return async ({ update }) => {
            loading = false;
            await update();
          };
        }}
        class="space-y-4"
      >
        <!-- Email -->
        <div>
          <label for="email" class="mb-1.5 block text-xs font-semibold text-gray-700">
            Alamat Email <span class="text-red-500">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={form?.email || "admin@nawra.com"}
            placeholder="admin@nawra.com"
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
              value="admin123"
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
      </form>
    </div>
  </main>
</div>
