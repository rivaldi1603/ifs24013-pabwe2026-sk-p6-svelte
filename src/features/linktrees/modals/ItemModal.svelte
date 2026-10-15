<script>
  import { createEventDispatcher } from "svelte";
  import { Link, PenLine, Plus, X, LoaderCircle } from "lucide-svelte";
  import { linkTreesStore } from "../states/linkTreesStore";
  import { showErrorDialog } from "../../../helpers/toolsHelper";

  export let show = false;
  export let linkTreeId = null;
  export let item = null;
  export let onClose = undefined;

  const dispatch = createEventDispatcher();

  let loading = false;
  let title = "";
  let url = "";

  $: isEdit = Boolean(item && item.id);

  $: if (show) {
    if (item) {
      title = item.title || "";
      url = item.url || "";
    } else {
      title = "";
      url = "";
    }
  }

  function handleClose() {
    title = "";
    url = "";
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

  $: if ($linkTreesStore.isItemAdd) {
    loading = false;
    linkTreesStore.setIsItemAdd(false);
    if ($linkTreesStore.isItemAdded) {
      linkTreesStore.setIsItemAdded(false);
      if (linkTreeId) {
        linkTreesStore.asyncSetLinkTree(linkTreeId);
      }
      handleClose();
    }
  }

  $: if ($linkTreesStore.isItemChange) {
    loading = false;
    linkTreesStore.setIsItemChange(false);
    if ($linkTreesStore.isItemChanged) {
      linkTreesStore.setIsItemChanged(false);
      if (linkTreeId) {
        linkTreesStore.asyncSetLinkTree(linkTreeId);
      }
      handleClose();
    }
  }

  function isValidUrl(str) {
    try {
      const parsed = new URL(str);
      return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
      return false;
    }
  }

  function handleSave() {
    if (!title.trim()) {
      showErrorDialog("Judul tautan tidak boleh kosong");
      return;
    }

    if (!url.trim()) {
      showErrorDialog("URL tautan tidak boleh kosong");
      return;
    }

    if (!isValidUrl(url.trim())) {
      showErrorDialog("Format URL tidak valid (harus diawali http:// atau https://)");
      return;
    }

    loading = true;
    if (isEdit) {
      linkTreesStore.asyncSetIsItemChange(
        linkTreeId,
        item.id,
        title.trim(),
        url.trim()
      );
    } else {
      linkTreesStore.asyncSetIsItemAdd(linkTreeId, title.trim(), url.trim());
    }
  }
</script>

{#if show}
  <div
    data-testid="item-modal"
    role="dialog"
    aria-modal="true"
    aria-labelledby="item-modal-title"
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
            class="w-9 h-9 rounded-xl {isEdit
              ? 'bg-amber-100 text-amber-700'
              : 'bg-indigo-100 text-indigo-700'} flex items-center justify-center"
          >
            {#if isEdit}
              <PenLine size={20} strokeWidth={2.5} />
            {:else}
              <Plus size={20} strokeWidth={2.5} />
            {/if}
          </div>
          <div>
            <h2 id="item-modal-title" class="text-base font-bold text-slate-800">
              {isEdit ? "Ubah Item Tautan" : "Tambah Item Tautan Baru"}
            </h2>
            <p class="text-xs text-slate-600">
              {isEdit
                ? "Perbarui judul dan tautan URL tujuan"
                : "Tambahkan tautan baru ke dalam kumpulan tautan ini"}
            </p>
          </div>
        </div>
        <button
          type="button"
          data-testid="close-item-modal-btn"
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
            for="item-title"
            class="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5"
          >
            Judul / Label Tautan
          </label>
          <input
            id="item-title"
            data-testid="item-title-input"
            type="text"
            bind:value={title}
            placeholder="Misal: Repositori GitHub Proyek"
            class="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-500 text-sm focus:bg-white focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 transition-all"
          />
        </div>

        <div>
          <label
            for="item-url"
            class="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5"
          >
            Alamat URL
          </label>
          <input
            id="item-url"
            data-testid="item-url-input"
            type="url"
            bind:value={url}
            placeholder="https://github.com/username/project"
            class="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 placeholder:text-slate-500 text-sm focus:bg-white focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 transition-all"
          />
        </div>

        <!-- Footer Actions -->
        <div class="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            data-testid="cancel-item-modal-btn"
            on:click={handleClose}
            class="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
          >
            Batal
          </button>
          <button
            type="submit"
            data-testid="submit-item-modal-btn"
            disabled={loading}
            class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white {isEdit
              ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/25'
              : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/25'} active:scale-98 shadow-md disabled:opacity-60 disabled:cursor-not-allowed transition-all"
          >
            {#if loading}
              <LoaderCircle size={16} class="animate-spin" />
              <span>{isEdit ? "Memperbarui..." : "Menyimpan..."}</span>
            {:else}
              <span>{isEdit ? "Simpan Perubahan" : "Tambah Tautan"}</span>
            {/if}
          </button>
        </div>
      </form>
    </div>
  </div>
{/if}
