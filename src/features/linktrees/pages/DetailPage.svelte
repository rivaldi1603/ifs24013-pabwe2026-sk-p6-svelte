<script>
  import { onMount } from "svelte";
  import { navigate } from "../../../router.js";
  import ChangeCoverModal from "../modals/ChangeCoverModal.svelte";
  import ChangeModal from "../modals/ChangeModal.svelte";
  import ItemModal from "../modals/ItemModal.svelte";
  import { linkTreesStore } from "../states/linkTreesStore";
  import { usersStore } from "../../users/states/usersStore";
  import { formatDate, showConfirmDialog } from "../../../helpers/toolsHelper";
  import {
    ArrowLeft,
    ImagePlus,
    PenLine,
    Trash2,
    Link,
    ExternalLink,
    Plus,
    Globe,
    Calendar,
    Clock,
    Pencil,
  } from "lucide-svelte";

  export let linkTreeId;

  $: profile = $usersStore.profile;
  $: linkTree = $linkTreesStore.linkTree;

  let showCoverModal = false;
  let showEditModal = false;
  let showItemModal = false;
  let selectedItem = null;

  onMount(() => {
    if (linkTreeId) {
      linkTreesStore.asyncSetLinkTree(linkTreeId);
    }
  });

  let prevId = linkTreeId;
  $: if (linkTreeId !== prevId) {
    prevId = linkTreeId;
    linkTreesStore.asyncSetLinkTree(linkTreeId);
  }

  $: if ($linkTreesStore.isLinkTree) {
    linkTreesStore.setIsLinkTree(false);
    if (!linkTree) {
      navigate("/");
    }
  }

  $: if ($linkTreesStore.isLinkTreeDeleted) {
    linkTreesStore.setIsLinkTreeDeleted(false);
    navigate("/");
  }

  async function handleDelete() {
    const result = await showConfirmDialog(
      "Apakah Anda yakin ingin menghapus Link Tree ini?"
    );
    if (result.isConfirmed) {
      linkTreesStore.asyncSetIsLinkTreeDelete(linkTree.id);
    }
  }

  function handleAddItem() {
    selectedItem = null;
    showItemModal = true;
  }

  function handleEditItem(item) {
    selectedItem = item;
    showItemModal = true;
  }

  async function handleDeleteItem(itemId) {
    const result = await showConfirmDialog(
      "Apakah Anda yakin ingin menghapus tautan ini?"
    );
    if (result.isConfirmed) {
      linkTreesStore.asyncSetIsItemDelete(linkTree.id, itemId);
    }
  }

  $: items = linkTree?.items || [];

  function getTypeBadge(type) {
    if (type === "public") {
      return {
        label: "Publik",
        class: "px-3 py-1 rounded-full text-xs font-semibold border bg-emerald-50 text-emerald-700 border-emerald-200/60",
      };
    }
    if (type === "unlisted") {
      return {
        label: "Unlisted",
        class: "px-3 py-1 rounded-full text-xs font-semibold border bg-sky-50 text-sky-700 border-sky-200/60",
      };
    }
    return {
      label: "Pribadi",
      class: "px-3 py-1 rounded-full text-xs font-semibold border bg-slate-100 text-slate-700 border-slate-200",
    };
  }

  $: badge = getTypeBadge(linkTree?.type);

  function getAuthorInitial(author) {
    if (author && author.name) {
      return author.name.charAt(0).toUpperCase();
    }
    return "A";
  }
</script>

