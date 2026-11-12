<script lang="ts">
  import Icon from "@iconify/svelte";

  import { resolve } from "$app/paths";
  import { page } from "$app/state";

  import { authStore } from "../../../../lib/stores/auth.svelte";
  import { adminSidebar } from "../../stores/admin-sidebar.svelte";
  import DashboardNavLink from "./DashboardNavLink.svelte";
  import { getNavGroupsForRole } from "./sidebar-nav";

  import type { NavItem, NavSubItem } from "./sidebar-nav";

  const currentNavGroups = $derived(getNavGroupsForRole(authStore.user?.role));
  let openMenus = $state<Record<string, boolean>>({});

  const isActive = (href: string, exact?: boolean): boolean => {
    if (exact || href === "/dashboard") {
      return page.url.pathname === href;
    }
    return page.url.pathname === href || page.url.pathname.startsWith(href + "/");
  };

  const isSubItemActive = (sub: NavSubItem): boolean => {
    if (sub.exact) {
      return page.url.pathname === sub.href;
    }
    return page.url.pathname === sub.href || page.url.pathname.startsWith(sub.href + "/");
  };

  const isParentActive = (item: NavItem): boolean => {
    if (item.subItems && item.subItems.length > 0) {
      return item.subItems.some((sub) => isSubItemActive(sub));
    }
    return isActive(item.href, item.exact);
  };

  const isMenuOpen = (item: NavItem): boolean => {
    if (openMenus[item.href] !== undefined) {
      return openMenus[item.href];
    }
    return isParentActive(item);
  };

  const toggleMenu = (href: string, item: NavItem): void => {
    openMenus = { ...openMenus, [href]: !isMenuOpen(item) };
  };
</script>

<nav class="flex-1 space-y-4 overflow-y-auto px-3 pt-6 pb-20">
  {#each currentNavGroups as group (group.label)}
    <div>
      <div
        class="px-2.5 pb-1 text-[11px] font-semibold tracking-wider text-gray-400 uppercase select-none"
      >
        {group.label}
      </div>
      <div class="space-y-0.5">
        {#each group.items as item (item.label)}
          {#if item.subItems && item.subItems.length > 0}
            {@const open = isMenuOpen(item)}
            {@const parentActive = isParentActive(item)}
            <div>
              <button
                type="button"
                onclick={() => toggleMenu(item.href, item)}
                aria-expanded={open}
                class={`group flex h-11 w-full cursor-pointer items-center justify-between rounded-lg px-3 text-sm transition-colors ${
                  parentActive
                    ? "font-semibold text-[#0d99ff] hover:bg-gray-100/60"
                    : "font-medium text-gray-600 hover:bg-gray-100/80 hover:text-gray-900"
                }`}
              >
                <span class="flex items-center gap-2.5 truncate">
                  <Icon
                    icon={item.icon}
                    class={`h-4.5 w-4.5 shrink-0 transition-colors ${
                      parentActive ? "text-[#0d99ff]" : "text-gray-400 group-hover:text-gray-600"
                    }`}
                  />
                  <span class="truncate">{item.label}</span>
                </span>
                <Icon
                  icon="lucide:chevron-down"
                  class={`h-4 w-4 shrink-0 transition-transform duration-200 ${
                    open ? "rotate-180 text-gray-600" : "text-gray-400 group-hover:text-gray-600"
                  }`}
                />
              </button>

              {#if open}
                <div class="relative mt-0.5 ml-5.25 space-y-0.5 border-l border-gray-200 pl-3">
                  {#each item.subItems as sub (sub.href)}
                    {@const subActive = isSubItemActive(sub)}
                    <a
                      href={sub.routeId ===
                      "/(dashboard)/(authenticated)/dashboard/article-category"
                        ? resolve("/(dashboard)/(authenticated)/dashboard/article-category")
                        : resolve("/(dashboard)/(authenticated)/dashboard/article")}
                      onclick={() => (adminSidebar.open = false)}
                      class={`flex h-9 items-center rounded-lg px-2.5 text-[13px] transition-colors ${
                        subActive
                          ? "bg-blue-50 font-semibold text-[#0d99ff]"
                          : "font-medium text-gray-600 hover:bg-gray-100/80 hover:text-gray-900"
                      }`}
                    >
                      <span class="flex-1 truncate">{sub.label}</span>
                    </a>
                  {/each}
                </div>
              {/if}
            </div>
          {:else}
            <DashboardNavLink {item} active={isActive(item.href, item.exact)} />
          {/if}
        {/each}
      </div>
    </div>
  {/each}
</nav>
