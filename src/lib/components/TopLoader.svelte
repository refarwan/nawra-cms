<script lang="ts">
  import { navigating } from "$app/state";

  import { topLoader } from "#lib/stores/top-loader.svelte";

  interface Props {
    height?: string;
    showGlow?: boolean;
  }

  let { height = "2.5px", showGlow = true }: Props = $props();

  let progress = $state(0);
  let isVisible = $state(false);
  let isFading = $state(false);

  let trickleInterval: ReturnType<typeof setInterval> | undefined;
  let completeTimeout: ReturnType<typeof setTimeout> | undefined;
  let cleanupTimeout: ReturnType<typeof setTimeout> | undefined;

  function clearAllTimers() {
    if (trickleInterval) clearInterval(trickleInterval);
    if (completeTimeout) clearTimeout(completeTimeout);
    if (cleanupTimeout) clearTimeout(cleanupTimeout);
  }

  const isNavigating = $derived(Boolean(navigating.to));
  const isBusy = $derived(isNavigating || topLoader.isActive);

  $effect(() => {
    if (isBusy) {
      clearAllTimers();
      isFading = false;
      isVisible = true;
      progress = 20;

      trickleInterval = setInterval(() => {
        if (progress < 85) {
          const delta = (85 - progress) * 0.12 + Math.random() * 4;
          progress = Math.min(85, progress + delta);
        }
      }, 150);
    } else if (isVisible && !isFading) {
      clearAllTimers();
      progress = 100;

      completeTimeout = setTimeout(() => {
        isFading = true;
        cleanupTimeout = setTimeout(() => {
          isVisible = false;
          isFading = false;
          progress = 0;
        }, 250);
      }, 180);
    }

    return () => {
      clearAllTimers();
    };
  });
</script>

{#if isVisible}
  <div
    class="pointer-events-none fixed top-0 right-0 left-0 z-9999 overflow-hidden"
    style:height
    style:opacity={isFading ? "0" : "1"}
    style="transition: opacity 250ms ease;"
  >
    <div
      class="h-full bg-theme-600 transition-all duration-200 ease-out"
      style:width="{progress}%"
      style:box-shadow={showGlow
        ? "0 0 10px var(--color-theme-600, #2563eb), 0 0 5px var(--color-theme-600, #2563eb)"
        : "none"}
    ></div>
  </div>
{/if}
