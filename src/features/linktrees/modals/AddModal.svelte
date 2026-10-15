<script>
  import { createEventDispatcher } from "svelte";
  import { Plus, X, LoaderCircle } from "lucide-svelte";
  import { linkTreesStore } from "../states/linkTreesStore";
  import { showErrorDialog } from "../../../helpers/toolsHelper";

  export let show = false;
  export let onClose = undefined;

  const dispatch = createEventDispatcher();

  let loading = false;
  let title = "";
  let type = "public";
  let description = "";

  function handleClose() {
    dispatch("close");
    if (onClose) onClose();
  }

  $: {
    if (show) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }

  $: if ($linkTreesStore.isLinkTreeAdd) {
    loading = false;
    linkTreesStore.setIsLinkTreeAdd(false);
    if ($linkTreesStore.isLinkTreeAdded) {
      linkTreesStore.setIsLinkTreeAdded(false);
      linkTreesStore.asyncSetLinkTrees();
      title = "";
      type = "public";
      description = "";
      handleClose();
    }
  }

  function handleSave() {
    if (!title.trim()) {
      showErrorDialog("Judul tidak boleh kosong");
      return;
    }

    if (!type.trim()) {
      showErrorDialog("Tipe tidak boleh kosong");
      return;
    }

    if (!description.trim()) {
      showErrorDialog("Deskripsi tidak boleh kosong");
      return;
    }

    loading = true;
    linkTreesStore.asyncSetIsLinkTreeAdd(title.trim(), type, description.trim());
  }
</script>

{#if show}
  <div
    data-testid="add-linktree-modal"
    role="dialog"
    aria-modal="true"
    aria-labelledby="add-modal-title"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200"
  >
    <div
      class="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]"
    >
      <!-- Modal Header -->
      <div
        class="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80 shrink-0"
      >
        <div class="flex items-center gap-2.5">
          <div
            class="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center"
          >
            <Plus size={20} strokeWidth={2.5} />
          </div>
          <div>
            <h2 id="add-modal-title" class="text-base font-bold text-slate-800">
              Tambah Link Tree Baru
            </h2>
            <p class="text-xs text-slate-600">
              Buat halaman kumpulan tautan baru Anda
            </p>
          </div>
        </div>
        <button
          type="button"
          data-testid="close-add-modal-btn"
          on:click={handleClose}
          aria-label="Tutup Dialog"
          class="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      <!-- Modal Form Body -->
      <form
        on:submit|preventDefault={handleSave}
        class="p-6 space-y-4 overflow-y-auto"
      >
        <div>
          <label
            for="add-title"
            class="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5"
          >
            Judul Link Tree
          </label>
          <input
            id="add-title"
            data-testid="add-linktree-title-input"
            type="text"
            bind:value={title}
            placeholder="Misal: Profil & Media Sosial Saya"
            class="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-500 text-sm focus:bg-white focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 transition-all"
          />
        </div>

        <div>
          <label
            for="add-type"
            class="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5"
          >
            Tipe Akses
          </label>
          <select
            id="add-type"
            data-testid="add-linktree-type-select"
            bind:value={type}
            class="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 text-sm focus:bg-white focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 transition-all"
          >
            <option value="">-- Pilih Tipe Akses --</option>
            <option value="public">Publik (Terlihat oleh semua pengguna)</option>
            <option value="unlisted">Unlisted (Hanya lewat tautan langsung)</option>
            <option value="private">Pribadi (Hanya terlihat oleh Anda)</option>
          </select>
        </div>

        <div>
          <label
            for="add-desc"
            class="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5"
          >
            Deskripsi
          </label>
          <textarea
            id="add-desc"
            data-testid="add-linktree-description-input"
            bind:value={description}
            rows="4"
            placeholder="Deskripsikan tujuan kumpulan tautan ini..."
            class="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-500 text-sm focus:bg-white focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 transition-all"
          ></textarea>
        </div>

        <!-- Footer Actions -->
        <div class="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            data-testid="cancel-add-modal-btn"
            on:click={handleClose}
            class="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
          >
            Batal
          </button>
          <button
            type="submit"
            data-testid="submit-add-modal-btn"
            disabled={loading}
            class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 shadow-md shadow-indigo-600/25 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
          >
            {#if loading}
              <LoaderCircle size={16} class="animate-spin" />
              <span>Menyimpan...</span>
            {:else}
              <span>Simpan Link Tree</span>
            {/if}
          </button>
        </div>
      </form>
    </div>
  </div>
{/if}
