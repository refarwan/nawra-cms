<script lang="ts">
  import Icon from "@iconify/svelte";

  import ImagePickerModal from "#lib/components/media/ImagePickerModal.svelte";
  import Textfield from "#lib/components/Textfield.svelte";

  import DropdownSelect from "../../../components/DropdownSelect.svelte";

  import type { DropdownOption } from "../../../components/DropdownSelect.svelte";
  import type { CategoryOption } from "./ArticleToolbar.svelte";

  let showImagePicker = $state(false);

  let {
    idPrefix,
    title = $bindable(),
    slugValue,
    onSlugInput,
    onTitleInput,
    titleErrors = [],
    slugErrors = [],
    categoryId = $bindable(),
    status = $bindable(),
    coverImage = $bindable(),
    excerpt = $bindable(),
    categories
  }: {
    idPrefix: string;
    title: string;
    slugValue: string;
    onSlugInput: (val: string) => void;
    onTitleInput?: () => void;
    titleErrors?: string[];
    slugErrors?: string[];
    categoryId: string;
    status: "draft" | "published";
    coverImage: string;
    excerpt: string;
    categories: CategoryOption[];
  } = $props();

  const categoryOptions = $derived<DropdownOption[]>([
    { value: "", label: "Tanpa Kategori" },
    ...categories.map((cat) => ({ value: cat.id, label: cat.name }))
  ]);

  const statusOptions: DropdownOption[] = [
    { value: "draft", label: "Draft (Belum Publik)" },
    { value: "published", label: "Published (Langsung Publik)" }
  ];

  const selectedCategorySlug = $derived(
    categories.find((cat) => cat.id === categoryId)?.slug || "uncategorized"
  );
</script>

<div class="space-y-4">
  <Textfield
    id="{idPrefix}-title"
    name="title"
    label="Judul Artikel"
    required
    bind:value={title}
    placeholder="Contoh: Tips Membangun Website Modern"
    isError={titleErrors.length > 0}
    supporting={titleErrors}
    oninput={onTitleInput}
  />

  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
    <DropdownSelect
      id="{idPrefix}-cat"
      name="categoryId"
      label="Kategori"
      bind:value={categoryId}
      options={categoryOptions}
      placeholder="Pilih kategori..."
      searchable={categories.length > 5}
      searchPlaceholder="Cari kategori..."
    />

    <DropdownSelect
      id="{idPrefix}-status"
      name="status"
      label="Status"
      value={status}
      options={statusOptions}
      onChange={(val) => {
        status = val === "published" ? "published" : "draft";
      }}
    />
  </div>

  <Textfield
    id="{idPrefix}-slug"
    name="slug"
    label="Slug URL"
    prefix="/blog/{selectedCategorySlug}/"
    required
    value={slugValue}
    placeholder="tips-website-modern"
    inputClass="font-mono"
    isError={slugErrors.length > 0}
    supporting={slugErrors.length > 0
      ? slugErrors
      : slugValue
        ? [`URL publik: /blog/${selectedCategorySlug}/${slugValue}`]
        : []}
    oninput={(e) => onSlugInput(e.currentTarget.value)}
  />

  <div>
    <label for="{idPrefix}-cover" class="block text-xs font-semibold text-gray-700">
      Gambar Sampul
    </label>
    <div class="mt-1.5 flex items-center gap-2">
      {#if coverImage}
        <img
          src={coverImage}
          alt="Preview sampul"
          class="h-10 w-10 shrink-0 rounded-lg border border-gray-200 object-cover"
        />
      {/if}
      <input
        id="{idPrefix}-cover"
        type="text"
        name="coverImage"
        bind:value={coverImage}
        placeholder="https://... atau /api/media/..."
        class="h-11 w-full rounded-xl border border-gray-200 px-3.5 text-sm text-gray-900 focus:border-[#0d99ff] focus:ring-1 focus:ring-[#0d99ff] focus:outline-none"
      />
      <button
        type="button"
        onclick={() => (showImagePicker = true)}
        class="inline-flex h-11 shrink-0 cursor-pointer items-center gap-1.5 rounded-xl border border-gray-200 bg-gray-50 px-3.5 text-xs font-semibold text-gray-700 transition-colors hover:border-[#0d99ff] hover:text-[#0d99ff]"
      >
        <Icon icon="lucide:images" class="h-4 w-4" />
        <span>Galeri</span>
      </button>
    </div>
  </div>

  <div>
    <div class="flex items-center justify-between">
      <label for="{idPrefix}-excerpt" class="block text-xs font-semibold text-gray-700">
        Short Description / Ringkasan
      </label>
      <span class="text-[11px] text-gray-400">{excerpt.length}/160</span>
    </div>
    <textarea
      id="{idPrefix}-excerpt"
      name="excerpt"
      rows={3}
      bind:value={excerpt}
      placeholder="Ringkasan singkat artikel untuk daftar blog dan SEO..."
      class="mt-1.5 w-full resize-none rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm text-gray-900 focus:border-[#0d99ff] focus:ring-1 focus:ring-[#0d99ff] focus:outline-none"
    ></textarea>
  </div>
</div>

{#if showImagePicker}
  <ImagePickerModal
    onClose={() => (showImagePicker = false)}
    onSelect={(img) => {
      coverImage = img.url;
      showImagePicker = false;
    }}
  />
{/if}
