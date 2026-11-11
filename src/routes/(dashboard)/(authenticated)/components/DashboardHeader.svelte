<script lang="ts">
  import Icon from "@iconify/svelte";

  import { adminSidebar } from "../../stores/admin-sidebar.svelte";
  import { pageTitleStore } from "../../stores/page-title.svelte";
  import DashboardUserMenu from "./DashboardUserMenu.svelte";

  let { showSidebarToggle = true }: { showSidebarToggle?: boolean } = $props();

  let isNotificationOpen = $state(false);
  let notificationRef: HTMLDivElement | undefined = $state();

  const title = $derived(pageTitleStore.title ?? "Dashboard");

  $effect(() => {
    if (!isNotificationOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (notificationRef && !notificationRef.contains(target)) {
        isNotificationOpen = false;
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  });
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
    <!-- Notification -->
    <div bind:this={notificationRef} class="relative flex items-center">
      <button
        type="button"
        onclick={() => {
          isNotificationOpen = !isNotificationOpen;
        }}
        aria-label="Notifikasi"
        aria-expanded={isNotificationOpen}
        class="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 {isNotificationOpen
          ? 'bg-gray-100 text-gray-700'
          : ''}"
      >
        <Icon icon="lucide:bell" class="h-5 w-5" />
      </button>

      {#if isNotificationOpen}
        <div
          class="absolute top-full right-0 z-50 mt-2 flex w-64 flex-col rounded-xl border border-gray-200 bg-white p-4 sm:w-72"
        >
          <div class="flex items-center justify-between border-b border-gray-100 pb-2.5">
            <h3 class="text-xs font-bold text-gray-900">Notifikasi</h3>
          </div>
          <div class="flex flex-col items-center justify-center py-6 text-center text-gray-500">
            <Icon icon="lucide:bell-off" class="mb-2 h-7 w-7 text-gray-300" />
            <p class="text-xs text-gray-500">Tidak ada notifikasi baru</p>
          </div>
        </div>
      {/if}
    </div>

    <!-- User Menu -->
    <DashboardUserMenu />
  </div>
</header>
