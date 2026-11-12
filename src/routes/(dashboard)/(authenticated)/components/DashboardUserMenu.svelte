<script lang="ts">
  import Icon from "@iconify/svelte";

  import { goto, invalidateAll } from "$app/navigation";
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
    if (isLoggingOut) return;
    isLoggingOut = true;
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // Abaikan error saat logout
    } finally {
      authStore.clear();
      try {
        await invalidateAll();
      } catch {
        // Abaikan jika invalidateAll gagal
      }
      void goto(resolve("/(dashboard)/(unauthenticated)/login"), {
        replaceState: true,
        invalidateAll: true
      });
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
    {#if authStore.user?.avatarUrl}
      <img
        src={authStore.user.avatarUrl}
        alt={authStore.user?.name || authStore.user?.username || "Avatar"}
        class="h-9 w-9 rounded-full border border-gray-200 object-cover select-none"
      />
    {:else}
      <div
        class="flex h-9 w-9 items-center justify-center rounded-full bg-sky-100 text-xs font-bold text-sky-600 select-none"
      >
        {(
          authStore.user?.name?.[0] ||
          authStore.user?.username?.[0] ||
          authStore.user?.email?.[0] ||
          "U"
        ).toUpperCase()}
      </div>
    {/if}

    <div class="hidden text-left md:block">
      <span class="block text-sm leading-tight font-semibold text-gray-900">
        {authStore.user?.name || authStore.user?.username || "Pengguna"}
      </span>
      <span class="block text-[11px] text-gray-400 capitalize">
        {authStore.user?.role || "Editor"}
      </span>
    </div>
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
