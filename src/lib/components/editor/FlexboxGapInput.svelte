<script lang="ts">
  import Icon from "@iconify/svelte";

  import { handleNumberKeydown, sanitizeNumber } from "./number-input-utils";

  let {
    gapX = 0,
    gapY = 0,
    isAuto = false,
    flexDirection = "row",
    onChangeGapX,
    onChangeGapY,
    onSetAuto,
    onUnsetAuto
  }: {
    gapX: number;
    gapY: number;
    isAuto: boolean;
    flexDirection: "row" | "column";
    onChangeGapX: (val: number) => void;
    onChangeGapY: (val: number) => void;
    onSetAuto: () => void;
    onUnsetAuto: (val: number) => void;
  } = $props();

  let isDropdownOpen = $state(false);
  let containerEl: HTMLElement | undefined = $state();

  const primaryGap = $derived(flexDirection === "row" ? gapX : gapY);

  $effect(() => {
    if (!isDropdownOpen) return;

    function handlePointerDown(e: PointerEvent) {
      if (containerEl && !containerEl.contains(e.target as Node)) {
        isDropdownOpen = false;
      }
    }

    window.addEventListener("pointerdown", handlePointerDown);
    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
    };
  });

  function handlePrimaryChange(val: number) {
    if (flexDirection === "row") {
      onChangeGapX(val);
    } else {
      onChangeGapY(val);
    }
  }

  function handleSelectPreset(val: number | "auto") {
    isDropdownOpen = false;
    if (val === "auto") {
      onSetAuto();
    } else {
      onUnsetAuto(val);
    }
  }
</script>

<div bind:this={containerEl} class="relative flex h-[74px] flex-col justify-between">
  <!-- Gap Primary Input (Figma Auto layout style) -->
  <div
    class="flex h-9 items-center justify-between rounded-lg border border-[#333] bg-[#252528] px-2.5 transition focus-within:border-[#0d99ff] hover:border-[#444]"
  >
    <div class="flex items-center gap-1.5 text-neutral-400">
      {#if flexDirection === "row"}
        <!-- Horizontal Spacing Icon )·( -->
        <svg
          width="14"
          height="14"
          viewBox="0 0 16 16"
          fill="none"
          class="shrink-0 text-neutral-400"
        >
          <path
            d="M3 3C4.5 5 4.5 11 3 13M13 3C11.5 5 11.5 11 13 13M8 7.5A0.5 0.5 0 1 1 8 8.5A0.5 0.5 0 1 1 8 7.5Z"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
          />
        </svg>
      {:else}
        <!-- Vertical Spacing Icon -->
        <svg
          width="14"
          height="14"
          viewBox="0 0 16 16"
          fill="none"
          class="shrink-0 text-neutral-400"
        >
          <path
            d="M3 3C5 4.5 11 4.5 13 3M3 13C5 11.5 11 11.5 13 13M7.5 8A0.5 0.5 0 1 1 8.5 8A0.5 0.5 0 1 1 7.5 8Z"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
          />
        </svg>
      {/if}
    </div>

    {#if isAuto}
      <button
        type="button"
        onclick={() => (isDropdownOpen = !isDropdownOpen)}
        class="flex flex-1 items-center justify-end gap-1 font-mono text-xs font-semibold text-[#0d99ff]"
      >
        <span>Auto</span>
      </button>
    {:else}
      <input
        type="text"
        inputmode="numeric"
        value={primaryGap}
        oninput={(e) => {
          const target = e.target as HTMLInputElement;
          if (target.value.toLowerCase() === "auto") {
            onSetAuto();
          } else {
            target.value = target.value.replace(/\D/g, "");
            handlePrimaryChange(sanitizeNumber(target.value));
          }
        }}
        onkeydown={(e) => handleNumberKeydown(e, primaryGap, handlePrimaryChange, { min: 0 })}
        class="w-full bg-transparent text-right font-mono text-xs text-white focus:outline-none"
      />
    {/if}

    <button
      type="button"
      onclick={() => (isDropdownOpen = !isDropdownOpen)}
      class="ml-1 cursor-pointer text-neutral-400 hover:text-white"
      title="Pilihan preset spasi"
    >
      <Icon icon="lucide:chevron-down" class="h-3.5 w-3.5" />
    </button>
  </div>

  <div class="flex items-center justify-between text-[10px] text-neutral-400">
    <span>Spasi Antar Item</span>
    {#if isAuto}
      <span class="font-medium text-[#0d99ff]">Space Between</span>
    {:else}
      <span class="font-mono text-neutral-300">{primaryGap}px</span>
    {/if}
  </div>

  <!-- Dropdown Preset Menu -->
  {#if isDropdownOpen}
    <div
      class="absolute top-10 right-0 z-50 w-36 rounded-lg border border-[#383838] bg-[#1e1e20] p-1 text-xs select-none"
    >
      <button
        type="button"
        onclick={() => handleSelectPreset("auto")}
        class="flex w-full items-center justify-between rounded px-2 py-1 text-left hover:bg-white/10 {isAuto
          ? 'font-medium text-[#0d99ff]'
          : 'text-white'}"
      >
        <span>Auto (Spasi Penuh)</span>
        {#if isAuto}
          <Icon icon="lucide:check" class="h-3 w-3" />
        {/if}
      </button>
      <div class="my-1 border-t border-[#2c2c2c]"></div>
      {#each [0, 8, 12, 16, 24, 32] as val (val)}
        <button
          type="button"
          onclick={() => handleSelectPreset(val)}
          class="flex w-full items-center justify-between rounded px-2 py-1 text-left hover:bg-white/10 {!isAuto &&
          primaryGap === val
            ? 'font-medium text-[#0d99ff]'
            : 'text-white'}"
        >
          <span>{val} px</span>
          {#if !isAuto && primaryGap === val}
            <Icon icon="lucide:check" class="h-3 w-3" />
          {/if}
        </button>
      {/each}
    </div>
  {/if}
</div>
