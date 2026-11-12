<script lang="ts">
  import "./layout.css";
  import "@fontsource/poppins/100.css";
  import "@fontsource/poppins/200.css";
  import "@fontsource/poppins/300.css";
  import "@fontsource/poppins/400.css";
  import "@fontsource/poppins/500.css";
  import "@fontsource/poppins/600.css";
  import "@fontsource/poppins/700.css";
  import "@fontsource/poppins/800.css";
  import "@fontsource/poppins/900.css";

  import PopupContainer from "#lib/components/PopupContainer.svelte";
  import TopLoader from "#lib/components/TopLoader.svelte";
  import { authStore } from "#lib/stores/auth.svelte";

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
  <link rel="icon" href={data.siteSettings.siteFavicon || "/favicon.svg"} />
</svelte:head>

<TopLoader />
{@render children()}
<PopupContainer />
