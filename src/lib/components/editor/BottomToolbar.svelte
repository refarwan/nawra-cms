<script lang="ts">
	import type { EditorState } from './editorState.svelte';
	import type { ElementType } from './types';
	import {
		MousePointer2,
		Hand,
		ChevronDown,
		Check,
		Columns2,
		Rows3,
		Type,
		Heading,
		AlignLeft,
		RectangleHorizontal,
		Link2,
		Image as ImageIcon
	} from 'lucide-svelte';

	let { editor }: { editor: EditorState } = $props();

	let activePopover = $state<string | null>(null);

	function togglePopover(name: string, e?: MouseEvent) {
		if (e) e.stopPropagation();
		activePopover = activePopover === name ? null : name;
	}

	function closePopover() {
		activePopover = null;
	}

	function setMoveTool(mode: 'select' | 'pan') {
		editor.tool = mode;
		closePopover();
	}

	function requestAddElement(type: ElementType, direction: 'row' | 'column' = 'row') {
		if (type === 'frame') {
			editor.pendingFrameDirection = direction;
		}
		if (editor.selectedElement && editor.selectedElement.type === 'frame') {
			editor.addElementToFrame(editor.selectedElement.id, type, { flexDirection: direction });
		} else {
			editor.setPendingElementType(type, direction);
		}
		closePopover();
	}
</script>

<svelte:window onclick={closePopover} />

<!-- Floating Bottom Island Toolbar Dock -->
<div
	role="toolbar"
	aria-label="Toolbar editor kanvas"
	class="absolute bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-1 rounded-2xl border border-[#333338] bg-[#1e1e20]/95 px-2.5 py-1.5 shadow-[0_12px_32px_rgba(0,0,0,0.6)] backdrop-blur-xl select-none"
