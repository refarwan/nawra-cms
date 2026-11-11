import type { NavGroup } from "./sidebar-nav";

export const navGroups: NavGroup[] = [
  {
    label: "Utama",
    items: [
      {
        label: "Dashboard",
        href: "/dashboard",
        routeId: "/(dashboard)/(authenticated)/dashboard",
        icon: "lucide:layout-dashboard",
        exact: true
      }
    ]
  },
  {
    label: "CMS Builder",
    items: [
      {
        label: "Kelola Home Page",
        href: "/dashboard/home",
        routeId: "/(dashboard)/(authenticated)/dashboard/home",
        icon: "lucide:home"
      },
      {
        label: "Kelola Header",
        href: "/dashboard/header",
        routeId: "/(dashboard)/(authenticated)/dashboard/header",
        icon: "lucide:panel-top"
      },
      {
        label: "Kelola Footer",
        href: "/dashboard/footer",
        routeId: "/(dashboard)/(authenticated)/dashboard/footer",
        icon: "lucide:panel-bottom"
      },
      {
        label: "Visual Page Editor",
        href: "/editor",
        routeId: "/editor",
        icon: "lucide:layout-template"
      }
    ]
  }
];
