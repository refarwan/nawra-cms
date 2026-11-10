<script lang="ts">
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<main class="mx-auto max-w-xl p-8 font-sans">
	<h1 class="mb-4 text-3xl font-bold">Nawra CMS</h1>
	<div class="space-y-2 rounded-lg border border-gray-200 bg-gray-50 p-6 shadow-sm">
		<div class="flex items-center gap-2">
			<span class="inline-block h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
			<p class="font-semibold text-gray-800">Deployment Status: SSR Aktif di Cloudflare Workers</p>
		</div>
		<p class="text-sm text-gray-600">
			Halaman ini di-render di server edge Cloudflare sebelum dikirim ke browser:
		</p>
		<ul class="list-disc pl-5 text-sm text-gray-700">
			<li>Waktu Render Server: <code>{data.serverTimestamp}</code></li>
			<li>Edge Country: <code>{data.cfCountry}</code></li>
		</ul>
	</div>
</main>
