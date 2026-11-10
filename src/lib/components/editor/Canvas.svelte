<script lang="ts">
	import type { EditorState } from './editorState.svelte';
	import type { CanvasElement } from './types';
	import { Eye } from 'lucide-svelte';

	let { editor }: { editor: EditorState } = $props();

	let isDragging = $state(false);
	let dragStartPos = $state({ x: 0, y: 0 });
	let elementStartPos = $state({ x: 0, y: 0 });

	let isResizing = $state(false);
	let resizeHandle = $state<string | null>(null);
	let initialBox = $state({ x: 0, y: 0, w: 0, h: 0 });

	let isCanvasPanning = $state(false);
	let isSpacePressed = $state(false);
	let panStart = $state({ x: 0, y: 0 });

	const isPanActive = $derived(editor.tool === 'pan' || isSpacePressed);
	const canvasCursorClass = $derived(
		isCanvasPanning ? 'cursor-grabbing' : isPanActive ? 'cursor-grab' : 'cursor-default'
	);

	function onCanvasMouseDown(e: MouseEvent) {
		// If clicking directly on canvas or spacebar/hand tool active
		if (isPanActive || e.button === 1) {
			isCanvasPanning = true;
			panStart = { x: e.clientX - editor.pan.x, y: e.clientY - editor.pan.y };
			return;
		}

		// Deselect if clicking on empty space of frame/canvas
		const target = e.target as HTMLElement;
		if (target.dataset.role === 'canvas-background' || target.dataset.role === 'artboard') {
			editor.selectElement(null);
		}
	}

	function onElementMouseDown(e: MouseEvent, el: CanvasElement) {
		if (isPanActive || e.button === 1) {
			onCanvasMouseDown(e);
			return;
		}
		if (el.locked || editor.isPreviewMode) return;
		e.stopPropagation();

		editor.selectElement(el.id);
		isDragging = true;
		dragStartPos = { x: e.clientX, y: e.clientY };
		elementStartPos = { x: el.x, y: el.y };
	}

	function onResizeMouseDown(e: MouseEvent, handle: string) {
		e.stopPropagation();
		if (!editor.selectedElement || editor.selectedElement.locked) return;

		isResizing = true;
		resizeHandle = handle;
		dragStartPos = { x: e.clientX, y: e.clientY };
		initialBox = {
			x: editor.selectedElement.x,
			y: editor.selectedElement.y,
			w: editor.selectedElement.width,
			h: editor.selectedElement.height
		};
	}

	function onMouseMove(e: MouseEvent) {
		if (isCanvasPanning) {
			editor.pan = {
				x: e.clientX - panStart.x,
				y: e.clientY - panStart.y
			};
			return;
		}

		if (isDragging && editor.selectedElement) {
			const dx = (e.clientX - dragStartPos.x) / editor.zoom;
			const dy = (e.clientY - dragStartPos.y) / editor.zoom;

			editor.updateElement(editor.selectedElement.id, {
				x: Math.round(elementStartPos.x + dx),
				y: Math.round(elementStartPos.y + dy)
			});
			return;
		}

		if (isResizing && editor.selectedElement && resizeHandle) {
			const dx = (e.clientX - dragStartPos.x) / editor.zoom;
			const dy = (e.clientY - dragStartPos.y) / editor.zoom;

			let newX = initialBox.x;
			let newY = initialBox.y;
			let newW = initialBox.w;
			let newH = initialBox.h;

			if (resizeHandle.includes('e')) newW = Math.max(20, initialBox.w + dx);
			if (resizeHandle.includes('s')) newH = Math.max(20, initialBox.h + dy);
			if (resizeHandle.includes('w')) {
				const potentialW = initialBox.w - dx;
				if (potentialW > 20) {
					newW = potentialW;
					newX = initialBox.x + dx;
				}
			}
			if (resizeHandle.includes('n')) {
				const potentialH = initialBox.h - dy;
				if (potentialH > 20) {
					newH = potentialH;
					newY = initialBox.y + dy;
				}
			}

			editor.updateElement(editor.selectedElement.id, {
				x: Math.round(newX),
				y: Math.round(newY),
				width: Math.round(newW),
				height: Math.round(newH)
			});
		}
	}

	function onMouseUp() {
		if (isDragging || isResizing) {
			isDragging = false;
			isResizing = false;
			resizeHandle = null;
			editor.commitUpdate();
		}
		if (isCanvasPanning) {
			isCanvasPanning = false;
		}
	}

	function onKeyDown(e: KeyboardEvent) {
		if (
			e.code === 'Space' &&
			!(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)
		) {
			isSpacePressed = true;
		}

		if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

		if (editor.selectedElement) {
			if (e.key === 'Delete' || e.key === 'Backspace') {
				e.preventDefault();
				editor.deleteElement(editor.selectedElement.id);
			} else if ((e.metaKey || e.ctrlKey) && e.key === 'd') {
				e.preventDefault();
				editor.duplicateElement(editor.selectedElement.id);
			} else if (e.key.startsWith('Arrow')) {
				e.preventDefault();
				const step = e.shiftKey ? 10 : 1;
				const current = editor.selectedElement;
				let { x, y } = current;
				if (e.key === 'ArrowUp') y -= step;
				if (e.key === 'ArrowDown') y += step;
				if (e.key === 'ArrowLeft') x -= step;
				if (e.key === 'ArrowRight') x += step;
				editor.updateElement(current.id, { x, y });
				editor.commitUpdate();
			}
		}

		if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
			e.preventDefault();
			if (e.shiftKey) {
				editor.redo();
			} else {
				editor.undo();
			}
		}
	}

	function onKeyUp(e: KeyboardEvent) {
		if (e.code === 'Space') {
			isSpacePressed = false;
		}
	}

	function gestureAction(node: HTMLElement) {
		const handleWheel = (e: WheelEvent) => {
			e.preventDefault();

			// 2-finger pinch on trackpad (macOS fires wheel with ctrlKey=true) or Cmd+scroll
			if (e.ctrlKey || e.metaKey) {
				const zoomFactor = Math.exp(-e.deltaY * 0.01);
				const nextZoom = Math.min(
					3.0,
					Math.max(0.15, Number((editor.zoom * zoomFactor).toFixed(2)))
				);
				editor.zoom = nextZoom;
			} else {
				// 2-finger swipe on trackpad to pan canvas
				editor.pan = {
					x: Math.round(editor.pan.x - e.deltaX),
					y: Math.round(editor.pan.y - e.deltaY)
				};
			}
		};

		let initialDistance = 0;
		let initialZoom = 1;
		let initialPan = { x: 0, y: 0 };
		let initialCenter = { x: 0, y: 0 };

		const onTouchStart = (e: TouchEvent) => {
			if (e.touches.length === 2) {
				e.preventDefault();
				const t1 = e.touches[0];
				const t2 = e.touches[1];
				initialDistance = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
				initialZoom = editor.zoom;
				initialPan = { ...editor.pan };
				initialCenter = {
					x: (t1.clientX + t2.clientX) / 2,
					y: (t1.clientY + t2.clientY) / 2
				};
			}
		};

		const onTouchMove = (e: TouchEvent) => {
			if (e.touches.length === 2) {
				e.preventDefault();
				const t1 = e.touches[0];
				const t2 = e.touches[1];
				const currentDistance = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
				if (initialDistance > 0) {
					const scale = currentDistance / initialDistance;
					const nextZoom = Math.min(3.0, Math.max(0.15, Number((initialZoom * scale).toFixed(2))));
					editor.zoom = nextZoom;
				}

				const currentCenter = {
					x: (t1.clientX + t2.clientX) / 2,
					y: (t1.clientY + t2.clientY) / 2
				};
				editor.pan = {
					x: Math.round(initialPan.x + (currentCenter.x - initialCenter.x)),
					y: Math.round(initialPan.y + (currentCenter.y - initialCenter.y))
				};
			}
		};

		node.addEventListener('wheel', handleWheel, { passive: false });
		node.addEventListener('touchstart', onTouchStart, { passive: false });
		node.addEventListener('touchmove', onTouchMove, { passive: false });

		return {
			destroy() {
				node.removeEventListener('wheel', handleWheel);
				node.removeEventListener('touchstart', onTouchStart);
				node.removeEventListener('touchmove', onTouchMove);
			}
		};
	}
