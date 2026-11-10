import { SvelteDate } from 'svelte/reactivity';
import type { CanvasElement, CanvasFrame, DeviceMode, ElementType, ToolMode } from './types';

const INITIAL_ELEMENTS: CanvasElement[] = [
	{
		id: 'el-nav',
		name: 'Navigasi Utama',
		type: 'rectangle',
		x: 40,
		y: 30,
		width: 1120,
		height: 64,
		rotation: 0,
		fill: '#0f172a',
		borderRadius: 16,
		borderWidth: 1,
		borderColor: '#1e293b',
		borderStyle: 'solid',
		opacity: 100,
		boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)'
	},
	{
		id: 'el-logo',
		name: 'Logo Brand',
		type: 'heading',
		x: 70,
		y: 47,
		width: 180,
		height: 30,
		rotation: 0,
		content: '✨ Nawra Studio',
		fill: 'transparent',
		color: '#ffffff',
		fontSize: 18,
		fontWeight: '700',
		borderRadius: 0,
		borderWidth: 0,
		borderColor: 'transparent',
		borderStyle: 'none',
		opacity: 100,
		boxShadow: 'none',
		textAlign: 'left'
	},
	{
		id: 'el-nav-btn',
		name: 'Tombol Navigasi',
		type: 'button',
		x: 990,
		y: 44,
		width: 140,
		height: 38,
		rotation: 0,
		content: 'Hubungi Kami',
		fill: '#0d99ff',
		color: '#ffffff',
		fontSize: 13,
		fontWeight: '600',
		borderRadius: 8,
		borderWidth: 0,
		borderColor: 'transparent',
		borderStyle: 'none',
		opacity: 100,
		boxShadow: '0 4px 12px rgba(13, 153, 255, 0.3)',
		textAlign: 'center'
	},
	{
		id: 'el-card',
		name: 'Hero Banner Section',
		type: 'rectangle',
		x: 40,
		y: 120,
		width: 1120,
		height: 600,
		rotation: 0,
		fill: '#0f172a',
		borderRadius: 24,
		borderWidth: 1,
		borderColor: '#1e293b',
		borderStyle: 'solid',
		opacity: 100,
		boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'
	},
	{
		id: 'el-badge',
		name: 'Label Status',
		type: 'badge',
		x: 100,
		y: 180,
		width: 230,
		height: 34,
		rotation: 0,
		content: '⚡ NO-CODE CMS ENGINE',
		fill: '#1e293b',
		color: '#38bdf8',
		fontSize: 12,
		fontWeight: '600',
		borderRadius: 999,
		borderWidth: 1,
		borderColor: '#0284c7',
		borderStyle: 'solid',
		opacity: 100,
		boxShadow: 'none',
		textAlign: 'center'
	},
	{
		id: 'el-title',
		name: 'Judul Utama',
		type: 'heading',
		x: 100,
		y: 240,
		width: 580,
		height: 120,
		rotation: 0,
		content: 'Kelola Konten Website Tanpa Perlu Koding',
		fill: 'transparent',
		color: '#f8fafc',
		fontSize: 40,
		fontWeight: '800',
		fontFamily: 'Plus Jakarta Sans',
		borderRadius: 0,
		borderWidth: 0,
		borderColor: '#ffffff',
		borderStyle: 'none',
		opacity: 100,
		boxShadow: 'none',
		textAlign: 'left'
	},
	{
		id: 'el-desc',
		name: 'Deskripsi Singkat',
		type: 'text',
		x: 100,
		y: 380,
		width: 520,
		height: 80,
		rotation: 0,
		content:
			'Visual canvas interaktif tanpa koding untuk mendesain dan menerbitkan halaman website dengan mudah, cepat, dan otomatis.',
		fill: 'transparent',
		color: '#94a3b8',
		fontSize: 16,
		fontWeight: '400',
		borderRadius: 0,
		borderWidth: 0,
		borderColor: '#ffffff',
		borderStyle: 'none',
		opacity: 100,
		boxShadow: 'none',
		textAlign: 'left'
	},
	{
		id: 'el-cta-1',
		name: 'Tombol Aksi Utama',
		type: 'button',
		x: 100,
		y: 480,
		width: 180,
		height: 48,
		rotation: 0,
		content: 'Mulai Buat Website',
		fill: '#0284c7',
		color: '#ffffff',
		fontSize: 15,
		fontWeight: '600',
		borderRadius: 12,
		borderWidth: 0,
		borderColor: 'transparent',
		borderStyle: 'none',
		opacity: 100,
		boxShadow: '0 10px 25px -5px rgba(2, 132, 199, 0.4)',
		textAlign: 'center'
	},
	{
		id: 'el-cta-2',
		name: 'Tombol Sekunder',
		type: 'button',
		x: 300,
		y: 480,
		width: 150,
		height: 48,
		rotation: 0,
		content: 'Lihat Panduan',
		fill: 'transparent',
		color: '#e2e8f0',
		fontSize: 15,
		fontWeight: '500',
		borderRadius: 12,
		borderWidth: 1,
		borderColor: '#334155',
		borderStyle: 'solid',
		opacity: 100,
		boxShadow: 'none',
		textAlign: 'center'
	},
	{
		id: 'el-hero-img',
		name: 'Gambar Ilustrasi',
		type: 'image',
		x: 720,
		y: 180,
		width: 380,
		height: 380,
		rotation: 0,
		src: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
		fill: '#1e293b',
		borderRadius: 20,
		borderWidth: 1,
		borderColor: '#334155',
		borderStyle: 'solid',
		opacity: 100,
		boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
	}
];

