<script lang="ts">
  import Icon from "@iconify/svelte";

  import { resolve } from "$app/paths";
  import { page } from "$app/state";

  import { authStore } from "../../../../lib/stores/auth.svelte";
  import { adminSidebar } from "../../stores/admin-sidebar.svelte";
  import { getNavGroupsForRole } from "./sidebar-nav";

  import type { NavItem } from "./sidebar-nav";

  const currentNavGroups = $derived(getNavGroupsForRole(authStore.user?.role));

  const isActive = (href: string, exact?: boolean): boolean => {
    if (exact || href === "/dashboard") {
      return page.url.pathname === href;
    }
    return page.url.pathname === href || page.url.pathname.startsWith(href + "/");
  };
</script>

{#snippet itemLink(item: NavItem)}
  {@const active = isActive(item.href, item.exact)}
  {#if item.routeId === "/(dashboard)/(authenticated)/dashboard"}
    <a
      href={resolve("/(dashboard)/(authenticated)/dashboard")}
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
  {:else if item.routeId === "/(dashboard)/(authenticated)/dashboard/home"}
    <a
      href={resolve("/(dashboard)/(authenticated)/dashboard/home")}
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
  {:else if item.routeId === "/(dashboard)/(authenticated)/dashboard/header"}
    <a
      href={resolve("/(dashboard)/(authenticated)/dashboard/header")}
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
  {:else if item.routeId === "/(dashboard)/(authenticated)/dashboard/footer"}
    <a
      href={resolve("/(dashboard)/(authenticated)/dashboard/footer")}
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
  {:else}
    <a
      href={resolve("/editor")}
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
  {/if}
{/snippet}

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
          {@render itemLink(item)}
        {/each}
      </div>
    </div>
  {/each}
</nav>
