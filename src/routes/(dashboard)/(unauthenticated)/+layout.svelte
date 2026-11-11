<script lang="ts">
  import { goto } from "$app/navigation";
  import { resolve } from "$app/paths";

  import { authStore } from "../../../lib/stores/auth.svelte";

  import type { LayoutProps } from "./$types";

  let { data, children }: LayoutProps = $props();

  $effect(() => {
    if ((authStore.initialized && authStore.accessToken) || data?.user) {
      void goto(resolve("/(dashboard)/(authenticated)/dashboard"), {
        replace: true,
        replaceState: true
      });
    }
  });
</script>

{#if !authStore.accessToken && !data?.user}
  {@render children()}
{/if}
