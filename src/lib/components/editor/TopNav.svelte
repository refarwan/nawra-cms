<script lang="ts">
	import { resolve } from '$app/paths';
	import type { EditorState } from './editorState.svelte';
	import type { ToolMode, ElementType, DeviceMode } from './types';
	import {
		MousePointer,
		Square,
		Heading as HeadingIcon,
		Type,
		RectangleHorizontal,
		Image as ImageIcon,
		Tag,
		Hand,
		Undo2,
		Redo2,
		ZoomIn,
		ZoomOut,
		Monitor,
		Tablet,
		Smartphone,
		Eye,
		UploadCloud,
		Sparkles
	} from 'lucide-svelte';

	type LucideIcon = typeof MousePointer;

	let { editor }: { editor: EditorState } = $props();

	const tools: { mode: ToolMode; label: string; icon: LucideIcon; shortcut: string }[] = [
		{ mode: 'select', label: 'Pilih', icon: MousePointer, shortcut: 'V' },
		{ mode: 'pan', label: 'Geser', icon: Hand, shortcut: 'H' },
		{ mode: 'rectangle', label: 'Kotak', icon: Square, shortcut: 'R' },
		{ mode: 'heading', label: 'Judul', icon: HeadingIcon, shortcut: 'H' },
		{ mode: 'text', label: 'Teks', icon: Type, shortcut: 'T' },
		{ mode: 'button', label: 'Tombol', icon: RectangleHorizontal, shortcut: 'B' },
		{ mode: 'badge', label: 'Label', icon: Tag, shortcut: 'G' },
		{ mode: 'image', label: 'Gambar', icon: ImageIcon, shortcut: 'I' }
	];

	const devices: { mode: DeviceMode; label: string; icon: LucideIcon }[] = [
		{ mode: 'desktop', label: 'Komputer / Desktop', icon: Monitor },
		{ mode: 'tablet', label: 'Tablet', icon: Tablet },
		{ mode: 'mobile', label: 'Smartphone', icon: Smartphone }
	];

	function selectTool(mode: ToolMode) {
		if (mode === 'select' || mode === 'pan') {
			editor.tool = mode;
		} else {
			editor.addElement(mode as ElementType);
		}
	}
</script>

<header
	class="flex h-12 w-full items-center justify-between border-b border-[#2c2c2c] bg-[#1e1e1e] px-3 text-[#d3d3d3] select-none"
