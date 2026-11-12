<script lang="ts">
  import { authStore } from "../../../lib/stores/auth.svelte";

  import type { LayoutProps } from "./$types";

  let { children }: LayoutProps = $props();

  // Pastikan store auth bersih saat berada di layout unauthenticated
  if (authStore.user || authStore.accessToken) {
    authStore.clear();
  }

  $effect(() => {
    if (authStore.user || authStore.accessToken) {
      authStore.clear();
    }
  });
</script>

{@render children()}
