export type ElementType =
  | "frame"
  | "rectangle"
  | "heading"
  | "text"
  | "button"
  | "link"
  | "youtube"
  | "image"
  | "badge"
  | "icon";

export type SizingMode = "fixed" | "hug" | "fill";

export interface CanvasElement {
  id: string;
  name: string;
  type: ElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;

  // Sizing Mode (Figma-style: Tetap / Ikuti Konten / Penuhi Kontainer)
  widthMode?: SizingMode;
  heightMode?: SizingMode;

  // Content
  content?: string;
  src?: string;
  alt?: string;
  href?: string;
  icon?: string;

  // Styling
  fill: string;
  color?: string;
  fontSize?: number;
  fontWeight?: "300" | "400" | "500" | "600" | "700" | "800";
  fontFamily?: string;
  textAlign?: "left" | "center" | "right";
  borderRadius: number;
  borderWidth: number;
  borderColor: string;
  borderStyle: "solid" | "dashed" | "dotted" | "none";
  opacity: number;
  boxShadow: string;

  // Layout / flex
  isAutoLayout?: boolean;
  flexDirection?: "row" | "column";
  justifyContent?: "flex-start" | "center" | "flex-end" | "space-between";
  alignItems?: "flex-start" | "center" | "flex-end" | "stretch";
  gap?: number;
  gapX?: number;
  gapY?: number;
  padding?: number;
  paddingTop?: number;
  paddingRight?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  margin?: number;
  marginTop?: number;
  marginRight?: number;
  marginBottom?: number;
  marginLeft?: number;

  // State
  locked?: boolean;
  hidden?: boolean;
  parentId?: string;
  isDefault?: boolean;
}

export type ToolMode =
  | "select"
  | "frame"
  | "rectangle"
  | "heading"
  | "text"
  | "button"
  | "image"
  | "badge"
  | "icon"
  | "pan";

export interface CanvasFrame {
  name: string;
  width: number;
  height: number;
  minHeight?: number;
  background: string;
}

export type DeviceMode = "desktop" | "tablet" | "mobile";
