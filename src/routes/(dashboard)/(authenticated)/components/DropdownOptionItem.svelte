<script lang="ts">
  import Icon from "@iconify/svelte";

  import type { DropdownOption } from "./DropdownSelect.svelte";

  interface Props {
    option: DropdownOption;
    isSelected: boolean;
    isActive: boolean;
    onHover: () => void;
    onSelect: () => void;
    itemRef?: HTMLButtonElement;
  }

  let { option, isSelected, isActive, onHover, onSelect, itemRef = $bindable() }: Props = $props();
</script>

<button
  bind:this={itemRef}
  type="button"
  role="option"
  aria-selected={isSelected}
  onmouseenter={onHover}
  onclick={onSelect}
  class={`flex w-full cursor-pointer items-center justify-between px-3.5 py-2 text-left text-[13px] transition-colors ${isActive ? "bg-blue-50 text-[#0d99ff]" : "text-gray-800 hover:bg-gray-50"}`}
>
  <span class="flex items-center gap-2.5 truncate">
    {#if option.icon}
      <span class="shrink-0 text-base select-none">{option.icon}</span>
    {/if}
    <span class={`truncate ${isActive || isSelected ? "font-medium" : "font-normal"}`}>
      {option.label}
    </span>
  </span>
  {#if isSelected}
    <Icon icon="lucide:check" class="h-4 w-4 shrink-0 text-[#0d99ff]" />
  {/if}
</button>
