<script lang="ts">
  import Editor from "#lib/components/editor/Editor.svelte";

  import type { PageProps } from "./$types";

  let { data }: PageProps = $props();
</script>

<svelte:head>
  <title>Nawra CMS — No-Code Visual Studio</title>
</svelte:head>

<Editor serverTimestamp={data.serverTimestamp} cfCountry={data.cfCountry} />
