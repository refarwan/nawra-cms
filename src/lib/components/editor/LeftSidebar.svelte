<script lang="ts">
	import type { EditorState } from './editorState.svelte';
	import type { CanvasElement } from './types';
	import {
		Layers,
		Eye,
		EyeOff,
		Lock,
		Unlock,
		Trash2,
		Copy,
		ChevronUp,
		ChevronDown,
		Type,
		Heading as HeadingIcon,
		Square,
		RectangleHorizontal,
		Image as ImageIcon,
		Tag
	} from 'lucide-svelte';

	let { editor }: { editor: EditorState } = $props();

	function getIcon(type: CanvasElement['type']) {
		switch (type) {
			case 'heading':
				return HeadingIcon;
			case 'text':
				return Type;
			case 'button':
				return RectangleHorizontal;
			case 'badge':
				return Tag;
			case 'image':
				return ImageIcon;
			case 'frame':
			case 'rectangle':
			default:
				return Square;
		}
	}
</script>

<aside
	class="flex h-full w-64 flex-col border-r border-[#2c2c2c] bg-[#1e1e1e] text-xs text-neutral-300"
>
	<!-- Header: Layers Title & Counter -->
	<div
		class="flex h-10 items-center justify-between border-b border-[#2c2c2c] bg-[#222222] px-3 font-medium text-white select-none"
	>
		<div class="flex items-center gap-2">
			<Layers class="h-4 w-4 text-[#0d99ff]" />
			<span class="text-xs font-semibold">Layers</span>
		</div>
		<span class="rounded bg-[#2c2c2c] px-1.5 py-0.5 text-[10px] text-neutral-400">
			{editor.elements.length}
		</span>
	</div>

	<!-- Content Area: Layers List -->
	<div class="flex-1 space-y-0.5 overflow-y-auto p-1.5">
		{#each [...editor.elements].reverse() as element (element.id)}
			{@const Icon = getIcon(element.type)}
			{@const isSelected = editor.selectedId === element.id}
			<div
				role="button"
				tabindex="0"
				onclick={() => editor.selectElement(element.id)}
				onkeydown={(e) => e.key === 'Enter' && editor.selectElement(element.id)}
				class="group flex items-center justify-between rounded px-2 py-1.5 transition select-none {isSelected
					? 'bg-[#0d99ff] font-medium text-white shadow-sm'
					: 'text-neutral-300 hover:bg-[#2c2c2c]'}"
			>
				<div class="flex items-center gap-2 overflow-hidden">
					<Icon class="h-3.5 w-3.5 shrink-0 {isSelected ? 'text-white' : 'text-neutral-400'}" />
					<span class="truncate text-xs">{element.name}</span>
				</div>

				<!-- Action Icons (visible on hover or when selected) -->
				<div
					class="flex items-center gap-1 opacity-0 transition group-hover:opacity-100 {isSelected
						? 'opacity-100'
						: ''}"
				>
					<!-- Hide / Show -->
					<button
						onclick={(e) => {
							e.stopPropagation();
							editor.toggleVisibility(element.id);
						}}
						class="rounded p-0.5 hover:bg-black/20"
						title={element.hidden ? 'Tampilkan' : 'Sembunyikan'}
					>
						{#if element.hidden}
							<EyeOff class="h-3 w-3 text-red-400" />
						{:else}
							<Eye class="h-3 w-3" />
						{/if}
					</button>

					<!-- Lock / Unlock -->
					<button
						onclick={(e) => {
							e.stopPropagation();
							editor.toggleLock(element.id);
						}}
						class="rounded p-0.5 hover:bg-black/20"
						title={element.locked ? 'Buka Kunci' : 'Kunci Elemen'}
					>
						{#if element.locked}
							<Lock class="h-3 w-3 text-amber-400" />
						{:else}
							<Unlock class="h-3 w-3 opacity-60" />
						{/if}
					</button>

					<!-- Reorder Layers -->
					<button
						onclick={(e) => {
							e.stopPropagation();
							editor.moveLayer(element.id, 'up');
						}}
						class="rounded p-0.5 hover:bg-black/20"
						title="Bawa ke Atas"
					>
						<ChevronUp class="h-3 w-3" />
					</button>
					<button
						onclick={(e) => {
							e.stopPropagation();
							editor.moveLayer(element.id, 'down');
						}}
						class="rounded p-0.5 hover:bg-black/20"
						title="Bawa ke Bawah"
					>
						<ChevronDown class="h-3 w-3" />
					</button>

					<!-- Duplicate -->
					<button
						onclick={(e) => {
							e.stopPropagation();
							editor.duplicateElement(element.id);
						}}
						class="rounded p-0.5 hover:bg-black/20"
						title="Duplikat (Ctrl+D)"
					>
						<Copy class="h-3 w-3" />
					</button>

					<!-- Delete -->
					<button
						onclick={(e) => {
							e.stopPropagation();
							editor.deleteElement(element.id);
						}}
						class="rounded p-0.5 text-red-400 hover:bg-red-500/20"
						title="Hapus"
					>
						<Trash2 class="h-3 w-3" />
					</button>
				</div>
			</div>
		{/each}

		{#if editor.elements.length === 0}
			<div class="p-6 text-center text-neutral-500">
				<p>Belum ada layer.</p>
				<p class="mt-1 text-[11px]">Pilih tool di atas untuk menambahkan elemen ke kanvas.</p>
			</div>
		{/if}
	</div>
</aside>
