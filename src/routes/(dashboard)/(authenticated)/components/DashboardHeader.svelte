<script lang="ts">
  import Icon from "@iconify/svelte";

  import { adminSidebar } from "../../stores/admin-sidebar.svelte";
  import { pageTitleStore } from "../../stores/page-title.svelte";
  import DashboardUserMenu from "./DashboardUserMenu.svelte";

  let { showSidebarToggle = true }: { showSidebarToggle?: boolean } = $props();

  const title = $derived(pageTitleStore.title ?? "Dashboard");
</script>

<header
  class="sticky top-0 z-30 flex h-17.25 items-center justify-between border-b border-gray-200 bg-white px-4 py-4 select-none md:px-6 xl:px-10"
>
  {#if showSidebarToggle}
    <div class="flex shrink-0 items-center xl:hidden">
      <button
        type="button"
        onclick={() => (adminSidebar.open = true)}
        aria-label="Buka menu sidebar"
        class="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
      >
        <Icon icon="lucide:menu" class="h-6 w-6" />
      </button>
    </div>
  {/if}

  <div class="flex-1 text-center xl:text-left">
    <h1 class="truncate text-xl font-bold tracking-tight text-gray-900 xl:text-2xl">
      {title}
    </h1>
  </div>

  <div class="flex shrink-0 items-center gap-2 md:gap-3">
    <!-- User Menu -->
    <DashboardUserMenu />
  </div>
</header>
