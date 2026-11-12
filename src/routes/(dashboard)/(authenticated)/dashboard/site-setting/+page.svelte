<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import Icon from "@iconify/svelte";

  import { enhance } from "$app/forms";
  import { invalidateAll } from "$app/navigation";

  import LightColorPicker from "#lib/components/LightColorPicker.svelte";
  import Textfield from "#lib/components/Textfield.svelte";

  import { pageTitleStore } from "../../../stores/page-title.svelte";
  import FaviconUploadField from "./components/FaviconUploadField.svelte";

  import type { ActionData, PageData } from "./$types";

  let { data, form }: { data: PageData; form: ActionData } = $props();

  let siteTitle = $state("");
  let siteTagline = $state("");
  let siteDescription = $state("");
  let siteFavicon = $state("");
  let blogAccentColor = $state("#0d99ff");

  $effect(() => {
    siteTitle = data.siteSettings.siteTitle;
    siteTagline = data.siteSettings.siteTagline;
    siteDescription = data.siteSettings.siteDescription;
    siteFavicon = data.siteSettings.siteFavicon;
    blogAccentColor = data.siteSettings.blogAccentColor;
  });

  let hasSubmitted = $state(false);
  let isSaving = $state(false);
  let isResetting = $state(false);
  let showSuccess = $state(false);
  const HEX_COLOR_RE = /^#[0-9a-fA-F]{6}$/;

  const titleError = $derived(
    hasSubmitted && !siteTitle.trim()
      ? "Judul situs tidak boleh kosong."
      : (form?.fieldErrors?.siteTitle ?? "")
  );
  const accentError = $derived(
    hasSubmitted && !HEX_COLOR_RE.test(blogAccentColor.trim())
      ? "Gunakan format warna hex 6 digit, misalnya #0d99ff."
      : (form?.fieldErrors?.blogAccentColor ?? "")
  );

  onMount(() => pageTitleStore.set("Pengaturan Situs"));
  onDestroy(() => pageTitleStore.reset());
</script>

<svelte:head>
  <title>Pengaturan Situs · {data.siteSettings.siteTitle}</title>
</svelte:head>

<div class="mx-auto max-w-2xl space-y-6">
  <div class="rounded-2xl border border-gray-200/80 bg-white p-6 md:p-8">
    {#if showSuccess || form?.success}
      <div
        class="mb-6 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs text-emerald-800"
      >
        <Icon icon="lucide:check-circle-2" class="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
        <span class="font-medium">{form?.message || "Pengaturan situs berhasil disimpan."}</span>
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
      action="?/save"
      novalidate
      use:enhance={({ action, cancel }) => {
        const resetting = action.search === "?/reset";
        showSuccess = false;
        if (!resetting) {
          hasSubmitted = true;
          if (!siteTitle.trim() || !HEX_COLOR_RE.test(blogAccentColor.trim())) {
            cancel();
            return;
          }
          isSaving = true;
        } else {
          hasSubmitted = false;
          isResetting = true;
        }
        return async ({ result, update }) => {
          isSaving = false;
          isResetting = false;
          await update({ reset: false });
          if (result.type === "success") {
            showSuccess = true;
            await invalidateAll();
          }
        };
      }}
      class="space-y-4"
    >
      <Textfield
        id="siteTitle"
        name="siteTitle"
        label="Judul Situs (Title)"
        placeholder="Nawra CMS"
        bind:value={siteTitle}
        isError={Boolean(titleError)}
        supporting={titleError ? [titleError] : []}
        required
      />

      <Textfield
        id="siteTagline"
        name="siteTagline"
        label="Tagline Situs"
        placeholder="Kumpulan artikel dan informasi terbaru."
        bind:value={siteTagline}
        supporting={["Ditampilkan sebagai subjudul pada halaman blog publik."]}
      />

      <div class="flex flex-col gap-1.5">
        <label for="siteDescription" class="block text-xs font-semibold text-gray-700">
          Deskripsi Situs (Meta Description)
        </label>
        <textarea
          id="siteDescription"
          name="siteDescription"
          rows={3}
          bind:value={siteDescription}
          placeholder="Sistem Manajemen Konten (CMS) Visual Modern tanpa koding di Cloudflare Edge."
          class="w-full resize-none rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm leading-relaxed text-gray-900 transition-all placeholder:text-gray-400 focus:border-[#0d99ff] focus:ring-1 focus:ring-[#0d99ff] focus:outline-none"
        ></textarea>
        <p class="text-[11px] text-gray-500">
          Digunakan untuk tag meta description pada halaman beranda.
        </p>
      </div>

      <FaviconUploadField bind:value={siteFavicon} />

      <LightColorPicker
        id="blogAccentColor"
        name="blogAccentColor"
        label="Warna Aksen Blog"
        bind:value={blogAccentColor}
        isError={Boolean(accentError)}
        supporting={accentError ||
          "Digunakan untuk pill kategori aktif, badge, dan sorotan kartu blog."}
      />

      <div class="flex items-center justify-end gap-2 pt-2">
        <button
          type="submit"
          formaction="?/reset"
          disabled={isSaving || isResetting}
          class="cursor-pointer rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isResetting ? "Mereset..." : "Reset Default"}
        </button>
        <button
          type="submit"
          disabled={isSaving || isResetting}
          class="cursor-pointer rounded-xl bg-[#0d99ff] px-4 py-2 text-xs font-semibold text-white hover:bg-[#008ae6] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSaving ? "Menyimpan..." : "Simpan Pengaturan"}
        </button>
      </div>
    </form>
  </div>
</div>
