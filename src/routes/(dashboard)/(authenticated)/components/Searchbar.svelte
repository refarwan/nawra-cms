<script lang="ts">
  import Icon from "@iconify/svelte";

  interface Props {
    value?: string;
    placeholder?: string;
    onInput?: (value: string) => void;
    class?: string;
  }

  let {
    value = $bindable(""),
    placeholder = "Cari...",
    onInput,
    class: className = "w-full sm:max-w-md"
  }: Props = $props();

  const handleInput = (e: Event) => {
    const val = (e.target as HTMLInputElement).value;
    value = val;
    onInput?.(val);
  };
</script>

<div class={`relative ${className}`}>
  <Icon
    icon="lucide:search"
    class="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-gray-400"
  />
  <input
    type="text"
    {value}
    oninput={handleInput}
    {placeholder}
    class="w-full rounded-lg border border-gray-300 bg-white py-2.5 pr-4 pl-10 text-sm text-gray-900 placeholder-gray-400 transition-all focus:border-[#0d99ff] focus:ring-1 focus:ring-[#0d99ff] focus:outline-none"
  />
</div>
