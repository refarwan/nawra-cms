<script lang="ts">
  import Icon from "@iconify/svelte";

  import { resolve } from "$app/paths";

  import { adminSidebar } from "../../stores/admin-sidebar.svelte";

  import type { NavItem } from "./sidebar-nav";

  let { item, active }: { item: NavItem; active: boolean } = $props();

  const href = $derived.by(() => {
    switch (item.routeId) {
      case "/(dashboard)/(authenticated)/dashboard":
        return resolve("/(dashboard)/(authenticated)/dashboard");
      case "/(dashboard)/(authenticated)/dashboard/home":
        return resolve("/(dashboard)/(authenticated)/dashboard/home");
      case "/(dashboard)/(authenticated)/dashboard/page":
        return resolve("/(dashboard)/(authenticated)/dashboard/page");
      case "/(dashboard)/(authenticated)/dashboard/header":
        return resolve("/(dashboard)/(authenticated)/dashboard/header");
      case "/(dashboard)/(authenticated)/dashboard/footer":
        return resolve("/(dashboard)/(authenticated)/dashboard/footer");
      case "/(dashboard)/(authenticated)/dashboard/image-gallery":
        return resolve("/(dashboard)/(authenticated)/dashboard/image-gallery");
      case "/(dashboard)/(authenticated)/dashboard/article":
        return resolve("/(dashboard)/(authenticated)/dashboard/article");
      case "/(dashboard)/(authenticated)/dashboard/article-category":
        return resolve("/(dashboard)/(authenticated)/dashboard/article-category");
      case "/(dashboard)/(authenticated)/dashboard/editor":
        return resolve("/(dashboard)/(authenticated)/dashboard/editor");
      case "/(dashboard)/(authenticated)/dashboard/site-setting":
        return resolve("/(dashboard)/(authenticated)/dashboard/site-setting");
      default:
        return resolve("/editor");
    }
  });
</script>

<a
  {href}
  onclick={() => (adminSidebar.open = false)}
  class={`group flex h-12 items-center gap-2.5 rounded-lg px-3 text-sm transition-colors ${
    active
      ? "bg-blue-50 font-semibold text-[#0d99ff]"
      : "font-medium text-gray-600 hover:bg-gray-100/80 hover:text-gray-900"
  }`}
>
  <Icon
    icon={item.icon}
    class={`h-4.5 w-4.5 shrink-0 transition-colors ${
      active ? "text-[#0d99ff]" : "text-gray-400 group-hover:text-gray-600"
    }`}
  />
  <span class="flex-1 truncate">{item.label}</span>
</a>