>
	<!-- 1. Move / Hand Group -->
	<div class="relative flex items-center">
		<button
			onclick={() => setMoveTool('select')}
			title="Pilih Objek (V)"
			class="flex h-9 w-9 items-center justify-center rounded-xl transition {editor.tool ===
			'select'
				? 'bg-[#0d99ff] text-white shadow-md'
				: editor.tool === 'pan'
					? 'bg-[#0d99ff] text-white shadow-md'
					: 'text-neutral-400 hover:bg-[#2c2c30] hover:text-white'}"
		>
			{#if editor.tool === 'pan'}
				<Hand class="h-4 w-4" />
			{:else}
				<MousePointer2 class="h-4 w-4" />
			{/if}
		</button>

		<button
			onclick={(e) => togglePopover('move', e)}
			class="flex h-9 w-5 items-center justify-center rounded-lg text-neutral-400 transition hover:bg-[#2c2c30] hover:text-white"
			title="Pilihan alat seleksi & geser"
		>
			<ChevronDown class="h-3 w-3" />
		</button>

		<!-- Move Tool Popover Dropdown -->
		{#if activePopover === 'move'}
			<div
				role="menu"
				tabindex="0"
				onclick={(e) => e.stopPropagation()}
				onkeydown={(e) => e.key === 'Escape' && closePopover()}
				class="absolute bottom-full left-0 mb-3 w-52 rounded-xl border border-[#333338] bg-[#1c1c1f] p-1.5 text-xs text-white shadow-2xl backdrop-blur-xl"
			>
				<!-- Pilih / Move item -->
				<button
					onclick={() => setMoveTool('select')}
					class="flex w-full items-center justify-between rounded-lg px-2.5 py-2 transition {editor.tool ===
					'select'
						? 'bg-[#0d99ff] font-medium text-white'
						: 'text-neutral-300 hover:bg-[#29292e] hover:text-white'}"
				>
					<div class="flex items-center gap-2">
						<span class="flex w-3.5 items-center justify-center">
							{#if editor.tool === 'select'}
								<Check class="h-3.5 w-3.5" />
							{/if}
						</span>
						<MousePointer2 class="h-3.5 w-3.5" />
						<span>Pilih Objek (Move)</span>
					</div>
					<span class="font-mono text-[11px] opacity-70">V</span>
				</button>

				<!-- Geser / Hand Tool item -->
				<button
					onclick={() => setMoveTool('pan')}
					class="mt-0.5 flex w-full items-center justify-between rounded-lg px-2.5 py-2 transition {editor.tool ===
					'pan'
						? 'bg-[#0d99ff] font-medium text-white'
						: 'text-neutral-300 hover:bg-[#29292e] hover:text-white'}"
				>
					<div class="flex items-center gap-2">
						<span class="flex w-3.5 items-center justify-center">
							{#if editor.tool === 'pan'}
								<Check class="h-3.5 w-3.5" />
							{/if}
						</span>
						<Hand class="h-3.5 w-3.5" />
						<span>Geser Kanvas (Hand)</span>
					</div>
					<span class="font-mono text-[11px] opacity-70">H</span>
				</button>
			</div>
		{/if}
	</div>

	<div class="mx-1 h-5 w-[1px] bg-[#333338]"></div>

	<!-- 2. Flexbox Tool (Baris & Kolom) -->
	<div class="relative flex items-center">
		<button
			onclick={() => requestAddElement('frame', 'row')}
			class="flex h-9 w-9 items-center justify-center rounded-xl transition {editor.pendingElementType ===
			'frame'
				? 'bg-[#0d99ff] text-white shadow-md'
				: 'text-neutral-400 hover:bg-[#2c2c30] hover:text-white'}"
			title="Flexbox (Tata Letak)"
		>
			<Columns2 class="h-4 w-4" />
		</button>
		<button
			onclick={(e) => togglePopover('flexbox', e)}
			class="flex h-9 w-5 items-center justify-center rounded-lg text-neutral-400 transition hover:bg-[#2c2c30] hover:text-white"
			title="Pilihan arah Flexbox"
		>
			<ChevronDown class="h-3 w-3" />
		</button>

		{#if activePopover === 'flexbox'}
			<div
				role="menu"
				tabindex="0"
				onclick={(e) => e.stopPropagation()}
				onkeydown={(e) => e.key === 'Escape' && closePopover()}
				class="absolute bottom-full left-0 mb-3 w-56 rounded-xl border border-[#333338] bg-[#1c1c1f] p-1.5 text-xs text-white shadow-2xl backdrop-blur-xl"
			>
				<button
					onclick={() => requestAddElement('frame', 'row')}
					class="flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-neutral-300 transition hover:bg-[#29292e] hover:text-white"
				>
					<div class="flex items-center gap-2">
						<Columns2 class="h-3.5 w-3.5 text-[#0d99ff]" />
						<span>Flexbox Baris (Horizontal)</span>
					</div>
				</button>
				<button
					onclick={() => requestAddElement('frame', 'column')}
					class="mt-0.5 flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-neutral-300 transition hover:bg-[#29292e] hover:text-white"
				>
					<div class="flex items-center gap-2">
						<Rows3 class="h-3.5 w-3.5 text-[#0d99ff]" />
						<span>Flexbox Kolom (Vertikal)</span>
					</div>
				</button>
			</div>
		{/if}
	</div>

	<!-- 3. Teks Tool (Judul dan Paragraf) -->
	<div class="relative flex items-center">
		<button
			onclick={() => requestAddElement('heading')}
			class="flex h-9 w-9 items-center justify-center rounded-xl transition {editor.pendingElementType ===
				'heading' || editor.pendingElementType === 'text'
				? 'bg-[#0d99ff] text-white shadow-md'
				: 'text-neutral-400 hover:bg-[#2c2c30] hover:text-white'}"
			title="Teks (Judul / Paragraf)"
		>
			<Type class="h-4 w-4" />
		</button>
		<button
			onclick={(e) => togglePopover('text', e)}
			class="flex h-9 w-5 items-center justify-center rounded-lg text-neutral-400 transition hover:bg-[#2c2c30] hover:text-white"
			title="Pilihan jenis teks"
		>
			<ChevronDown class="h-3 w-3" />
		</button>

		{#if activePopover === 'text'}
			<div
				role="menu"
				tabindex="0"
				onclick={(e) => e.stopPropagation()}
				onkeydown={(e) => e.key === 'Escape' && closePopover()}
				class="absolute bottom-full left-0 mb-3 w-48 rounded-xl border border-[#333338] bg-[#1c1c1f] p-1.5 text-xs text-white shadow-2xl backdrop-blur-xl"
			>
				<button
					onclick={() => requestAddElement('heading')}
					class="flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-neutral-300 transition hover:bg-[#29292e] hover:text-white"
				>
					<div class="flex items-center gap-2">
						<Heading class="h-3.5 w-3.5 text-[#0d99ff]" />
						<span>Judul (Heading)</span>
					</div>
					<span class="font-mono text-[11px] opacity-70">H</span>
				</button>
				<button
					onclick={() => requestAddElement('text')}
					class="mt-0.5 flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-neutral-300 transition hover:bg-[#29292e] hover:text-white"
				>
					<div class="flex items-center gap-2">
						<AlignLeft class="h-3.5 w-3.5 text-[#0d99ff]" />
						<span>Paragraf</span>
					</div>
					<span class="font-mono text-[11px] opacity-70">T</span>
				</button>
			</div>
		{/if}
	</div>

	<div class="mx-1 h-5 w-[1px] bg-[#333338]"></div>

	<!-- 4. Tombol (Button) -->
	<button
		onclick={() => requestAddElement('button')}
		class="flex h-9 w-9 items-center justify-center rounded-xl transition {editor.pendingElementType ===
		'button'
			? 'bg-[#0d99ff] text-white shadow-md'
			: 'text-neutral-400 hover:bg-[#2c2c30] hover:text-white'}"
		title="Tombol"
	>
		<RectangleHorizontal class="h-4 w-4" />
	</button>

	<!-- 5. Tautan (Link) -->
	<button
		onclick={() => requestAddElement('link')}
		class="flex h-9 w-9 items-center justify-center rounded-xl transition {editor.pendingElementType ===
		'link'
			? 'bg-[#0d99ff] text-white shadow-md'
			: 'text-neutral-400 hover:bg-[#2c2c30] hover:text-white'}"
		title="Tautan (Link)"
	>
		<Link2 class="h-4 w-4" />
	</button>

	<!-- 6. Gambar (Image) -->
	<button
		onclick={() => requestAddElement('image')}
		class="flex h-9 w-9 items-center justify-center rounded-xl transition {editor.pendingElementType ===
		'image'
			? 'bg-[#0d99ff] text-white shadow-md'
			: 'text-neutral-400 hover:bg-[#2c2c30] hover:text-white'}"
		title="Gambar"
	>
		<ImageIcon class="h-4 w-4" />
	</button>

	<!-- 7. Iframe YouTube -->
	<button
		onclick={() => requestAddElement('youtube')}
		class="flex h-9 w-9 items-center justify-center rounded-xl transition {editor.pendingElementType ===
		'youtube'
			? 'bg-[#0d99ff] text-white shadow-md'
			: 'text-neutral-400 hover:bg-[#2c2c30] hover:text-white'}"
		title="Iframe YouTube"
	>
		<svg class="h-4 w-4 fill-red-500" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
			<path
				d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
			/>
		</svg>
	</button>
</div>
