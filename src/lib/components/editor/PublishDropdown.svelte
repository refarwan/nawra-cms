<script lang="ts">
  import Icon from "@iconify/svelte";

  import type { EditorState } from "./editor-state.svelte";

  let { editor }: { editor: EditorState } = $props();

  const supportsDraft = $derived(editor.targetType === "page" || editor.targetType === "article");
  const primaryLabel = $derived(
    !editor.targetType ? "Simulasikan Publish" : supportsDraft ? "Publikasikan" : "Simpan"
  );
  const primaryIcon = $derived(
    supportsDraft || !editor.targetType ? "lucide:upload-cloud" : "lucide:save"
  );
</script>

<div class="flex items-center gap-2">
  {#if supportsDraft}
    <button
      type="button"
      onclick={() => editor.publish("draft")}
      class="flex cursor-pointer items-center gap-1.5 rounded-md border border-[#333] bg-[#2c2c2c] px-2.5 py-1.5 text-xs font-medium text-neutral-200 transition hover:bg-[#383838] hover:text-white active:scale-95"
      title="Simpan sebagai Draft"
    >
      <Icon icon="lucide:file-edit" class="h-3.5 w-3.5 text-amber-400" />
      <span>Draft</span>
    </button>
  {/if}

  <button
    type="button"
    onclick={() => editor.publish("published")}
    class="flex cursor-pointer items-center gap-1.5 rounded-md bg-[#0d99ff] px-3 py-1.5 text-xs font-semibold text-white transition hover:brightness-110 active:scale-95"
  >
    <Icon icon={primaryIcon} class="h-3.5 w-3.5" />
    <span>{primaryLabel}</span>
  </button>
</div>
