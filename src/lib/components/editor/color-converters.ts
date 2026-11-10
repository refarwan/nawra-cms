const HEX_PATTERN = /^([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

export function parseHex(input: string): string | null {
  let clean = input.trim();
  if (!clean) return null;
  if (clean.charAt(0) === "#") clean = clean.slice(1);
  if (!HEX_PATTERN.test(clean)) return null;
  if (clean.length === 3) {
    clean = clean
      .split("")
      .map((c) => c + c)
      .join("");
  }
  return `#${clean.toUpperCase()}`;
}

export function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.charAt(0) === "#" ? hex.slice(1) : hex;
  return [
    parseInt(clean.slice(0, 2), 16) || 0,
    parseInt(clean.slice(2, 4), 16) || 0,
    parseInt(clean.slice(4, 6), 16) || 0
  ];
}

export function rgbToHsv(r: number, g: number, b: number): [number, number, number] {
  r /= 255;
  g /= 255;
  b /= 255;
  const min = Math.min(r, g, b);
  const max = Math.max(r, g, b);
  const delta = max - min;
  let h = 0;
  if (delta !== 0) {
    if (max === r) h = (60 * ((g - b) / delta)) % 360;
    else if (max === g) h = 60 * ((b - r) / delta) + 120;
    else h = 60 * ((r - g) / delta) + 240;
  }
  if (h < 0) h += 360;
  const s = max === 0 ? 0 : delta / max;
  return [h, s, max];
}

export function hsvToRgb(h: number, s: number, v: number): [number, number, number] {
  const hi = Math.floor(h / 60) % 6;
  const f = h / 60 - Math.floor(h / 60);
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);
  let r: number;
  let g: number;
  let b: number;
  switch (hi) {
    case 0:
      r = v;
      g = t;
      b = p;
      break;
    case 1:
      r = q;
      g = v;
      b = p;
      break;
    case 2:
      r = p;
      g = v;
      b = t;
      break;
    case 3:
      r = p;
      g = q;
      b = v;
      break;
    case 4:
      r = t;
      g = p;
      b = v;
      break;
    default:
      r = v;
      g = p;
      b = q;
      break;
  }
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

const toHex2 = (n: number): string =>
  Math.max(0, Math.min(255, Math.round(n)))
    .toString(16)
    .padStart(2, "0");

export function hsvToHex(h: number, s: number, v: number): string {
  return `#${hsvToRgb(h, s, v).map(toHex2).join("")}`.toUpperCase();
}