</script>

<svelte:window
	onmousemove={onMouseMove}
	onmouseup={onMouseUp}
	onkeydown={onKeyDown}
	onkeyup={onKeyUp}
/>

<!-- Canvas Viewport -->
<div
	use:gestureAction
	role="region"
	aria-label="Design Canvas"
	data-role="canvas-background"
	onmousedown={onCanvasMouseDown}
	class="relative flex-1 overflow-hidden bg-[#141414] select-none {canvasCursorClass}"
	style="background-image: radial-gradient(#2d2d2d 1px, transparent 1px); background-size: 20px 20px; cursor: {isCanvasPanning
		? 'grabbing'
		: isPanActive
			? 'grab'
			: 'default'};"
>
	<!-- Visitor Preview Mode Header Indicator -->
	{#if editor.isPreviewMode}
		<div
			class="absolute top-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-full border border-neutral-700 bg-neutral-900/90 px-4 py-2 text-xs text-white shadow-2xl backdrop-blur"
		>
			<span class="flex items-center gap-1.5 font-medium text-amber-400">
				<Eye class="h-3.5 w-3.5" />
				Mode Pratinjau Pengunjung
			</span>
			<button
				onclick={() => (editor.isPreviewMode = false)}
				class="rounded-full bg-[#0d99ff] px-3 py-1 font-semibold text-white shadow transition hover:brightness-110"
			>
				Kembali ke Desain
			</button>
		</div>
	{/if}
	<!-- Artboard Container with Pan & Zoom -->
	<div
		class="absolute top-1/2 left-1/2 origin-center transition-transform duration-75 ease-out"
		style="transform: translate(calc(-50% + {editor.pan.x}px), calc(-50% + {editor.pan
			.y}px)) scale({editor.zoom});"
	>
		<!-- Artboard Frame Label -->
		<div class="absolute -top-7 left-0 flex items-center gap-2">
			<span class="text-xs font-semibold text-neutral-400">{editor.frame.name}</span>
			<span class="rounded bg-[#222] px-1.5 py-0.5 text-[10px] text-neutral-400">
				{editor.frame.width} × {editor.frame.height}
			</span>
		</div>

		<!-- Artboard Surface -->
		<div
			data-role="artboard"
			class="relative shadow-2xl transition-all"
			style="
				width: {editor.frame.width}px;
				height: {editor.frame.height}px;
				background-color: {editor.frame.background};
				border-radius: 4px;
				box-shadow: 0 0 0 1px #222, 0 30px 60px -12px rgba(0,0,0,0.7);
				cursor: {isCanvasPanning ? 'grabbing' : isPanActive ? 'grab' : 'default'};
			"
		>
			<!-- Elements Render Loop -->
			{#each editor.elements as el (el.id)}
				{#if !el.hidden}
					{@const isSelected = editor.selectedId === el.id}

					<!-- Element Wrapper -->
					<div
						role="button"
						tabindex="0"
						onmousedown={(e) => onElementMouseDown(e, el)}
						class="absolute transition-shadow {isSelected ? 'z-40' : 'z-10'}"
						style="
							left: {el.x}px;
							top: {el.y}px;
							width: {el.width}px;
							height: {el.height}px;
							cursor: {isCanvasPanning
							? 'grabbing'
							: isPanActive
								? 'grab'
								: editor.isPreviewMode
									? 'default'
									: el.locked
										? 'not-allowed'
										: 'move'};
						"
					>
						<!-- Element Visual Rendering -->
						<div
							class="h-full w-full overflow-hidden"
							style="
								background-color: {el.fill};
								border-radius: {el.borderRadius}px;
								border-width: {el.borderWidth}px;
								border-color: {el.borderColor};
								border-style: {el.borderStyle};
								opacity: {el.opacity / 100};
								box-shadow: {el.boxShadow};
								transform: rotate({el.rotation}deg);
								color: {el.color || 'inherit'};
								font-size: {el.fontSize ? el.fontSize + 'px' : 'inherit'};
								font-weight: {el.fontWeight || 'normal'};
								font-family: {el.fontFamily || 'Inter'};
								text-align: {el.textAlign || 'left'};
							"
						>
							{#if el.type === 'heading'}
								<h2
									class="flex h-full w-full items-center leading-tight tracking-tight select-none"
								>
									{el.content}
								</h2>
							{:else if el.type === 'text'}
								<p class="h-full w-full leading-relaxed select-none">
									{el.content}
								</p>
							{:else if el.type === 'button'}
								<div
									class="flex h-full w-full items-center justify-center font-semibold select-none"
								>
									{el.content}
								</div>
							{:else if el.type === 'badge'}
								<div
									class="flex h-full w-full items-center justify-center font-semibold select-none"
								>
									{el.content}
								</div>
							{:else if el.type === 'image'}
								<img
									src={el.src}
									alt={el.alt || el.name}
									class="pointer-events-none h-full w-full object-cover select-none"
								/>
							{:else}
								<!-- Container / Frame / Rectangle -->
								<div class="h-full w-full"></div>
							{/if}
						</div>

						<!-- Interactive Bounding Box & Resize Handles (when selected) -->
						{#if isSelected && !el.locked && !editor.isPreviewMode && !isPanActive}
							<div
								class="pointer-events-none absolute -inset-[1px] border-[1.5px] border-[#0d99ff]"
							>
								<!-- Dimension Badge -->
								<div
									class="absolute -bottom-6 left-1/2 -translate-x-1/2 rounded bg-[#0d99ff] px-1.5 py-0.5 font-mono text-[10px] font-medium whitespace-nowrap text-white shadow-md"
								>
									{el.width} × {el.height}
								</div>
							</div>

							<!-- 8 Interactive Resize Handles -->
							<div
								role="slider"
								aria-label="Top Left resize handle"
								aria-valuenow={el.width}
								tabindex="0"
								onmousedown={(e) => onResizeMouseDown(e, 'nw')}
								class="pointer-events-auto absolute -top-1.5 -left-1.5 z-50 h-3 w-3 cursor-nwse-resize rounded-[2px] border border-[#0d99ff] bg-white shadow"
							></div>
							<div
								role="slider"
								aria-label="Top Center resize handle"
								aria-valuenow={el.height}
								tabindex="0"
								onmousedown={(e) => onResizeMouseDown(e, 'n')}
								class="pointer-events-auto absolute -top-1.5 left-1/2 z-50 h-3 w-3 -translate-x-1/2 cursor-ns-resize rounded-[2px] border border-[#0d99ff] bg-white shadow"
							></div>
							<div
								role="slider"
								aria-label="Top Right resize handle"
								aria-valuenow={el.width}
								tabindex="0"
								onmousedown={(e) => onResizeMouseDown(e, 'ne')}
								class="pointer-events-auto absolute -top-1.5 -right-1.5 z-50 h-3 w-3 cursor-nesw-resize rounded-[2px] border border-[#0d99ff] bg-white shadow"
							></div>
							<div
								role="slider"
								aria-label="Middle Right resize handle"
								aria-valuenow={el.width}
								tabindex="0"
								onmousedown={(e) => onResizeMouseDown(e, 'e')}
								class="pointer-events-auto absolute top-1/2 -right-1.5 z-50 h-3 w-3 -translate-y-1/2 cursor-ew-resize rounded-[2px] border border-[#0d99ff] bg-white shadow"
							></div>
							<div
								role="slider"
								aria-label="Bottom Right resize handle"
								aria-valuenow={el.width}
								tabindex="0"
								onmousedown={(e) => onResizeMouseDown(e, 'se')}
								class="pointer-events-auto absolute -right-1.5 -bottom-1.5 z-50 h-3 w-3 cursor-nwse-resize rounded-[2px] border border-[#0d99ff] bg-white shadow"
							></div>
							<div
								role="slider"
								aria-label="Bottom Center resize handle"
								aria-valuenow={el.height}
								tabindex="0"
								onmousedown={(e) => onResizeMouseDown(e, 's')}
								class="pointer-events-auto absolute -bottom-1.5 left-1/2 z-50 h-3 w-3 -translate-x-1/2 cursor-ns-resize rounded-[2px] border border-[#0d99ff] bg-white shadow"
							></div>
							<div
								role="slider"
								aria-label="Bottom Left resize handle"
								aria-valuenow={el.width}
								tabindex="0"
								onmousedown={(e) => onResizeMouseDown(e, 'sw')}
								class="pointer-events-auto absolute -bottom-1.5 -left-1.5 z-50 h-3 w-3 cursor-nesw-resize rounded-[2px] border border-[#0d99ff] bg-white shadow"
							></div>
							<div
								role="slider"
								aria-label="Middle Left resize handle"
								aria-valuenow={el.width}
								tabindex="0"
								onmousedown={(e) => onResizeMouseDown(e, 'w')}
								class="pointer-events-auto absolute top-1/2 -left-1.5 z-50 h-3 w-3 -translate-y-1/2 cursor-ew-resize rounded-[2px] border border-[#0d99ff] bg-white shadow"
							></div>
						{/if}
					</div>
				{/if}
			{/each}
		</div>
	</div>

	<!-- Floating Canvas Helper / Quick Navigation -->
	<div
		class="absolute bottom-3 left-3 flex items-center gap-2 rounded-lg border border-[#2c2c2c] bg-[#1e1e1e]/90 px-3 py-1.5 text-xs text-neutral-400 shadow-xl backdrop-blur select-none"
	>
		<span class="text-neutral-300">2 Jari Trackpad: Pinch Zoom & Geser</span>
		<span class="text-neutral-600">•</span>
		<span>Space + Drag: Pan</span>
		<span class="text-neutral-600">•</span>
		<span>Del: Hapus</span>
		<span class="text-neutral-600">•</span>
		<span>Ctrl+D: Duplikat</span>
		<span class="text-neutral-600">•</span>
		<span>Panah: Geser Halus</span>
	</div>
</div>
