<script>
  import { onMount } from "svelte";
  import { navigate } from "../../../router.js";
  import AddModal from "../modals/AddModal.svelte";
  import { linkTreesStore } from "../states/linkTreesStore";
  import { usersStore } from "../../users/states/usersStore";
  import { formatDate, showConfirmDialog } from "../../../helpers/toolsHelper";
  import {
    Plus,
    Link,
    ExternalLink,
    Search,
    Trash2,
    Eye,
    Globe,
    Lock,
    EyeOff,
    Sparkles,
    RotateCcw,
    AlertTriangle,
  } from "lucide-svelte";

  let loading = false;
  let filter = "";
  let searchQuery = "";
  let showAddModal = false;

  $: profile = $usersStore.profile;
  $: linkTrees = $linkTreesStore.linkTrees || [];

  onMount(() => {
    loadData();
  });

  function loadData() {
    loading = true;
    Promise.resolve(linkTreesStore.asyncSetLinkTrees(filter)).finally(() => {
      loading = false;
    });
  }

  let prevFilter = filter;
  $: if (filter !== prevFilter) {
    prevFilter = filter;
    loadData();
  }

  $: if ($linkTreesStore.isLinkTreeDeleted) {
    linkTreesStore.setIsLinkTreeDeleted(false);
    loadData();
  }

  $: if ($linkTreesStore.isLinkTreeDeletedAll) {
    linkTreesStore.setIsLinkTreeDeletedAll(false);
    loadData();
  }

  async function handleDeleteOne(id) {
    const result = await showConfirmDialog(
      "Apakah Anda yakin ingin menghapus Link Tree ini?"
    );
    if (result.isConfirmed) {
      linkTreesStore.asyncSetIsLinkTreeDelete(id);
    }
  }

  async function handleDeleteAll() {
    const result = await showConfirmDialog(
      "Apakah Anda yakin ingin menghapus SEMUA Link Tree milik Anda? Tindakan ini bersifat permanen dan tidak dapat dibatalkan."
    );
    if (result.isConfirmed) {
      linkTreesStore.asyncSetIsLinkTreeDeleteAll();
    }
  }

  $: filteredLinkTrees = linkTrees.filter((item) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const title = item.title ? item.title.toLowerCase() : "";
    const description = item.description ? item.description.toLowerCase() : "";
    return title.includes(q) || description.includes(q);
  });

  $: totalLinkTrees = linkTrees.length;
  $: totalLinksCount = linkTrees.reduce(
    (sum, item) => sum + (Number(item.total_links) || 0),
    0
  );
  $: publicCount = linkTrees.filter((item) => item.type === "public").length;

  function getTypeBadge(type) {
    if (type === "public") {
      return {
        label: "Publik",
        class: "absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold border backdrop-blur-md shadow-xs bg-emerald-50 text-emerald-700 border-emerald-200/60",
      };
    }
    if (type === "unlisted") {
      return {
        label: "Unlisted",
        class: "absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold border backdrop-blur-md shadow-xs bg-sky-50 text-sky-700 border-sky-200/60",
      };
    }
    return {
      label: "Pribadi",
      class: "absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold border backdrop-blur-md shadow-xs bg-slate-100 text-slate-700 border-slate-200",
    };
  }
</script>

