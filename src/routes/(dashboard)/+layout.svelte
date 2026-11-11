<script lang="ts">
  import { onMount } from "svelte";
  import Icon from "@iconify/svelte";

  import { authStore } from "../../lib/stores/auth.svelte";

  import type { LayoutProps } from "./$types";

  let { data, children }: LayoutProps = $props();

  $effect(() => {
    if (data.accessToken) {
      authStore.setAccessToken(data.accessToken);
    } else if (data.user) {
      authStore.setUser(data.user);
    }
  });

  onMount(async () => {
    if (authStore.initialized && (authStore.accessToken || authStore.user)) return;

    try {
      const res = await fetch("/api/auth/check");
      if (res.ok) {
        const result = await res.json();
        if (result.status === "authenticated" && result.accessToken) {
          authStore.setAccessToken(result.accessToken);
        } else {
          authStore.clear();
        }
      } else {
        authStore.clear();
      }
    } catch {
      if (!authStore.initialized) {
        authStore.clear();
      }
    }
  });
</script>

<div class="min-h-screen bg-gray-50 font-sans text-gray-900 antialiased">
  {#if authStore.initialized || data.user || data.accessToken}
    {@render children()}
  {:else}
    <div class="flex min-h-screen items-center justify-center">
      <div class="flex flex-col items-center gap-3 text-gray-500">
        <Icon icon="lucide:loader-2" class="h-8 w-8 animate-spin text-[#0d99ff]" />
        <span class="text-sm font-medium">Memuat data sesi...</span>
      </div>
    </div>
  {/if}
</div>
