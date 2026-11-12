<script lang="ts">
  import CreateSectionModal from "../../../components/CreateSectionModal.svelte";

  let { onClose }: { onClose: () => void } = $props();
</script>

<CreateSectionModal
  heading="Tambah Laman Utama Baru"
  subtitle="Buat laman utama baru dengan dasar putih"
  fieldLabel="Judul Laman Utama"
  placeholder="Contoh: Nawra Laman Utama / Promo"
  inputId="create-home-title"
  {onClose}
/>
