<script lang="ts">
  import Icon from "@iconify/svelte";

  import { applyAction, enhance } from "$app/forms";
  import { resolve } from "$app/paths";
  import { page } from "$app/state";

  import PasswordField from "#lib/components/PasswordField.svelte";
  import Textfield from "#lib/components/Textfield.svelte";

  import LoginBrandSide from "./components/LoginBrandSide.svelte";

  let {
    data,
    form
  }: {
    data: { isCloudflare?: boolean; isD1Connected?: boolean };
    form?: {
      error?: string;
      identifier?: string;
      username?: string;
      email?: string;
      fieldErrors?: { identifier?: string; password?: string };
    };
  } = $props();

  let identifier = $state("");
  let password = $state("");
  let hasSubmitted = $state(false);
  let loading = $state(false);

  const siteTitle = $derived(page.data.siteSettings?.siteTitle || "Nawra CMS");
  const faviconUrl = $derived(page.data.siteSettings?.faviconUrl || "/favicon.svg");
  const passwordChanged = $derived(page.url.searchParams.get("passwordChanged") === "1");

  $effect(() => {
    const serverIdentifier = form?.identifier || form?.username || form?.email;
    if (serverIdentifier && !identifier) {
      identifier = serverIdentifier;
    }
  });

  const identifierErrors = $derived.by(() => {
    const errors: string[] = [];
    if (hasSubmitted && !identifier.trim()) {
      errors.push("Username atau Email wajib diisi");
    } else if (!hasSubmitted && form?.fieldErrors?.identifier) {
      errors.push(form.fieldErrors.identifier);
    }
    return errors;
  });

  const passwordErrors = $derived.by(() => {
    const errors: string[] = [];
    if (hasSubmitted && !password) {
      errors.push("Kata sandi wajib diisi");
    } else if (!hasSubmitted && form?.fieldErrors?.password) {
      errors.push(form.fieldErrors.password);
    }
    return errors;
  });
</script>

<svelte:head>
  <title>Masuk · {siteTitle}</title>
</svelte:head>

<div class="flex min-h-screen bg-gray-50/80 font-sans">
  <LoginBrandSide title={siteTitle} favicon={faviconUrl} />

  <!-- Login Form Side (right column) -->
  <main
    class="flex min-h-screen w-full items-center justify-center p-6 sm:p-10 lg:w-1/2 xl:w-[48%]"
  >
    <div class="w-full max-w-md rounded-2xl border border-gray-200/80 bg-white p-8 sm:p-10">
      <!-- Mobile Brand Header -->
      <div class="mb-6 flex items-center gap-2.5 lg:hidden">
        <img src={faviconUrl} alt={siteTitle} class="h-8 w-8 shrink-0 rounded-lg object-contain" />
        <span class="truncate text-base font-bold tracking-tight text-gray-900">{siteTitle}</span>
      </div>

      <div class="mb-6">
        <h1 class="text-2xl font-extrabold tracking-tight text-gray-900">Selamat datang kembali</h1>
        <p class="mt-1 text-sm text-gray-500">
          Masuk ke panel kontrol <strong class="font-semibold text-gray-700">{siteTitle}</strong>
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

      {#if passwordChanged}
        <div
          class="mb-5 flex items-start gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-sm text-emerald-700"
        >
          <Icon icon="lucide:check-circle-2" class="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
          <span>
            Kata sandi berhasil diperbarui. Semua sesi login telah dikeluarkan, silakan masuk
            kembali.
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
        novalidate
        use:enhance={({ cancel }) => {
          hasSubmitted = true;
          if (identifierErrors.length > 0 || passwordErrors.length > 0) {
            cancel();
            return;
          }

          loading = true;
          return async ({ result }) => {
            loading = false;
            await applyAction(result);
          };
        }}
        class="space-y-4"
      >
        <Textfield
          id="username"
          name="username"
          type="text"
          label="Username atau Email"
          bind:value={identifier}
          placeholder="Masukkan username atau email"
          autocomplete="username"
          required
          isError={identifierErrors.length > 0}
          supporting={identifierErrors}
        />

        <PasswordField
          id="password"
          name="password"
          label="Kata Sandi"
          bind:value={password}
          placeholder="Masukkan kata sandi"
          autocomplete="current-password"
          required
          isError={passwordErrors.length > 0}
          supporting={passwordErrors}
        />

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
