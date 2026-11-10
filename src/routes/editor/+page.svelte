<script lang="ts">
	import type { PageProps } from './$types';
	import Editor from '#lib/components/editor/Editor.svelte';

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>Nawra CMS — No-Code Visual Studio</title>
</svelte:head>

<Editor serverTimestamp={data.serverTimestamp} cfCountry={data.cfCountry} />
