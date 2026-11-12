<script lang="ts">
  let {
    name,
    avatarUrl = null
  }: {
    name: string | null | undefined;
    avatarUrl?: string | null;
  } = $props();

  const initial = $derived((name || "U").trim().charAt(0).toUpperCase() || "U");
</script>

{#if name}
  <span class="inline-flex min-w-0 items-center gap-1.5">
    {#if avatarUrl}
      <img
        src={avatarUrl}
        alt={name}
        class="h-5 w-5 shrink-0 rounded-full border border-gray-200 object-cover"
        loading="lazy"
      />
    {:else}
      <span
        class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sky-50 text-[10px] font-bold text-sky-600"
      >
        {initial}
      </span>
    {/if}
    <span class="truncate">{name}</span>
  </span>
{:else}
  <span class="text-gray-400">-</span>
{/if}
