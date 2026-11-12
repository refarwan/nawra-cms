import type { EditorTargetType } from "./types";

export type EditorBackRoute =
  | "/(dashboard)/(authenticated)/dashboard/header"
  | "/(dashboard)/(authenticated)/dashboard/footer"
  | "/(dashboard)/(authenticated)/dashboard/home"
  | "/(dashboard)/(authenticated)/dashboard/page"
  | "/(dashboard)/(authenticated)/dashboard/article"
  | "/(public)";

export function getEditorBackRoute(targetType: EditorTargetType | null): EditorBackRoute {
  switch (targetType) {
    case "header":
      return "/(dashboard)/(authenticated)/dashboard/header";
    case "footer":
      return "/(dashboard)/(authenticated)/dashboard/footer";
    case "homepage":
    case "home":
      return "/(dashboard)/(authenticated)/dashboard/home";
    case "page":
      return "/(dashboard)/(authenticated)/dashboard/page";
    case "article":
      return "/(dashboard)/(authenticated)/dashboard/article";
    default:
      return "/(public)";
  }
}

export function getEditorTargetLabel(targetType: EditorTargetType | null): string {
  switch (targetType) {
    case "header":
      return "Header";
    case "footer":
      return "Footer";
    case "homepage":
    case "home":
      return "Laman Utama";
    case "page":
      return "Halaman";
    case "article":
      return "Artikel";
    default:
      return "Desain Kanvas";
  }
}
