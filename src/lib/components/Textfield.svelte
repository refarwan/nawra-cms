<script lang="ts">
  import type { HTMLInputAttributes } from "svelte/elements";

  interface Props {
    type?: "text" | "password" | "email" | "tel" | "number" | "date";
    id?: string;
    name?: string;
    label?: string;
    value?: string | number;
    placeholder?: string;
    prefix?: string;
    min?: string | number;
    max?: string | number;
    step?: string | number;
    maxlength?: number;
    isError?: boolean;
    supporting?: string[];
    disabled?: boolean;
    readonly?: boolean;
    required?: boolean;
    autocomplete?: HTMLInputAttributes["autocomplete"];
    class?: string;
    inputClass?: string;
    oninput?: (e: Event & { currentTarget: HTMLInputElement }) => void;
    onblur?: (e: FocusEvent & { currentTarget: HTMLInputElement }) => void;
  }

  let {
    type = "text",
    id,
    name,
    label,
    value = $bindable(""),
    placeholder,
    prefix,
    min,
    max,
    step,
    maxlength,
    isError = false,
    supporting = [],
    disabled = false,
    readonly = false,
    required = false,
    autocomplete,
    class: className = "",
    inputClass = "",
    oninput,
    onblur
  }: Props = $props();
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

  {#if prefix}
    <div
      class="flex h-11 w-full items-center overflow-hidden rounded-xl border border-gray-200 bg-white transition-all group-data-[is-error=true]:border-red-600 focus-within:border-[#0d99ff] focus-within:ring-1 focus-within:ring-[#0d99ff] group-data-[is-error=true]:focus-within:border-red-600 group-data-[is-error=true]:focus-within:ring-red-600"
    >
      <span
        class="flex h-full shrink-0 items-center border-r border-gray-200 bg-gray-50 px-3 text-xs text-gray-500 select-none"
      >
        {prefix}
      </span>
      <input
        {id}
        {name}
        {type}
        {placeholder}
        {min}
        {max}
        {step}
        {maxlength}
        {disabled}
        {readonly}
        {required}
        {autocomplete}
        {oninput}
        {onblur}
        bind:value
        aria-invalid={isError}
        class={[
          "h-full w-full bg-transparent px-3 text-sm leading-relaxed text-gray-900 placeholder:text-gray-400 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-50",
          inputClass
        ]}
      />
    </div>
  {:else}
    <input
      {id}
      {name}
      {type}
      {placeholder}
      {min}
      {max}
      {step}
      {maxlength}
      {disabled}
      {readonly}
      {required}
      {autocomplete}
      {oninput}
      {onblur}
      bind:value
      aria-invalid={isError}
      class={[
        "h-11 w-full rounded-xl border border-gray-200 bg-white px-3.5 text-sm leading-relaxed text-gray-900 transition-all group-data-[is-error=true]:border-red-600 placeholder:text-gray-400 focus:border-[#0d99ff] focus:ring-1 focus:ring-[#0d99ff] focus:outline-none group-data-[is-error=true]:focus:border-red-600 group-data-[is-error=true]:focus:ring-red-600 disabled:cursor-not-allowed disabled:bg-gray-50",
        inputClass
      ]}
    />
  {/if}

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
