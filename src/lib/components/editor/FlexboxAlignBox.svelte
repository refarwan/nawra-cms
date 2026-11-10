<script lang="ts">
  let {
    flexDirection = "row",
    justifyContent = "flex-start",
    alignItems = "center",
    onChange
  }: {
    flexDirection?: "row" | "column";
    justifyContent?: "flex-start" | "center" | "flex-end" | "space-between";
    alignItems?: "flex-start" | "center" | "flex-end" | "stretch";
    onChange: (
      justify: "flex-start" | "center" | "flex-end" | "space-between",
      align: "flex-start" | "center" | "flex-end"
    ) => void;
  } = $props();

  const isAuto = $derived(justifyContent === "space-between");

  const activePos = $derived.by(() => {
    if (flexDirection === "row") {
      const x =
        justifyContent === "space-between"
          ? 1
          : justifyContent === "flex-end"
            ? 2
            : justifyContent === "center"
              ? 1
              : 0;
      const y = alignItems === "flex-end" ? 2 : alignItems === "flex-start" ? 0 : 1;
      return { x, y };
    }
    const x = alignItems === "flex-end" ? 2 : alignItems === "flex-start" ? 0 : 1;
    const y =
      justifyContent === "space-between"
        ? 1
        : justifyContent === "flex-end"
          ? 2
          : justifyContent === "center"
            ? 1
            : 0;
    return { x, y };
  });

  const points = [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 2, y: 0 },
    { x: 0, y: 1 },
    { x: 1, y: 1 },
    { x: 2, y: 1 },
    { x: 0, y: 2 },
    { x: 1, y: 2 },
    { x: 2, y: 2 }
  ];

  function getTooltipLabel(x: number, y: number) {
    if (isAuto) {
      if (flexDirection === "row") {
        return y === 0 ? "Align top" : y === 1 ? "Align center" : "Align bottom";
      }
      return x === 0 ? "Align left" : x === 1 ? "Align center" : "Align right";
    }
    const rowNames = ["top", "center", "bottom"];
    const colNames = ["left", "center", "right"];
    if (x === 1 && y === 1) return "Align center";
    if (x === 1) return `Align ${rowNames[y]}`;
    if (y === 1) return `Align ${colNames[x]}`;
    return `Align ${rowNames[y]} ${colNames[x]}`;
  }

  function handleDoubleClick() {
    if (isAuto) {
      const align =
        flexDirection === "row"
          ? activePos.y === 0
            ? "flex-start"
            : activePos.y === 2
              ? "flex-end"
              : "center"
          : activePos.x === 0
            ? "flex-start"
            : activePos.x === 2
              ? "flex-end"
              : "center";
      onChange("center", align);
    } else {
      const align =
        flexDirection === "row"
          ? activePos.y === 0
            ? "flex-start"
            : activePos.y === 2
              ? "flex-end"
              : "center"
          : activePos.x === 0
            ? "flex-start"
            : activePos.x === 2
              ? "flex-end"
              : "center";
      onChange("space-between", align);
    }
  }

  function handleSelect(x: number, y: number) {
    if (isAuto) {
      if (flexDirection === "row") {
        const align = y === 0 ? "flex-start" : y === 1 ? "center" : "flex-end";
        onChange("space-between", align);
      } else {
        const align = x === 0 ? "flex-start" : x === 1 ? "center" : "flex-end";
        onChange("space-between", align);
      }
      return;
    }

    let justify: "flex-start" | "center" | "flex-end";
    let align: "flex-start" | "center" | "flex-end";

    if (flexDirection === "row") {
      justify = x === 0 ? "flex-start" : x === 1 ? "center" : "flex-end";
      align = y === 0 ? "flex-start" : y === 1 ? "center" : "flex-end";
    } else {
      justify = y === 0 ? "flex-start" : y === 1 ? "center" : "flex-end";
      align = x === 0 ? "flex-start" : x === 1 ? "center" : "flex-end";
    }

    onChange(justify, align);
  }
</script>

<div
  role="region"
  aria-label="Figma Flexbox Alignment"
  ondblclick={handleDoubleClick}
  class="relative h-[74px] w-full rounded-lg border border-[#0d99ff] bg-[#252528] p-1.5 select-none"
  title="Klik untuk atur posisi. Klik 2x untuk Spasi Otomatis (Auto / Space-between)"
>
  <div class="grid h-full w-full grid-cols-3 grid-rows-3">
    {#each points as pt (`${pt.x}-${pt.y}`)}
      {@const isRowActive = isAuto && flexDirection === "row" && pt.y === activePos.y}
      {@const isColActive = isAuto && flexDirection === "column" && pt.x === activePos.x}
      {@const isSingleActive = !isAuto && activePos.x === pt.x && activePos.y === pt.y}
      <button
        type="button"
        onclick={() => handleSelect(pt.x, pt.y)}
        ondblclick={(e) => {
          e.stopPropagation();
          handleDoubleClick();
        }}
        class="group relative flex h-full w-full cursor-pointer items-center justify-center rounded transition hover:bg-white/5"
      >
        <!-- Floating Figma Tooltip on hover -->
        <div
          class="pointer-events-none absolute -top-7 left-1/2 z-30 hidden -translate-x-1/2 items-center rounded border border-[#383838] bg-[#18181b] px-2 py-0.5 text-[10px] font-medium whitespace-nowrap text-white group-hover:flex"
        >
          {getTooltipLabel(pt.x, pt.y)}
          <div
            class="absolute -bottom-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rotate-45 border-r border-b border-[#383838] bg-[#18181b]"
          ></div>
        </div>

        {#if isRowActive}
          <!-- Figma Auto mode (row): vertical bars with center bar shorter -->
          <span
            class="{pt.x === 1 ? 'h-2' : 'h-3.5'} w-[2px] rounded-full bg-[#0d99ff] transition-all"
          ></span>
        {:else if isColActive}
          <!-- Figma Auto mode (column): horizontal bars with center bar shorter -->
          <span
            class="{pt.y === 1 ? 'w-2' : 'w-3.5'} h-[2px] rounded-full bg-[#0d99ff] transition-all"
          ></span>
        {:else if isSingleActive}
          <!-- Figma Packed mode: directional bars -->
          {#if flexDirection === "row"}
            <div class="flex items-center gap-0.5">
              <span class="h-2 w-0.5 rounded-full bg-[#0d99ff]"></span>
              <span class="h-3.5 w-1 rounded-full bg-[#0d99ff]"></span>
              <span class="h-2 w-0.5 rounded-full bg-[#0d99ff]"></span>
            </div>
          {:else}
            <div class="flex flex-col items-center gap-0.5">
              <span class="h-0.5 w-2 rounded-full bg-[#0d99ff]"></span>
              <span class="h-1 w-3.5 rounded-full bg-[#0d99ff]"></span>
              <span class="h-0.5 w-2 rounded-full bg-[#0d99ff]"></span>
            </div>
          {/if}
        {:else}
          <span
            class="h-1 w-1 rounded-full bg-[#707070] transition-all group-hover:scale-125 group-hover:bg-neutral-200"
          ></span>
        {/if}
      </button>
    {/each}
  </div>
</div>