{#if profile}
  <div class="space-y-8 animate-in fade-in duration-300">
    <!-- Header Banner -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Delcom Link Tree
        </h1>
        <p class="text-sm text-slate-500 mt-1">
          Kumpulkan, kelola, dan bagikan seluruh tautan penting Anda dalam satu tempat.
        </p>
      </div>

      <div class="flex items-center gap-2.5 self-start sm:self-auto">
        <button
          type="button"
          data-testid="delete-all-linktree-btn"
          on:click={handleDeleteAll}
          class="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl font-semibold text-sm text-red-700 bg-red-50 hover:bg-red-100 border border-red-200/80 active:bg-red-200 transition-all"
        >
          <Trash2 size={16} />
          <span>Hapus Semua</span>
        </button>

        <button
          type="button"
          data-testid="add-linktree-btn"
          on:click={() => (showAddModal = true)}
          class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 shadow-md shadow-indigo-600/25 transition-all"
        >
          <Plus size={18} strokeWidth={2.5} />
          <span>Tambah Link Tree</span>
        </button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div>
          <p class="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Total Link Tree
          </p>
          <h3 class="text-3xl font-black text-slate-800 mt-1">
            {totalLinkTrees}
          </h3>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
          <Link size={24} strokeWidth={2.2} />
        </div>
      </div>

      <div class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div>
          <p class="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Total Tautan
          </p>
          <h3 class="text-3xl font-black text-sky-600 mt-1">
            {totalLinksCount}
          </h3>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center">
          <ExternalLink size={24} strokeWidth={2.2} />
        </div>
      </div>

      <div class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div>
          <p class="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Link Tree Publik
          </p>
          <h3 class="text-3xl font-black text-emerald-600 mt-1">
            {publicCount}
          </h3>
        </div>
        <div class="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
          <Globe size={24} strokeWidth={2.2} />
        </div>
      </div>
    </div>

    <!-- Search & Filter Controls -->
    <div class="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <!-- Search input -->
      <div class="relative flex-1 max-w-md">
        <Search
          size={18}
          class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          type="text"
          data-testid="search-input"
          bind:value={searchQuery}
          placeholder="Cari Link Tree berdasarkan judul atau deskripsi..."
          class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 transition-all placeholder:text-slate-400"
        />
      </div>

      <!-- Filter tabs -->
      <div class="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl self-start md:self-auto">
        <button
          type="button"
          data-testid="filter-all-btn"
          on:click={() => (filter = "")}
          class="px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all {filter === ''
            ? 'bg-white text-indigo-700 shadow-xs'
            : 'text-slate-600 hover:text-slate-900'}"
        >
          Semua Link Tree
        </button>
        <button
          type="button"
          data-testid="filter-me-btn"
          on:click={() => (filter = "1")}
          class="px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all {filter === '1'
            ? 'bg-white text-indigo-700 shadow-xs'
            : 'text-slate-600 hover:text-slate-900'}"
        >
          Milik Saya
        </button>
      </div>
    </div>

    <!-- Content Grid -->
    {#if loading && filteredLinkTrees.length === 0}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each Array(6) as _, i (i)}
          <div class="bg-white rounded-3xl border border-slate-200/70 p-5 shadow-xs animate-pulse space-y-4">
            <div class="w-full h-36 bg-slate-100 rounded-2xl"></div>
            <div class="h-5 bg-slate-100 rounded-md w-3/4"></div>
            <div class="h-4 bg-slate-100 rounded-md w-full"></div>
            <div class="h-4 bg-slate-100 rounded-md w-2/3"></div>
            <div class="pt-2 flex justify-between items-center">
              <div class="h-4 bg-slate-100 rounded-md w-1/3"></div>
              <div class="h-8 bg-slate-100 rounded-xl w-24"></div>
            </div>
          </div>
        {/each}
      </div>
    {:else if filteredLinkTrees.length === 0}
      <div class="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-12 text-center max-w-lg mx-auto">
        <div class="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4">
          <Link size={32} />
        </div>
        <h3 class="text-lg font-bold text-slate-800">Tidak Ada Link Tree</h3>
        <p class="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
          {searchQuery
            ? "Tidak ada link tree yang cocok dengan kata kunci pencarian Anda."
            : "Belum ada link tree yang dibuat. Mulai buat kumpulan tautan Anda sekarang!"}
        </p>
        <div class="mt-6 flex items-center justify-center gap-3">
          {#if searchQuery}
            <button
              type="button"
              on:click={() => (searchQuery = "")}
              class="px-4 py-2 rounded-xl text-sm font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors"
            >
              Reset Pencarian
            </button>
          {:else}
            <button
              type="button"
              data-testid="create-first-linktree-btn"
              on:click={() => (showAddModal = true)}
              class="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
            >
              Buat Link Tree Pertama
            </button>
          {/if}
          <button
            type="button"
            data-testid="reload-empty-btn"
            on:click={loadData}
            class="px-3.5 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors inline-flex items-center gap-1.5"
          >
            <RotateCcw size={16} />
            <span>Muat Ulang</span>
          </button>
        </div>
      </div>
    {:else}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each filteredLinkTrees as item (item.id)}
          <div
            data-testid={`linktree-card-${item.id}`}
            class="bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col overflow-hidden group"
          >
            <!-- Card Cover or Fallback Banner -->
            <div class="relative w-full h-40 bg-gradient-to-tr from-indigo-900 via-indigo-950 to-slate-900 overflow-hidden">
              {#if item.cover}
                <img
                  src={item.cover}
                  alt={item.title}
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              {:else}
                <div class="absolute inset-0 flex items-center justify-center opacity-30 text-white">
                  <Link size={48} strokeWidth={1.5} />
                </div>
              {/if}

              <!-- Type Badge -->
              <span class={getTypeBadge(item.type).class}>
                {getTypeBadge(item.type).label}
              </span>

              <!-- Total Links Badge -->
              <span
                class="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-semibold bg-black/50 text-white backdrop-blur-md border border-white/20"
              >
                <span>{item.total_links || 0}</span> Tautan
              </span>
            </div>

            <!-- Card Body -->
            <div class="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <h3
                  class="text-base font-bold text-slate-900 line-clamp-1 group-hover:text-indigo-600 transition-colors"
                >
                  {item.title}
                </h3>
                <p class="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                  {item.description || "Tidak ada deskripsi."}
                </p>
              </div>

              <!-- Author & Date -->
              <div class="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <div class="flex items-center gap-2">
                  {#if item.author?.photo}
                    <img
                      src={item.author.photo}
                      alt={item.author.name}
                      class="w-6 h-6 rounded-full object-cover border border-slate-200"
                    />
                  {:else}
                    <div class="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-bold text-[10px] flex items-center justify-center">
                      {item.author?.name ? item.author.name.charAt(0).toUpperCase() : "A"}
                    </div>
                  {/if}
                  <span class="font-medium truncate max-w-[110px]">
                    {item.author?.name || "Pembuat"}
                  </span>
                </div>
                <span>{formatDate(item.created_at)}</span>
              </div>

              <!-- Card Actions -->
              <div class="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  data-testid={`view-detail-btn-${item.id}`}
                  on:click={() => navigate(`/link-trees/${item.id}`)}
                  class="flex-1 inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 transition-colors"
                >
                  <Eye size={15} />
                  <span>Lihat Detail</span>
                </button>

                <button
                  type="button"
                  data-testid={`delete-linktree-btn-${item.id}`}
                  on:click={() => handleDeleteOne(item.id)}
                  class="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                  title="Hapus Link Tree"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>

  <AddModal
    show={showAddModal}
    onClose={() => (showAddModal = false)}
  />
{/if}
