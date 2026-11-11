<script lang="ts">
  import "./layout.css";

  import favicon from "#lib/assets/favicon.svg";

  import { authStore } from "../lib/stores/auth.svelte";

  import type { LayoutProps } from "./$types";

  let { data, children }: LayoutProps = $props();

  $effect(() => {
    if (data.accessToken) {
      authStore.setAccessToken(data.accessToken);
    } else if (data.user) {
      authStore.setUser(data.user);
    } else {
      authStore.clear();
    }
  });
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

{@render children()}