{#if !profile || !linkTree}
  <div class="flex flex-col items-center justify-center py-20">
    <div class="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
    <h1 class="text-sm font-medium text-slate-600 mt-3">Memuat detail link tree...</h1>
  </div>
{:else}
  <div class="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-300">
    <!-- Back button & Action buttons -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <a
        href="/"
        data-testid="back-to-linktrees-link"
        on:click|preventDefault={() => navigate("/")}
        class="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
      >
        <ArrowLeft size={18} />
        Kembali ke Link Tree
      </a>

      <div class="flex items-center gap-2">
        <button
          type="button"
          data-testid="edit-cover-btn"
          on:click={() => (showCoverModal = true)}
          class="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200/60 transition-colors"
        >
          <ImagePlus size={16} />
          Ubah Cover
        </button>
        <button
          type="button"
          data-testid="edit-detail-linktree-btn"
          on:click={() => (showEditModal = true)}
          class="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200/60 transition-colors"
        >
          <PenLine size={16} />
          Ubah Data
        </button>
        <button
          type="button"
          data-testid="delete-detail-linktree-btn"
          on:click={handleDelete}
          class="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl text-red-700 bg-red-50 hover:bg-red-100 border border-red-200/60 transition-colors"
        >
          <Trash2 size={16} />
          Hapus
        </button>
      </div>
    </div>

    <!-- Main Detail Card -->
    <div class="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
      {#if linkTree.cover}
        <div class="relative w-full h-64 sm:h-80 bg-slate-900 overflow-hidden">
          <img
            src={linkTree.cover}
            alt={linkTree.title}
            width="896"
            height="320"
            fetchpriority="high"
            decoding="async"
            class="w-full h-full object-cover"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent"></div>
        </div>
      {:else}
        <div class="w-full h-32 bg-gradient-to-r from-indigo-700 via-indigo-600 to-cyan-600 flex items-center justify-center text-white/30">
          <Link size={48} />
        </div>
      {/if}

      <div class="p-6 sm:p-8 space-y-6">
        <!-- Title and Badges -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div class="space-y-1">
            <div class="flex items-center gap-2.5 flex-wrap">
              <span class={badge.class}>
                {badge.label}
              </span>
              <span class="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                <span>{items.length}</span> Tautan
              </span>
            </div>
            <h1 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight pt-1">
              {linkTree.title}
            </h1>
          </div>
        </div>

        <!-- Description -->
        {#if linkTree.description}
          <div class="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-sm text-slate-700 leading-relaxed">
            {linkTree.description}
          </div>
        {/if}

        <!-- Author & Timestamps -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 text-xs text-slate-600">
          <div class="flex items-center gap-2.5">
            {#if linkTree.author?.photo}
              <img
                src={linkTree.author.photo}
                alt={linkTree.author.name}
                width="28"
                height="28"
                loading="lazy"
                decoding="async"
                class="w-7 h-7 rounded-full object-cover border border-slate-200"
              />
            {:else}
              <div class="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center">
                {getAuthorInitial(linkTree.author)}
              </div>
            {/if}
            <div>
              <p class="font-semibold text-slate-800">{linkTree.author?.name || "Pembuat"}</p>
              <p class="text-[11px] text-slate-600">Pemilik Link Tree</p>
            </div>
          </div>

          <div class="flex flex-col gap-1 sm:text-right">
            <span>Dibuat: {formatDate(linkTree.created_at)}</span>
            <span>Diperbarui: {formatDate(linkTree.updated_at)}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Items Section -->
    <div class="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-8 space-y-6">
      <div class="flex items-center justify-between gap-4">
        <div>
          <h2 class="text-xl font-bold text-slate-900 tracking-tight">
            Daftar Tautan
          </h2>
          <p class="text-xs text-slate-600 mt-0.5">
            Kelola tautan yang akan dibagikan kepada pengunjung
          </p>
        </div>

        <button
          type="button"
          data-testid="add-item-btn"
          on:click={handleAddItem}
          class="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 shadow-md shadow-indigo-600/20 transition-all"
        >
          <Plus size={16} strokeWidth={2.5} />
          <span>Tambah Tautan</span>
        </button>
      </div>

      {#if items.length === 0}
        <div class="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
          <div class="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-2">
            <Link size={24} />
          </div>
          <p class="text-sm font-semibold text-slate-700">Belum ada tautan</p>
          <p class="text-xs text-slate-600 mt-1">
            Klik tombol "Tambah Tautan" untuk menambahkan tautan pertama.
          </p>
        </div>
      {:else}
        <div class="space-y-3">
          {#each items as item (item.id)}
            <div
              data-testid={`item-row-${item.id}`}
              class="flex items-center justify-between p-4 rounded-2xl border border-slate-200/80 hover:border-indigo-300 hover:shadow-xs bg-white transition-all gap-4"
            >
              <div class="flex items-center gap-3 min-w-0">
                <div class="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <Link size={18} />
                </div>
                <div class="min-w-0">
                  <h3 class="text-sm font-bold text-slate-900 truncate">
                    {item.title}
                  </h3>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-xs text-indigo-600 hover:text-indigo-800 hover:underline inline-flex items-center gap-1 truncate max-w-full"
                  >
                    <span>{item.url}</span>
                    <ExternalLink size={12} class="shrink-0" />
                  </a>
                </div>
              </div>

              <div class="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  data-testid={`edit-item-btn-${item.id}`}
                  on:click={() => handleEditItem(item)}
                  class="p-2 rounded-xl text-slate-600 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                  title="Ubah Tautan"
                  aria-label="Ubah Tautan"
                >
                  <Pencil size={16} />
                </button>
                <button
                  type="button"
                  data-testid={`delete-item-btn-${item.id}`}
                  on:click={() => handleDeleteItem(item.id)}
                  class="p-2 rounded-xl text-slate-600 hover:text-red-600 hover:bg-red-50 transition-colors"
                  title="Hapus Tautan"
                  aria-label="Hapus Tautan"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          {/each}
        </div>
      {/if}
    </div>
  </div>

  <ChangeCoverModal
    show={showCoverModal}
    linkTree={linkTree}
    onClose={() => (showCoverModal = false)}
  />

  <ChangeModal
    show={showEditModal}
    linkTreeId={linkTree.id}
    initialData={linkTree}
    onClose={() => (showEditModal = false)}
  />

  <ItemModal
    show={showItemModal}
    linkTreeId={linkTree.id}
    item={selectedItem}
    onClose={() => (showItemModal = false)}
  />
{/if}
