<script lang="ts">
  export interface TableHeaderColumn {
    label?: string;
    align?: "left" | "center" | "right";
    class?: string;
  }

  interface Props {
    columns: TableHeaderColumn[];
    gridCols: string;
  }

  let { columns, gridCols }: Props = $props();
</script>

<div
  class="hidden {gridCols} items-center gap-4 rounded-t-xl border border-gray-200 bg-gray-50/80 px-4 py-3 text-xs font-semibold tracking-wider text-gray-500 uppercase lg:grid"
>
  {#each columns as col, index (index)}
    <div
      class={`truncate ${
        col.align === "center" ? "text-center" : col.align === "right" ? "text-right" : "text-left"
      } ${col.class ?? ""}`}
    >
      {col.label ?? ""}
    </div>
  {/each}
</div>
