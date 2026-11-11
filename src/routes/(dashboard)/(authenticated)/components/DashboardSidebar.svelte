<script lang="ts">
  import Icon from "@iconify/svelte";

  import { resolve } from "$app/paths";

  import { adminSidebar } from "../../stores/admin-sidebar.svelte";
  import DashboardNav from "./DashboardNav.svelte";

  interface Props {
    title?: string;
  }

  const { title = "Nawra CMS" }: Props = $props();
</script>

{#snippet logo()}
  <div class="flex h-17.25 items-center justify-between border-b border-gray-100 px-5">
    <a
      href={resolve("/(dashboard)/(authenticated)/dashboard")}
      onclick={() => (adminSidebar.open = false)}
      class="flex items-center gap-2.5 rounded-lg focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#0d99ff]"
    >
      <div
        class="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0d99ff] text-xs font-bold text-white"
      >
        <Icon icon="lucide:layout-template" class="h-4.5 w-4.5" />
      </div>
      <span class="text-sm font-semibold tracking-tight text-gray-900">{title}</span>
    </a>

    <button
      type="button"
      onclick={() => (adminSidebar.open = false)}
      aria-label="Tutup sidebar"
      class="cursor-pointer rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 xl:hidden"
    >
      <Icon icon="lucide:x" class="h-5 w-5" />
    </button>
  </div>
{/snippet}

<div
  data-is-mobile-visible={adminSidebar.open}
  onclick={(event) => {
    if (event.target === event.currentTarget) adminSidebar.open = false;
  }}
  role="presentation"
  class="group invisible fixed top-0 left-0 z-40 h-screen w-screen bg-gray-900/40 opacity-0 transition-[visibility,opacity] duration-300 ease-in-out data-[is-mobile-visible=true]:visible data-[is-mobile-visible=true]:opacity-100 xl:visible xl:z-30 xl:w-max xl:opacity-100"
>
  <aside
    class="fixed -left-full flex h-full min-h-screen w-65 flex-col border-r border-gray-200 bg-white transition-[left] duration-300 ease-in-out select-none group-data-[is-mobile-visible=true]:left-0 xl:relative xl:left-0"
  >
    {@render logo()}
    <DashboardNav />
  </aside>
</div>