export class EditorState {
	elements = $state<CanvasElement[]>(INITIAL_ELEMENTS);
	frame = $state<CanvasFrame>({
		name: 'Kanvas Desain Utama',
		width: 1200,
		height: 760,
		background: '#090d16'
	});

	selectedId = $state<string | null>(null);
	tool = $state<ToolMode>('select');
	zoom = $state<number>(1);
	pan = $state<{ x: number; y: number }>({ x: 0, y: 0 });
	device = $state<DeviceMode>('desktop');
	isPreviewMode = $state<boolean>(false);
	isPublishModalOpen = $state<boolean>(false);
	lastPublishedAt = $state<string | null>('Baru Saja');

	history = $state<CanvasElement[][]>([]);
	historyIndex = $state<number>(-1);

	selectedElement = $derived<CanvasElement | null>(
		this.elements.find((el) => el.id === this.selectedId) || null
	);

	constructor() {
		this.pushHistory();
	}

	setDevice(device: DeviceMode) {
		this.device = device;
		if (device === 'mobile') {
			this.frame.width = 390;
			this.frame.height = 780;
			this.zoom = 0.9;
		} else if (device === 'tablet') {
			this.frame.width = 768;
			this.frame.height = 900;
			this.zoom = 0.85;
		} else {
			this.frame.width = 1200;
			this.frame.height = 760;
			this.zoom = 1;
		}
		this.pan = { x: 0, y: 0 };
	}

	pushHistory() {
		const nextHistory = this.history.slice(0, this.historyIndex + 1);
		nextHistory.push(JSON.parse(JSON.stringify(this.elements)));
		this.history = nextHistory;
		this.historyIndex = nextHistory.length - 1;
	}

	undo() {
		if (this.historyIndex > 0) {
			this.historyIndex--;
			this.elements = JSON.parse(JSON.stringify(this.history[this.historyIndex]));
		}
	}

	redo() {
		if (this.historyIndex < this.history.length - 1) {
			this.historyIndex++;
			this.elements = JSON.parse(JSON.stringify(this.history[this.historyIndex]));
		}
	}

	selectElement(id: string | null) {
		this.selectedId = id;
	}

