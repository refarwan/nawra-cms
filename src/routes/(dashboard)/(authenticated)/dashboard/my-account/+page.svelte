<script lang="ts">
  import { onDestroy, onMount, tick } from "svelte";
  import Icon from "@iconify/svelte";

  import { enhance } from "$app/forms";

  import Textfield from "#lib/components/Textfield.svelte";
  import { getEmailErrors, getUsernameErrors } from "#lib/utils/form-validation";

  import { pageTitleStore } from "../../../stores/page-title.svelte";
  import ProfileAvatarSection from "./components/ProfileAvatarSection.svelte";

  import type { ActionData, PageProps } from "./$types";

  let { data, form }: PageProps & { form?: ActionData } = $props();

  let submitting = $state(false);
  let hasSubmitted = $state(false);
  let avatarFormEl = $state<HTMLFormElement>();
  let pendingAvatarUrl = $state("");

  let username = $state("");
  let name = $state("");
  let email = $state("");
  let serverFieldErrors = $state<{ username?: string; email?: string }>({});

  $effect(() => {
    username = data.user?.username || "";
    name = data.user?.name || "";
    email = data.user?.email || "";
  });

  $effect(() => {
    const f = form as { fieldErrors?: { username?: string; email?: string } } | undefined;
    serverFieldErrors = f?.fieldErrors ?? {};
  });

  const usernameErrors = $derived(
    getUsernameErrors(username, hasSubmitted, serverFieldErrors.username)
  );
  const emailErrors = $derived(getEmailErrors(email, hasSubmitted, serverFieldErrors.email));

  onMount(() => {
    pageTitleStore.set("Akun Saya");
  });

  onDestroy(() => {
    pageTitleStore.reset();
  });

  async function handleSaveAvatar(url: string) {
    pendingAvatarUrl = url;
    await tick();
    avatarFormEl?.requestSubmit();
  }
</script>

<svelte:head>
  <title>Akun Saya · {data.siteSettings.siteTitle}</title>
</svelte:head>

<form bind:this={avatarFormEl} method="POST" action="?/updateAvatar" use:enhance class="hidden">
  <input type="hidden" name="avatarUrl" value={pendingAvatarUrl} />
</form>

<div class="mx-auto max-w-2xl space-y-6">
  <div class="rounded-2xl border border-gray-200/80 bg-white p-6 md:p-8">
    <ProfileAvatarSection user={data.user} onSaveAvatar={handleSaveAvatar} />

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
      action="?/updateProfile"
      novalidate
      use:enhance={({ cancel }) => {
        hasSubmitted = true;
        if (usernameErrors.length > 0 || emailErrors.length > 0) {
          cancel();
          return;
        }
        submitting = true;
        return async ({ update }) => {
          submitting = false;
          await update({ reset: false });
        };
      }}
      class="mt-6 space-y-4"
    >
      <Textfield
        id="username"
        name="username"
        label="Username"
        required
        bind:value={username}
        placeholder="username_anda"
        isError={usernameErrors.length > 0}
        supporting={usernameErrors.length > 0
          ? usernameErrors
          : ["Username unik untuk login ke dashboard (3-30 karakter)."]}
        oninput={() => {
          serverFieldErrors = { ...serverFieldErrors, username: undefined };
        }}
      />

      <Textfield
        id="name"
        name="name"
        label="Nama Lengkap"
        bind:value={name}
        placeholder="Nama Anda"
      />

      <Textfield
        id="email"
        name="email"
        type="email"
        label="Alamat Email"
        required
        bind:value={email}
        placeholder="nama@email.com"
        isError={emailErrors.length > 0}
        supporting={emailErrors}
        oninput={() => {
          serverFieldErrors = { ...serverFieldErrors, email: undefined };
        }}
      />

      <div class="flex justify-end pt-2">
        <button
          type="submit"
          disabled={submitting}
          class="cursor-pointer rounded-xl bg-[#0d99ff] px-4 py-2 text-xs font-semibold text-white hover:bg-[#008ae6] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? "Menyimpan..." : "Simpan"}
        </button>
      </div>
    </form>
  </div>
</div>
