<script lang="ts">
  import EditSectionModal from "../../../components/EditSectionModal.svelte";

  let {
    header,
    onClose
  }: {
    header: { id: string; title: string };
    onClose: () => void;
  } = $props();
</script>

<EditSectionModal
  heading="Ubah Nama Header"
  fieldLabel="Judul Header"
  inputId="header-title-edit"
  item={header}
  {onClose}
/>
