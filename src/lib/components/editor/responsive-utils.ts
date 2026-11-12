import type { CanvasElement, DeviceMode } from "./types";

export const GLOBAL_METADATA_KEYS = new Set([
  "id",
  "name",
  "type",
  "parentId",
  "isDefault",
  "locked",
  "responsive"
]);

export function resolveElementForDevice(el: CanvasElement, device: DeviceMode): CanvasElement {
  if (device === "desktop") {
    return el;
  }
  if (device === "tablet") {
    if (!el.responsive?.tablet) return el;
    return { ...el, ...el.responsive.tablet };
  }
  // mobile inherits from tablet, then applies mobile overrides
  const tablet = el.responsive?.tablet;
  const mobile = el.responsive?.mobile;
  if (!tablet && !mobile) return el;
  return { ...el, ...tablet, ...mobile };
}

export function applyElementUpdate(
  target: CanvasElement,
  updates: Partial<CanvasElement>,
  device: DeviceMode
): CanvasElement {
  if (device === "desktop") {
    return { ...target, ...updates };
  }

  const globalUpdates: Partial<CanvasElement> = {};
  const responsiveUpdates: Partial<CanvasElement> = {};

  for (const [k, v] of Object.entries(updates)) {
    if (GLOBAL_METADATA_KEYS.has(k)) {
      (globalUpdates as Record<string, unknown>)[k] = v;
    } else {
      (responsiveUpdates as Record<string, unknown>)[k] = v;
    }
  }

  const base =
    Object.keys(globalUpdates).length > 0 ? { ...target, ...globalUpdates } : { ...target };
  const currentResponsive = base.responsive ?? {};

  if (device === "tablet") {
    const updatedTablet = { ...(currentResponsive.tablet ?? {}), ...responsiveUpdates };
    return {
      ...base,
      responsive: {
        ...currentResponsive,
        tablet: updatedTablet
      }
    };
  }

  // device === "mobile"
  const updatedMobile = { ...(currentResponsive.mobile ?? {}), ...responsiveUpdates };
  return {
    ...base,
    responsive: {
      ...currentResponsive,
      mobile: updatedMobile
    }
  };
}

export function isPropertyOverridden(
  el: CanvasElement,
  prop: keyof CanvasElement,
  device: DeviceMode
): boolean {
  if (device === "desktop") return false;
  if (device === "tablet") {
    return el.responsive?.tablet !== undefined && prop in el.responsive.tablet;
  }
  return el.responsive?.mobile !== undefined && prop in el.responsive.mobile;
}
