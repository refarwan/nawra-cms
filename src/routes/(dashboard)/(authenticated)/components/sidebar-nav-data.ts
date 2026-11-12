import type { NavGroup } from "./sidebar-nav";

export const navGroups: NavGroup[] = [
  {
    label: "Utama",
    items: [
      {
        label: "Dasbor",
        href: "/dashboard",
        routeId: "/(dashboard)/(authenticated)/dashboard",
        icon: "lucide:layout-dashboard",
        exact: true
      }
    ]
  },
  {
    label: "Konten",
    items: [
      {
        label: "Artikel",
        href: "/dashboard/article",
        routeId: "/(dashboard)/(authenticated)/dashboard/article",
        icon: "lucide:newspaper",
        subItems: [
          {
            label: "Daftar Artikel",
            href: "/dashboard/article",
            routeId: "/(dashboard)/(authenticated)/dashboard/article",
            exact: true
          },
          {
            label: "Kategori Artikel",
            href: "/dashboard/article-category",
            routeId: "/(dashboard)/(authenticated)/dashboard/article-category"
          }
        ]
      },
      {
        label: "Halaman",
        href: "/dashboard/page",
        routeId: "/(dashboard)/(authenticated)/dashboard/page",
        icon: "lucide:file-text",
        roles: ["admin"]
      },
      {
        label: "Galeri Gambar",
        href: "/dashboard/image-gallery",
        routeId: "/(dashboard)/(authenticated)/dashboard/image-gallery",
        icon: "lucide:images"
      }
    ]
  },
  {
    label: "Tema",
    roles: ["admin"],
    items: [
      {
        label: "Laman Utama",
        href: "/dashboard/home",
        routeId: "/(dashboard)/(authenticated)/dashboard/home",
        icon: "lucide:home",
        roles: ["admin"]
      },
      {
        label: "Header",
        href: "/dashboard/header",
        routeId: "/(dashboard)/(authenticated)/dashboard/header",
        icon: "lucide:panel-top",
        roles: ["admin"]
      },
      {
        label: "Footer",
        href: "/dashboard/footer",
        routeId: "/(dashboard)/(authenticated)/dashboard/footer",
        icon: "lucide:panel-bottom",
        roles: ["admin"]
      }
    ]
  },
  {
    label: "Pengguna",
    roles: ["admin"],
    items: [
      {
        label: "Daftar Editor",
        href: "/dashboard/editor",
        routeId: "/(dashboard)/(authenticated)/dashboard/editor",
        icon: "lucide:users",
        roles: ["admin"]
      }
    ]
  },
  {
    label: "Pengaturan",
    roles: ["admin"],
    items: [
      {
        label: "Pengaturan Situs",
        href: "/dashboard/site-setting",
        routeId: "/(dashboard)/(authenticated)/dashboard/site-setting",
        icon: "lucide:settings",
        roles: ["admin"]
      }
    ]
  }
];
