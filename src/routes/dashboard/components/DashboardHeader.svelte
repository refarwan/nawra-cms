<script lang="ts">
  import Icon from "@iconify/svelte";

  let {
    user,
    onToggleSidebar
  }: {
    user: { name: string; email: string };
    onToggleSidebar: () => void;
  } = $props();
</script>

<header
  class="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 md:px-8"
>
  <div class="flex items-center gap-3">
    <button
      type="button"
      onclick={onToggleSidebar}
      aria-label="Buka menu navigasi"
      class="rounded-lg p-2 text-gray-500 hover:bg-gray-100 xl:hidden"
    >
      <Icon icon="lucide:menu" class="h-5 w-5" />
    </button>
    <div>
      <span class="text-xs text-gray-400">Dashboard Panel</span>
      <h1 class="text-sm font-bold text-gray-900 md:text-base">CMS Manajemen</h1>
    </div>
  </div>

  <div class="flex items-center gap-3">
    <div class="hidden text-right sm:block">
      <span class="block text-xs font-semibold text-gray-900">{user.name}</span>
      <span class="block text-[11px] text-gray-500">{user.email}</span>
    </div>

    <div
      class="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0d99ff]/10 text-xs font-bold text-[#0d99ff]"
    >
      {user.name.charAt(0).toUpperCase()}
    </div>

    <form method="POST" action="/login?/logout">
      <button
        type="submit"
        title="Keluar dari akun"
        class="flex h-9 items-center gap-1.5 rounded-xl border border-gray-200 px-3 text-xs font-medium text-gray-600 transition hover:bg-red-50 hover:text-red-600"
      >
        <Icon icon="lucide:log-out" class="h-3.5 w-3.5" />
        <span class="hidden md:inline">Keluar</span>
      </button>
    </form>
  </div>
</header>
