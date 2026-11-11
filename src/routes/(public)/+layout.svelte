<script lang="ts">
  import type { LayoutProps } from "./$types";

  let { children }: LayoutProps = $props();
</script>

<div class="min-h-screen bg-neutral-950 font-sans text-neutral-100 antialiased">
  {@render children()}
</div>
