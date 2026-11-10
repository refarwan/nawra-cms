<script lang="ts">
  import Icon from "@iconify/svelte";

  import { resolve } from "$app/paths";
  import { page } from "$app/state";

  let { isOpen = $bindable(false) }: { isOpen: boolean } = $props();

  const navItems = [
    {
      href: resolve("/dashboard"),
      path: "/dashboard",
      label: "Dashboard",
      icon: "lucide:layout-dashboard"
    },
    {
      href: resolve("/dashboard/header"),
      path: "/dashboard/header",
      label: "Kelola Header",
      icon: "lucide:panel-top"
    },
    {
      href: resolve("/dashboard/footer"),
      path: "/dashboard/footer",
      label: "Kelola Footer",
      icon: "lucide:panel-bottom"
    },
    {
      href: resolve("/editor"),
      path: "/editor",
      label: "Visual Page Editor",
      icon: "lucide:layout-template"
    }
  ];
</script>

<!-- Mobile backdrop -->
{#if isOpen}
  <button
    type="button"
    aria-label="Tutup sidebar"
    class="fixed inset-0 z-40 bg-gray-900/40 xl:hidden"
    onclick={() => (isOpen = false)}
  ></button>
{/if}

<aside
  class="fixed top-0 bottom-0 left-0 z-40 flex w-64 flex-col border-r border-gray-200 bg-white transition-transform duration-300 xl:translate-x-0 {isOpen
    ? 'translate-x-0'
    : '-translate-x-full'}"
>
  <!-- Logo Header -->
  <div class="flex h-16 items-center justify-between border-b border-gray-100 px-6">
    <a href={resolve("/dashboard")} class="flex items-center gap-2.5">
      <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0d99ff] text-white">
        <Icon icon="lucide:layout-template" class="h-5 w-5" />
      </div>
      <div>
        <span class="block text-sm font-bold tracking-tight text-gray-900">Nawra CMS</span>
        <span class="block text-[10px] text-gray-400">Cloudflare D1</span>
      </div>
    </a>

    <button
      type="button"
      onclick={() => (isOpen = false)}
      aria-label="Tutup menu"
      class="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700 xl:hidden"
    >
      <Icon icon="lucide:x" class="h-5 w-5" />
    </button>
  </div>

  <!-- Navigation Links -->
  <nav class="flex-1 space-y-1 overflow-y-auto p-4 text-xs">
    <div class="mb-2 px-3 text-[10px] font-semibold tracking-wider text-gray-400 uppercase">
      Menu Utama
    </div>
    {#each navItems as item (item.href)}
      {@const isActive =
        item.path === "/dashboard"
          ? page.url.pathname === "/dashboard"
          : page.url.pathname.startsWith(item.path)}
      <a
        href={item.href}
        onclick={() => (isOpen = false)}
        class="flex items-center gap-3 rounded-xl px-3 py-2.5 font-medium transition {isActive
          ? 'bg-[#0d99ff]/10 text-[#0d99ff]'
          : 'text-gray-600 hover:bg-gray-100/80 hover:text-gray-900'}"
      >
        <Icon icon={item.icon} class="h-4 w-4 shrink-0" />
        <span>{item.label}</span>
      </a>
    {/each}
  </nav>

  <!-- Sidebar Footer -->
  <div class="border-t border-gray-100 p-4">
    <div class="rounded-xl border border-gray-100 bg-gray-50/70 p-3">
      <div class="flex items-center gap-2">
        <div
          class="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700"
        >
          <Icon icon="lucide:shield-check" class="h-4 w-4" />
        </div>
        <div class="flex-1 overflow-hidden">
          <span class="block truncate text-xs font-semibold text-gray-900">Edge SQLite D1</span>
          <span class="block text-[10px] text-emerald-600">Online & Siap</span>
        </div>
      </div>
    </div>
  </div>
</aside>
