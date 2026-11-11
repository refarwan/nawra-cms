<script lang="ts">
  import Icon from "@iconify/svelte";

  import { goto } from "$app/navigation";
  import { resolve } from "$app/paths";

  import { authStore } from "../../../../lib/stores/auth.svelte";

  let isOpen = $state(false);
  let isLoggingOut = $state(false);
  let menuRef: HTMLDivElement | undefined = $state();

  $effect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (menuRef && !menuRef.contains(target)) {
        isOpen = false;
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  });

  const handleLogout = async () => {
    isLoggingOut = true;
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // Abaikan error saat logout
    } finally {
      authStore.clear();
      void goto(resolve("/(dashboard)/(unauthenticated)/login"));
    }
  };
</script>

<div bind:this={menuRef} class="relative flex items-center justify-end">
  <button
    type="button"
    onclick={() => (isOpen = !isOpen)}
    class="flex cursor-pointer items-center gap-2.5 p-1"
    aria-label="Menu pengguna"
    aria-expanded={isOpen}
  >
    <div
      class="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-[#0d99ff] select-none"
    >
      {(
        authStore.user?.name?.[0] ||
        authStore.user?.username?.[0] ||
        authStore.user?.email?.[0] ||
        "U"
      ).toUpperCase()}
    </div>

    <div class="hidden text-left md:block">
      <span class="block text-sm leading-tight font-semibold text-gray-900">
        {authStore.user?.name || authStore.user?.username || "Pengguna"}
      </span>
      <span class="block text-[11px] text-gray-400 capitalize">
        {authStore.user?.role || "Editor"}
      </span>
    </div>

    <Icon icon="lucide:chevron-down" class="hidden h-4 w-4 text-gray-400 md:block" />
  </button>

  {#if isOpen}
    <div
      class="absolute top-full right-0 z-50 mt-2 flex w-60 flex-col gap-1 rounded-xl border border-gray-200 bg-white p-2"
    >
      <div class="border-b border-gray-100 px-3 py-2">
        <p class="truncate text-xs font-semibold text-gray-900">
          {authStore.user?.name || authStore.user?.username || "Pengguna"}
        </p>
        <p class="truncate text-[11px] text-gray-500">
          @{authStore.user?.username || "user"} · {authStore.user?.email || ""}
        </p>
      </div>

      <!-- Akun Saya -->
      <a
        href={resolve("/(dashboard)/(authenticated)/dashboard/my-account")}
        onclick={() => (isOpen = false)}
        class="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50"
      >
        <Icon icon="lucide:user-round" class="h-4 w-4 shrink-0 text-gray-500" />
        <span>Akun Saya</span>
      </a>

      <!-- Ubah Kata Sandi -->
      <a
        href={resolve("/(dashboard)/(authenticated)/dashboard/change-password")}
        onclick={() => (isOpen = false)}
        class="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50"
      >
        <Icon icon="lucide:key-round" class="h-4 w-4 shrink-0 text-gray-500" />
        <span>Ubah Kata Sandi</span>
      </a>

      <div class="my-1 border-t border-gray-100"></div>

      <button
        type="button"
        disabled={isLoggingOut}
        onclick={handleLogout}
        class="flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
      >
        <Icon icon="lucide:log-out" class="h-4 w-4 shrink-0 text-red-600" />
        <span>{isLoggingOut ? "Keluar..." : "Keluar dari Akun"}</span>
      </button>
    </div>
  {/if}
</div>
