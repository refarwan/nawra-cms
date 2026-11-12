import type { CanvasElement } from "./types";

function buildElementCss(overrides: Partial<CanvasElement>): string[] {
  const css: string[] = [];

  if (overrides.hidden) {
    css.push("display: none !important");
  }
  if (overrides.fill && overrides.fill !== "transparent") {
    css.push(`background-color: ${overrides.fill} !important`);
  } else if (overrides.fill === "transparent") {
    css.push("background-color: transparent !important");
  }

  if (overrides.color) css.push(`color: ${overrides.color} !important`);
  if (overrides.fontSize) css.push(`font-size: ${overrides.fontSize}px !important`);
  if (overrides.fontWeight) css.push(`font-weight: ${overrides.fontWeight} !important`);
  if (overrides.fontFamily) {
    const f = overrides.fontFamily === "Inter" ? "Poppins" : overrides.fontFamily;
    css.push(`font-family: ${f} !important`);
  }
  if (overrides.textAlign) css.push(`text-align: ${overrides.textAlign} !important`);
  if (overrides.borderRadius !== undefined) {
    css.push(`border-radius: ${overrides.borderRadius}px !important`);
  }

  if (overrides.borderWidth !== undefined || overrides.borderColor || overrides.borderStyle) {
    const w = overrides.borderWidth ?? 1;
    const s = overrides.borderStyle ?? "solid";
    const c = overrides.borderColor ?? "transparent";
    css.push(`border: ${w}px ${s} ${c} !important`);
  }

  if (overrides.opacity !== undefined) {
    css.push(`opacity: ${overrides.opacity / 100} !important`);
  }

  // Width
  if (overrides.widthMode === "fill") {
    css.push("width: 100% !important");
  } else if (overrides.widthMode === "hug") {
    css.push("width: fit-content !important", "max-width: 100% !important");
  } else if (overrides.width !== undefined) {
    css.push(`width: ${overrides.width}px !important`, "max-width: 100% !important");
  }

  // Height
  if (overrides.heightMode === "fill") {
    css.push("height: 100% !important", "align-self: stretch !important");
  } else if (overrides.heightMode === "hug") {
    css.push("height: auto !important", "min-height: fit-content !important");
  } else if (overrides.height !== undefined) {
    css.push(`min-height: ${overrides.height}px !important`);
  }

  // Spacing & Flex
  buildSpacingCss(overrides, css);

  return css;
}

function buildSpacingCss(overrides: Partial<CanvasElement>, css: string[]): void {
  const hasPad =
    overrides.padding !== undefined ||
    overrides.paddingTop !== undefined ||
    overrides.paddingRight !== undefined ||
    overrides.paddingBottom !== undefined ||
    overrides.paddingLeft !== undefined;
  if (hasPad) {
    const pt = overrides.paddingTop ?? overrides.padding ?? 0;
    const pr = overrides.paddingRight ?? overrides.padding ?? 0;
    const pb = overrides.paddingBottom ?? overrides.padding ?? 0;
    const pl = overrides.paddingLeft ?? overrides.padding ?? 0;
    css.push(`padding: ${pt}px ${pr}px ${pb}px ${pl}px !important`);
  }

  const hasMargin =
    overrides.margin !== undefined ||
    overrides.marginTop !== undefined ||
    overrides.marginRight !== undefined ||
    overrides.marginBottom !== undefined ||
    overrides.marginLeft !== undefined;
  if (hasMargin) {
    const mt = overrides.marginTop ?? overrides.margin ?? 0;
    const mr = overrides.marginRight ?? overrides.margin ?? 0;
    const mb = overrides.marginBottom ?? overrides.margin ?? 0;
    const ml = overrides.marginLeft ?? overrides.margin ?? 0;
    css.push(`margin: ${mt}px ${mr}px ${mb}px ${ml}px !important`);
  }

  if (overrides.flexDirection) css.push(`flex-direction: ${overrides.flexDirection} !important`);
  if (overrides.justifyContent) css.push(`justify-content: ${overrides.justifyContent} !important`);
  if (overrides.alignItems) css.push(`align-items: ${overrides.alignItems} !important`);

  if (overrides.gap !== undefined || overrides.gapX !== undefined || overrides.gapY !== undefined) {
    const gy = overrides.gapY ?? overrides.gap ?? 0;
    const gx = overrides.gapX ?? overrides.gap ?? 0;
    css.push(`gap: ${gy}px ${gx}px !important`);
  }
}

export function generateResponsiveCss(elements: CanvasElement[]): string {
  const tabletRules: string[] = [];
  const mobileRules: string[] = [];

  for (const el of elements) {
    if (el.responsive?.tablet) {
      const decls = buildElementCss(el.responsive.tablet);
      if (decls.length > 0) {
        tabletRules.push(`  [data-nw-id="${el.id}"] { ${decls.join("; ")}; }`);
      }
    }
    if (el.responsive?.mobile) {
      const decls = buildElementCss(el.responsive.mobile);
      if (decls.length > 0) {
        mobileRules.push(`  [data-nw-id="${el.id}"] { ${decls.join("; ")}; }`);
      }
    }
  }

  if (tabletRules.length === 0 && mobileRules.length === 0) {
    return "";
  }

  const chunks: string[] = ["<style>"];
  if (tabletRules.length > 0) {
    const rules = tabletRules.join("\n");
    chunks.push(
      "@container (max-width: 768px) {",
      rules,
      "}",
      "@media (max-width: 768px) {",
      rules,
      "}"
    );
  }
  if (mobileRules.length > 0) {
    const rules = mobileRules.join("\n");
    chunks.push(
      "@container (max-width: 480px) {",
      rules,
      "}",
      "@media (max-width: 480px) {",
      rules,
      "}"
    );
  }
  chunks.push("</style>");

  return chunks.join("\n");
}
