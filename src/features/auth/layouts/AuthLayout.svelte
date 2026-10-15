<script>
  import { onMount } from "svelte";
  import { Link } from "lucide-svelte";
  import { usersStore } from "../../users/states/usersStore";
  import apiHelper from "../../../helpers/apiHelper";
  import { currentPath, navigate } from "../../../router.js";

  $: isLoginActive = $currentPath === "/auth/login";

  onMount(() => {
    const authToken = apiHelper.getAccessToken();
    if (authToken) {
      usersStore.asyncSetProfile();
    }
  });

  $: if ($usersStore.isProfile) {
    usersStore.setIsProfile(false);
    if ($usersStore.profile) {
      navigate("/");
    }
  }
</script>

<a
  href="#main-content"
  class="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-indigo-600 focus:text-white focus:rounded-lg focus:shadow-lg focus:outline-none"
>
  Lewati ke konten utama
</a>

<main
  id="main-content"
  class="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/40 to-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8"
>
  <div class="sm:mx-auto sm:w-full sm:max-w-md text-center">
    <div
      class="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-500 items-center justify-center text-white shadow-xl shadow-indigo-500/25 mb-3"
    >
      <Link size={32} strokeWidth={2.5} />
    </div>
    <h1 class="text-3xl font-extrabold text-slate-900 tracking-tight">
      Delcom Link Tree
    </h1>
    <p class="mt-1 text-sm text-slate-600">
      Aplikasi Pengelola Kumpulan Tautan & Autentikasi Modern (Svelte)
    </p>
  </div>

  <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
    <div
      class="bg-white py-8 px-6 sm:px-10 shadow-xl shadow-slate-200/50 rounded-3xl border border-slate-100"
    >
      <!-- Tabs -->
      <nav aria-label="Navigasi Autentikasi" class="flex rounded-2xl bg-slate-100 p-1 mb-6">
        <button
          type="button"
          on:click={() => navigate("/auth/login")}
          aria-current={isLoginActive ? "page" : undefined}
          class="flex-1 py-2 text-center text-sm font-semibold rounded-xl transition-all {isLoginActive
            ? 'bg-white text-indigo-700 shadow-xs'
            : 'text-slate-700 hover:text-slate-900'}"
        >
          Masuk Akun
        </button>
        <button
          type="button"
          on:click={() => navigate("/auth/register")}
          aria-current={!isLoginActive ? "page" : undefined}
          class="flex-1 py-2 text-center text-sm font-semibold rounded-xl transition-all {!isLoginActive
            ? 'bg-white text-indigo-700 shadow-xs'
            : 'text-slate-700 hover:text-slate-900'}"
        >
          Daftar Baru
        </button>
      </nav>

      <slot />
    </div>
  </div>
</main>