	addElement(type: ElementType, x = 80, y = 80) {
		const count = this.elements.length + 1;
		const id = `el-${Date.now()}`;

		let newEl: CanvasElement;

		switch (type) {
			case 'heading':
				newEl = {
					id,
					name: `Judul ${count}`,
					type: 'heading',
					x,
					y,
					width: 400,
					height: 60,
					rotation: 0,
					content: 'Judul Baru',
					fill: 'transparent',
					color: '#f8fafc',
					fontSize: 32,
					fontWeight: '700',
					fontFamily: 'Inter',
					textAlign: 'left',
					borderRadius: 0,
					borderWidth: 0,
					borderColor: 'transparent',
					borderStyle: 'none',
					opacity: 100,
					boxShadow: 'none'
				};
				break;
			case 'text':
				newEl = {
					id,
					name: `Teks ${count}`,
					type: 'text',
					x,
					y,
					width: 320,
					height: 60,
					rotation: 0,
					content: 'Tulis penjelasan konten atau paragraf informasi di sini.',
					fill: 'transparent',
					color: '#94a3b8',
					fontSize: 16,
					fontWeight: '400',
					fontFamily: 'Inter',
					textAlign: 'left',
					borderRadius: 0,
					borderWidth: 0,
					borderColor: 'transparent',
					borderStyle: 'none',
					opacity: 100,
					boxShadow: 'none'
				};
				break;
			case 'button':
				newEl = {
					id,
					name: `Tombol ${count}`,
					type: 'button',
					x,
					y,
					width: 160,
					height: 44,
					rotation: 0,
					content: 'Klik Di Sini',
					fill: '#0d99ff',
					color: '#ffffff',
					fontSize: 14,
					fontWeight: '600',
					fontFamily: 'Inter',
					textAlign: 'center',
					borderRadius: 8,
					borderWidth: 0,
					borderColor: 'transparent',
					borderStyle: 'none',
					opacity: 100,
					boxShadow: '0 4px 12px rgba(13, 153, 255, 0.3)'
				};
				break;
			case 'badge':
				newEl = {
					id,
					name: `Tag / Badge ${count}`,
					type: 'badge',
					x,
					y,
					width: 140,
					height: 32,
					rotation: 0,
					content: 'LABEL BARU',
					fill: '#1e293b',
					color: '#38bdf8',
					fontSize: 12,
					fontWeight: '600',
					fontFamily: 'Inter',
					textAlign: 'center',
					borderRadius: 999,
					borderWidth: 1,
					borderColor: '#0284c7',
					borderStyle: 'solid',
					opacity: 100,
					boxShadow: 'none'
				};
				break;
			case 'image':
				newEl = {
					id,
					name: `Gambar ${count}`,
					type: 'image',
					x,
					y,
					width: 280,
					height: 200,
					rotation: 0,
					src: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=800&auto=format&fit=crop&q=80',
					fill: '#1e293b',
					borderRadius: 12,
					borderWidth: 0,
					borderColor: 'transparent',
					borderStyle: 'none',
					opacity: 100,
					boxShadow: '0 10px 20px rgba(0,0,0,0.2)'
				};
				break;
			case 'frame':
			case 'rectangle':
			default:
				newEl = {
					id,
					name: `Kontainer / Kartu ${count}`,
					type: 'rectangle',
					x,
					y,
					width: 300,
					height: 180,
					rotation: 0,
					fill: '#1e293b',
					borderRadius: 12,
					borderWidth: 1,
					borderColor: '#334155',
					borderStyle: 'solid',
					opacity: 100,
					boxShadow: 'none'
				};
				break;
		}

		this.elements.push(newEl);
		this.selectedId = id;
		this.tool = 'select';
		this.pushHistory();
	}

	updateElement(id: string, updates: Partial<CanvasElement>) {
		const idx = this.elements.findIndex((el) => el.id === id);
		if (idx !== -1) {
			this.elements[idx] = { ...this.elements[idx], ...updates };
		}
	}

	commitUpdate() {
		this.pushHistory();
	}

	deleteElement(id: string) {
		this.elements = this.elements.filter((el) => el.id !== id);
		if (this.selectedId === id) {
			this.selectedId = null;
		}
		this.pushHistory();
	}

	duplicateElement(id: string) {
		const target = this.elements.find((el) => el.id === id);
		if (!target) return;

		const clone: CanvasElement = {
			...JSON.parse(JSON.stringify(target)),
			id: `el-${Date.now()}`,
			name: `${target.name} (Salinan)`,
			x: target.x + 20,
			y: target.y + 20
		};

		this.elements.push(clone);
		this.selectedId = clone.id;
		this.pushHistory();
	}

	moveLayer(id: string, direction: 'up' | 'down') {
		const idx = this.elements.findIndex((el) => el.id === id);
		if (idx === -1) return;

		const targetIdx = direction === 'up' ? idx + 1 : idx - 1;
		if (targetIdx < 0 || targetIdx >= this.elements.length) return;

		const temp = this.elements[idx];
		this.elements[idx] = this.elements[targetIdx];
		this.elements[targetIdx] = temp;
		this.pushHistory();
	}

	toggleVisibility(id: string) {
		const el = this.elements.find((e) => e.id === id);
		if (el) {
			el.hidden = !el.hidden;
			this.pushHistory();
		}
	}

	toggleLock(id: string) {
		const el = this.elements.find((e) => e.id === id);
		if (el) {
			el.locked = !el.locked;
			this.pushHistory();
		}
	}

	publish() {
		this.isPublishModalOpen = true;
		this.lastPublishedAt = new SvelteDate().toLocaleTimeString('id-ID', {
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	zoomIn() {
		this.zoom = Math.min(2.5, +(this.zoom + 0.1).toFixed(2));
	}

	zoomOut() {
		this.zoom = Math.max(0.3, +(this.zoom - 0.1).toFixed(2));
	}

	resetZoom() {
		this.zoom = 1;
		this.pan = { x: 0, y: 0 };
	}
}
