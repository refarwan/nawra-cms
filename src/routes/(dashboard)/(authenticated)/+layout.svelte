<script lang="ts">
  import Icon from "@iconify/svelte";

  import { goto } from "$app/navigation";
  import { resolve } from "$app/paths";

  import { authStore } from "../../../lib/stores/auth.svelte";
  import DashboardHeader from "./components/DashboardHeader.svelte";
  import DashboardSidebar from "./components/DashboardSidebar.svelte";

  import type { LayoutProps } from "./$types";

  let { data, children }: LayoutProps = $props();

  $effect(() => {
    if (authStore.initialized && !authStore.user && !authStore.accessToken && !data.user) {
      void goto(resolve("/(dashboard)/(unauthenticated)/login"), {
        replace: true,
        replaceState: true
      });
    }
  });
</script>

{#if authStore.user || authStore.accessToken || data.user}
  <div class="relative min-h-screen bg-gray-50/70 font-sans text-gray-900">
    <DashboardSidebar title="Nawra CMS" />

    <div class="flex min-h-screen flex-col xl:pl-65">
      {#if data.isCloudflare && !data.isD1Connected}
        <div
          class="flex items-center gap-2.5 border-b border-amber-300 bg-amber-50 px-4 py-2.5 text-xs font-medium text-amber-900"
        >
          <Icon icon="lucide:alert-triangle" class="h-4 w-4 shrink-0 text-amber-600" />
          <span>
            <strong>Peringatan Database D1:</strong> Binding <code>DB</code> belum terpasang di Cloudflare
            Settings. Data Anda disimpan sementara di memori.
          </span>
        </div>
      {/if}

      <DashboardHeader />

      <main class="flex-1 p-4 md:p-6 lg:p-8">
        {@render children()}
      </main>
    </div>
  </div>
{/if}
