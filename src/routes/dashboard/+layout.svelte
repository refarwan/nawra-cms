<script lang="ts">
  import DashboardHeader from "./components/DashboardHeader.svelte";
  import DashboardSidebar from "./components/DashboardSidebar.svelte";

  import type { LayoutProps } from "./$types";

  let { data, children }: LayoutProps = $props();
  let isSidebarOpen = $state(false);
</script>

<div class="relative min-h-screen bg-gray-50/70 font-sans text-gray-900">
  <DashboardSidebar bind:isOpen={isSidebarOpen} />

  <div class="flex min-h-screen flex-col xl:pl-64">
    <DashboardHeader user={data.user} onToggleSidebar={() => (isSidebarOpen = !isSidebarOpen)} />

    <main class="flex-1 p-4 md:p-6 lg:p-8">
      {@render children()}
    </main>
  </div>
</div>
