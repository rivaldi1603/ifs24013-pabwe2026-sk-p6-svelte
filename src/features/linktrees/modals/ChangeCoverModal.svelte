<script>
  import { createEventDispatcher } from "svelte";
  import { ImagePlus, X, LoaderCircle, Upload } from "lucide-svelte";
  import { linkTreesStore } from "../states/linkTreesStore";
  import { showErrorDialog } from "../../../helpers/toolsHelper";

  export let show = false;
  export let linkTree = null;
  export let linkTreeId = null;
  export let onClose = undefined;

  const dispatch = createEventDispatcher();

  let loading = false;
  let file = null;
  let previewUrl = null;

  $: activeId = linkTree?.id || linkTreeId;

  function handleClose() {
    previewUrl = null;
    file = null;
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

  $: if ($linkTreesStore.isLinkTreeChangeCover) {
    loading = false;
    linkTreesStore.setIsLinkTreeChangeCover(false);
    if ($linkTreesStore.isLinkTreeChangedCover) {
      linkTreesStore.setIsLinkTreeChangedCover(false);
      if (activeId) {
        linkTreesStore.asyncSetLinkTree(activeId);
      }
      handleClose();
    }
  }

  function handleFileChange(e) {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("image/")) {
      showErrorDialog("Pilih file gambar (JPG/PNG)!");
      return;
    }

    if (selectedFile.size > 1024 * 1024) {
      showErrorDialog("Ukuran gambar maksimal 1MB!");
      return;
    }

    file = selectedFile;
    previewUrl = URL.createObjectURL(selectedFile);
  }

  function handleSave() {
    if (!file) {
      showErrorDialog("Silakan pilih cover baru!");
      return;
    }

    loading = true;
    linkTreesStore.asyncSetIsLinkTreeChangeCover(activeId, file);
  }
</script>

{#if show && activeId}
  <div
    data-testid="change-cover-modal"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200"
  >
    <div
      class="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden transform transition-all"
    >
      <div
        class="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70"
      >
        <div class="flex items-center gap-2.5">
          <div
            class="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center"
          >
            <ImagePlus size={18} strokeWidth={2.5} />
          </div>
          <h3 class="text-base font-bold text-slate-800">
            Ubah Cover Link Tree
          </h3>
        </div>
        <button
          type="button"
          data-testid="close-cover-modal-btn"
          on:click={handleClose}
          class="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      <form on:submit|preventDefault={handleSave} class="p-6 space-y-4">
        <div>
          <span class="block text-sm font-semibold text-slate-700 mb-2">
            Pilih Gambar Cover
          </span>

          <label
            for="cover-input"
            class="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-2xl p-6 hover:bg-slate-50 hover:border-indigo-400 transition-all cursor-pointer text-center relative overflow-hidden"
          >
            {#if previewUrl}
              <img
                src={previewUrl}
                alt="Preview Cover"
                class="absolute inset-0 w-full h-full object-cover"
              />
              <div
                class="absolute inset-0 bg-slate-950/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
              >
                <span class="text-xs font-semibold text-white bg-slate-900/80 px-3 py-1.5 rounded-lg">
                  Ganti Gambar
                </span>
              </div>
            {:else}
              <div class="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
                <Upload size={22} />
              </div>
              <p class="text-sm font-medium text-slate-700">
                Klik untuk unggah gambar
              </p>
              <p class="text-xs text-slate-400 mt-1">
                PNG, JPG atau WEBP (Maksimal 1MB)
              </p>
            {/if}

            <input
              id="cover-input"
              data-testid="cover-file-input"
              type="file"
              accept="image/*"
              on:change={handleFileChange}
              class="hidden"
            />
          </label>
        </div>

        <div class="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            data-testid="cancel-cover-modal-btn"
            on:click={handleClose}
            class="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Batal
          </button>
          <button
            type="submit"
            data-testid="submit-cover-modal-btn"
            disabled={loading}
            class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-sky-600 hover:bg-sky-700 active:bg-sky-800 shadow-md shadow-sky-600/25 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
          >
            {#if loading}
              <LoaderCircle size={16} class="animate-spin" />
              <span>Mengunggah...</span>
            {:else}
              <span>Unggah Cover</span>
            {/if}
          </button>
        </div>
      </form>
    </div>
  </div>
{/if}
