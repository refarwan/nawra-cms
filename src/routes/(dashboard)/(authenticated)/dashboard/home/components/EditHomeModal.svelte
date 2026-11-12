<script lang="ts">
  import EditSectionModal from "../../../components/EditSectionModal.svelte";

  let {
    homepage,
    onClose
  }: {
    homepage: { id: string; title: string };
    onClose: () => void;
  } = $props();
</script>

<EditSectionModal
  heading="Ubah Nama Laman Utama"
  fieldLabel="Judul Laman Utama"
  inputId="home-title-edit"
  item={homepage}
  {onClose}
/>