>
	<!-- Left: Logo & File Info -->
	<div class="flex items-center gap-3">
		<a
			href={resolve('/')}
			title="Kembali ke Beranda"
			class="flex items-center gap-2 rounded px-1.5 py-1 transition hover:bg-[#2c2c2c]"
		>
			<!-- Colorful studio icon -->
			<div
				class="flex h-6 w-6 items-center justify-center rounded bg-gradient-to-tr from-[#0d99ff] via-[#9747ff] to-[#ff4785] p-1 shadow-sm"
			>
				<Sparkles class="h-3.5 w-3.5 text-white" />
			</div>
			<div class="flex flex-col">
				<span class="text-xs font-semibold text-white">Nawra CMS</span>
				<span class="text-[10px] text-neutral-400">Editor Visual Tanpa Koding</span>
			</div>
		</a>

		<div class="h-4 w-[1px] bg-[#333]"></div>

		<!-- Undo / Redo -->
		<div class="flex items-center gap-1">
			<button
				onclick={() => editor.undo()}
				disabled={editor.historyIndex <= 0}
				class="flex h-7 w-7 items-center justify-center rounded text-neutral-400 transition hover:bg-[#2c2c2c] hover:text-white disabled:opacity-30"
				title="Undo (Ctrl+Z)"
			>
				<Undo2 class="h-4 w-4" />
			</button>
			<button
				onclick={() => editor.redo()}
				disabled={editor.historyIndex >= editor.history.length - 1}
				class="flex h-7 w-7 items-center justify-center rounded text-neutral-400 transition hover:bg-[#2c2c2c] hover:text-white disabled:opacity-30"
				title="Redo (Ctrl+Y)"
			>
				<Redo2 class="h-4 w-4" />
			</button>
		</div>
	</div>

	<!-- Center: Visual Toolbar Tools -->
	<div class="flex items-center gap-1 rounded-lg bg-[#2c2c2c] p-1 shadow-inner">
		{#each tools as item (item.mode)}
			{@const Icon = item.icon}
			<button
				onclick={() => selectTool(item.mode)}
				class="relative flex h-8 items-center gap-1 rounded px-2.5 text-xs font-medium transition {editor.tool ===
				item.mode
					? 'bg-[#0d99ff] text-white shadow'
					: 'text-neutral-300 hover:bg-[#383838] hover:text-white'}"
				title="{item.label} ({item.shortcut})"
			>
				<Icon class="h-4 w-4" />
				<span class="hidden md:inline">{item.label}</span>
			</button>
		{/each}
	</div>

	<!-- Right: Device Mode, Preview, Zoom & Publish -->
	<div class="flex items-center gap-2">
		<!-- Device Preview Switcher -->
		<div class="flex items-center rounded-md bg-[#2c2c2c] p-0.5 text-xs">
			{#each devices as dev (dev.mode)}
				{@const DevIcon = dev.icon}
				<button
					onclick={() => editor.setDevice(dev.mode)}
					class="flex h-7 items-center gap-1 rounded px-2 transition {editor.device === dev.mode
						? 'bg-[#383838] font-medium text-white shadow-sm'
						: 'text-neutral-400 hover:text-white'}"
					title={dev.label}
				>
					<DevIcon class="h-3.5 w-3.5" />
				</button>
			{/each}
		</div>

		<div class="h-4 w-[1px] bg-[#333]"></div>

		<!-- Zoom Controls -->
		<div class="flex items-center gap-1 rounded bg-[#2c2c2c] px-1 py-0.5 text-xs">
			<button
				onclick={() => editor.zoomOut()}
				class="p-1 text-neutral-400 hover:text-white"
				title="Perkecil Tampilan"
			>
				<ZoomOut class="h-3.5 w-3.5" />
			</button>
			<button
				onclick={() => editor.resetZoom()}
				class="px-1 font-mono text-[11px] font-medium text-neutral-300 hover:text-white"
				title="Kembalikan ke 100%"
			>
				{Math.round(editor.zoom * 100)}%
			</button>
			<button
				onclick={() => editor.zoomIn()}
				class="p-1 text-neutral-400 hover:text-white"
				title="Perbesar Tampilan"
			>
				<ZoomIn class="h-3.5 w-3.5" />
			</button>
		</div>

		<div class="h-4 w-[1px] bg-[#333]"></div>

		<!-- Visitor Preview Toggle -->
		<button
			onclick={() => (editor.isPreviewMode = !editor.isPreviewMode)}
			class="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition {editor.isPreviewMode
				? 'border border-amber-500/40 bg-amber-500/20 text-amber-300'
				: 'bg-[#2c2c2c] text-neutral-300 hover:bg-[#383838] hover:text-white'}"
			title="Lihat seperti pengunjung asli"
		>
			<Eye class="h-3.5 w-3.5" />
			<span class="hidden sm:inline">{editor.isPreviewMode ? 'Tutup Pratinjau' : 'Pratinjau'}</span>
		</button>

		<!-- Publish Website CTA -->
		<button
			onclick={() => editor.publish()}
			class="flex items-center gap-1.5 rounded-md bg-gradient-to-r from-emerald-500 to-teal-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-md transition hover:brightness-110 active:scale-95"
		>
			<UploadCloud class="h-3.5 w-3.5" />
			<span>Publikasikan</span>
		</button>
	</div>
</header>
