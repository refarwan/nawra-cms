<script lang="ts">
  import { hexToRgb, hsvToHex, parseHex, rgbToHsv } from "./color-converters";

  let {
    value = $bindable("#0D99FF"),
    onchange
  }: {
    value?: string;
    onchange?: (color: string) => void;
  } = $props();

  let block: HTMLDivElement | undefined = $state();
  let colorLine: HTMLDivElement | undefined = $state();

  let hue = $state(200);
  let saturation = $state(1);
  let brightness = $state(1);
  let blockTop = $state(0);
  let blockLeft = $state(0);
  let lineLeft = $state(0);
  let inputValue = $state(value);

  const currentColor = $derived(hsvToHex(hue, saturation, brightness));
  const hueColor = $derived(hsvToHex(hue, 1, 1));

  const setSlidersPosition = () => {
    if (!block || !colorLine) return;
    const [h, s, v] = rgbToHsv(...hexToRgb(parseHex(value) ?? "#0D99FF"));
    hue = h;
    saturation = s;
    brightness = v;
    const { width, height } = block.getBoundingClientRect();
    blockLeft = s * width;
    blockTop = Math.abs(height * (v - 1));
    lineLeft = (h * colorLine.getBoundingClientRect().width) / 359;
  };

  $effect(() => {
    requestAnimationFrame(setSlidersPosition);
  });

  const commitColor = () => {
    value = currentColor;
    inputValue = currentColor;
    onchange?.(value);
  };

  const moveBlockSlider = (x: number, y: number) => {
    if (!block) return;
    const { width, height } = block.getBoundingClientRect();
    blockLeft = Math.min(Math.max(x, 0), width);
    blockTop = Math.min(Math.max(y, 0), height);
    saturation = blockLeft / width;
    brightness = Math.abs(blockTop / height - 1);
    commitColor();
  };

  const moveLineSlider = (x: number) => {
    if (!colorLine) return;
    const width = colorLine.getBoundingClientRect().width;
    lineLeft = Math.min(Math.max(x, 0), width);
    hue = Math.max(Math.min(Math.round((lineLeft * 359) / width), 359), 0);
    commitColor();
  };

  const dragBlock = (event: PointerEvent) => {
    event.preventDefault();
    const rect = block!.getBoundingClientRect();
    const update = (e: PointerEvent) =>
      moveBlockSlider(e.clientX - rect.left, e.clientY - rect.top);
    update(event);
    const onMove = (e: PointerEvent) => update(e);
    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  const dragLine = (event: PointerEvent) => {
    event.preventDefault();
    const rect = colorLine!.getBoundingClientRect();
    const update = (e: PointerEvent) => moveLineSlider(e.clientX - rect.left);
    update(event);
    const onMove = (e: PointerEvent) => update(e);
    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  const handleInput = (event: Event) => {
    const target = event.target as HTMLInputElement;
    inputValue = target.value;
    const parsed = parseHex(target.value);
    if (parsed) {
      value = parsed;
      onchange?.(value);
      setSlidersPosition();
    }
  };
</script>

<div class="flex w-full flex-col gap-2.5 select-none">
  <!-- 2D Saturation & Brightness Block -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    bind:this={block}
    class="relative h-32 w-full cursor-crosshair overflow-hidden rounded-lg border border-[#333]"
    style={`background-color: ${hueColor}; background-image: linear-gradient(0deg, #000, hsla(0, 0%, 100%, 0)), linear-gradient(90deg, #fff, hsla(20, 42%, 65%, 0));`}
    onpointerdown={dragBlock}
  >
    <div
      class="pointer-events-none absolute -mt-2 -ml-2 h-4 w-4 rounded-full border-2 border-white ring-1 ring-black/40"
      style={`background-color: ${currentColor}; top: ${blockTop}px; left: ${blockLeft}px;`}
    ></div>
  </div>

  <!-- 1D Hue Rainbow Slider -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    bind:this={colorLine}
    class="relative h-3 w-full cursor-pointer rounded-full border border-[#333]"
    style="background-image: linear-gradient(90deg, red, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, red);"
    onpointerdown={dragLine}
  >
    <div
      class="pointer-events-none absolute -top-0.5 -ml-2 h-4 w-4 rounded-full border-2 border-white ring-1 ring-black/40"
      style={`background-color: ${hueColor}; left: ${lineLeft}px;`}
    ></div>
  </div>

  <!-- Preview and Hex Input -->
  <div class="flex items-center gap-2 pt-0.5">
    <div
      class="h-8 w-8 shrink-0 rounded-lg border border-[#444]"
      style={`background-color: ${currentColor}`}
    ></div>
    <div
      class="flex flex-1 items-center gap-1 rounded-lg border border-[#333] bg-[#1a1a1c] px-2 py-1"
    >
      <span class="text-[11px] text-neutral-500">HEX</span>
      <input
        type="text"
        class="w-full bg-transparent font-mono text-xs text-white uppercase focus:outline-none"
        value={inputValue}
        oninput={handleInput}
      />
    </div>
  </div>
</div>
