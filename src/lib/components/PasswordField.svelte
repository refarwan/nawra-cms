<script lang="ts">
  import Icon from "@iconify/svelte";

  import type { HTMLInputAttributes } from "svelte/elements";

  interface Props {
    id?: string;
    name?: string;
    label?: string;
    value?: string;
    placeholder?: string;
    isError?: boolean;
    supporting?: string[];
    disabled?: boolean;
    required?: boolean;
    autocomplete?: HTMLInputAttributes["autocomplete"];
    class?: string;
    showPassword?: boolean;
    onTogglePassword?: () => void;
    oninput?: (e: Event & { currentTarget: HTMLInputElement }) => void;
  }

  let {
    id,
    name,
    label,
    value = $bindable(""),
    placeholder = "••••••••",
    isError = false,
    supporting = [],
    disabled = false,
    required = false,
    autocomplete,
    class: className = "",
    showPassword,
    onTogglePassword,
    oninput
  }: Props = $props();

  let internalShow = $state(false);
  const isVisible = $derived(showPassword !== undefined ? showPassword : internalShow);

  function handleToggle() {
    if (onTogglePassword) {
      onTogglePassword();
    } else {
      internalShow = !internalShow;
    }
  }
</script>

<div data-is-error={isError} class={["group flex flex-col gap-1.5", className]}>
  {#if label}
    <label for={id} class="block text-xs font-semibold text-gray-700">
      {label}
      {#if required}
        <span class="text-red-500">*</span>
      {/if}
    </label>
  {/if}

  <div class="relative flex items-center">
    <input
      {id}
      {name}
      type={isVisible ? "text" : "password"}
      {placeholder}
      {disabled}
      {required}
      {autocomplete}
      {oninput}
      bind:value
      aria-invalid={isError}
      class="h-11 w-full rounded-xl border border-gray-200 bg-white px-3.5 pr-11 text-sm leading-relaxed text-gray-900 transition-all group-data-[is-error=true]:border-red-600 placeholder:text-gray-400 focus:border-[#0d99ff] focus:ring-1 focus:ring-[#0d99ff] focus:outline-none group-data-[is-error=true]:focus:border-red-600 group-data-[is-error=true]:focus:ring-red-600 disabled:cursor-not-allowed disabled:bg-gray-50"
    />

    <button
      type="button"
      onclick={handleToggle}
      aria-label={isVisible ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
      class="absolute right-3 flex h-8 w-8 cursor-pointer items-center justify-center text-gray-400 transition-colors hover:text-gray-600 focus:text-gray-600 focus:outline-none"
    >
      <Icon icon={isVisible ? "lucide:eye-off" : "lucide:eye"} class="h-4 w-4" />
    </button>
  </div>

  {#if supporting.length > 0}
    <div class="space-y-0.5 px-1">
      {#each supporting as item (item)}
        <p class="text-xs text-gray-500 group-data-[is-error=true]:text-red-600">
          {item}
        </p>
      {/each}
    </div>
  {/if}
</div>
