import type { CanvasElement } from "#lib/components/editor/types";

const BASE_DEFAULTS = {
  x: 0,
  y: 0,
  fill: "transparent",
  borderRadius: 0,
  borderWidth: 0,
  borderColor: "transparent",
  borderStyle: "none" as const,
  opacity: 100,
  boxShadow: "none"
};

export function elFrame(
  id: string,
  name: string,
  parentId: string | undefined,
  overrides: Partial<CanvasElement> = {}
): CanvasElement {
  return {
    ...BASE_DEFAULTS,
    id,
    name,
    type: "frame",
    parentId,
    width: 1200,
    height: 100,
    widthMode: "fill",
    heightMode: "hug",
    isAutoLayout: true,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 0,
    padding: 0,
    ...overrides
  };
}

export function elHeading(
  id: string,
  name: string,
  parentId: string,
  content: string,
  overrides: Partial<CanvasElement> = {}
): CanvasElement {
  return {
    ...BASE_DEFAULTS,
    id,
    name,
    type: "heading",
    parentId,
    content,
    width: 600,
    height: 44,
    widthMode: "fill",
    heightMode: "hug",
    color: "#111827",
    fontSize: 32,
    fontWeight: "800",
    fontFamily: "Poppins",
    textAlign: "left",
    ...overrides
  };
}

export function elText(
  id: string,
  name: string,
  parentId: string,
  content: string,
  overrides: Partial<CanvasElement> = {}
): CanvasElement {
  return {
    ...BASE_DEFAULTS,
    id,
    name,
    type: "text",
    parentId,
    content,
    width: 560,
    height: 36,
    widthMode: "fill",
    heightMode: "hug",
    color: "#4b5563",
    fontSize: 15,
    fontWeight: "400",
    fontFamily: "Poppins",
    textAlign: "left",
    ...overrides
  };
}

export function elBadge(
  id: string,
  name: string,
  parentId: string,
  content: string,
  overrides: Partial<CanvasElement> = {}
): CanvasElement {
  return {
    ...BASE_DEFAULTS,
    id,
    name,
    type: "badge",
    parentId,
    content,
    width: 180,
    height: 28,
    widthMode: "hug",
    heightMode: "hug",
    fill: "#f0f9ff",
    color: "#0369a1",
    fontSize: 11,
    fontWeight: "700",
    fontFamily: "Poppins",
    textAlign: "center",
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#bae6fd",
    borderStyle: "solid",
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 14,
    paddingRight: 14,
    ...overrides
  };
}

export function elButton(
  id: string,
  name: string,
  parentId: string,
  content: string,
  href: string,
  overrides: Partial<CanvasElement> = {}
): CanvasElement {
  return {
    ...BASE_DEFAULTS,
    id,
    name,
    type: "button",
    parentId,
    content,
    href,
    width: 180,
    height: 44,
    widthMode: "hug",
    heightMode: "hug",
    fill: "#0d99ff",
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "Poppins",
    textAlign: "center",
    borderRadius: 12,
    paddingTop: 12,
    paddingBottom: 12,
    paddingLeft: 22,
    paddingRight: 22,
    ...overrides
  };
}

export function elLink(
  id: string,
  name: string,
  parentId: string,
  content: string,
  href: string,
  color = "#4b5563",
  fontWeight: "500" | "600" | "700" = "500"
): CanvasElement {
  return {
    ...BASE_DEFAULTS,
    id,
    name,
    type: "link",
    parentId,
    content,
    href,
    width: 90,
    height: 24,
    widthMode: "hug",
    heightMode: "hug",
    color,
    fontSize: 14,
    fontWeight,
    fontFamily: "Poppins",
    textAlign: "left"
  };
}
