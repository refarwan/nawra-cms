<script lang="ts">
  import CreateSectionModal from "../../../components/CreateSectionModal.svelte";

  let { onClose }: { onClose: () => void } = $props();
</script>

<CreateSectionModal
  heading="Tambah Header Baru"
  subtitle="Buat template navigasi baru dengan dasar putih"
  fieldLabel="Judul Header"
  placeholder="Contoh: Nawra Header / Promo"
  inputId="create-header-title"
  {onClose}
/>
