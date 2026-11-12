<script lang="ts">
  import EditSectionModal from "../../../components/EditSectionModal.svelte";

  let {
    footer,
    onClose
  }: {
    footer: { id: string; title: string };
    onClose: () => void;
  } = $props();
</script>

<EditSectionModal
  heading="Ubah Nama Footer"
  fieldLabel="Judul Footer"
  inputId="footer-title-edit"
  item={footer}
  {onClose}
/>
