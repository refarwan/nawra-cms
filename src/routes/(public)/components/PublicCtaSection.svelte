<script lang="ts">
  import { resolve } from "$app/paths";
</script>

<section class="py-12 sm:py-16">
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div class="rounded-3xl bg-[#2563eb] px-6 py-14 text-center text-white sm:px-12 sm:py-16">
      <h2 class="mb-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
        Siap Mencoba Visual Studio Tanpa Koding?
      </h2>
      <p class="mx-auto mb-8 max-w-2xl text-base text-blue-100 sm:text-lg">
        Buka halaman editor publik sekarang dan rasakan langsung kemudahan merancang halaman web
        secara visual di browser Anda.
      </p>
      <div class="flex flex-wrap items-center justify-center gap-3.5">
        <a
          href={resolve("/editor")}
          class="inline-flex items-center justify-center rounded-xl bg-white px-6 py-3.5 text-base font-semibold text-gray-900 transition-colors hover:bg-gray-100"
        >
          Coba Editor Sekarang
        </a>
      </div>
    </div>
  </div>
</section>
