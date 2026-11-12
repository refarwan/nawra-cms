<script lang="ts">
  import CreateSectionModal from "../../../components/CreateSectionModal.svelte";

  let { onClose }: { onClose: () => void } = $props();
</script>

<CreateSectionModal
  heading="Tambah Footer Baru"
  subtitle="Buat template footer baru dengan dasar putih"
  fieldLabel="Judul Footer"
  placeholder="Contoh: Nawra Footer / Minimalis"
  inputId="create-footer-title"
  {onClose}
/>
