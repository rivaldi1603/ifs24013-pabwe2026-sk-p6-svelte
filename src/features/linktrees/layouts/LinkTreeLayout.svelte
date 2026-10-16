<script>
  import { onMount } from "svelte";
  import NavbarComponent from "../components/NavbarComponent.svelte";
  import SidebarComponent from "../components/SidebarComponent.svelte";
  import { usersStore } from "../../users/states/usersStore";
  import { authStore } from "../../auth/states/authStore";
  import apiHelper from "../../../helpers/apiHelper";
  import { navigate } from "../../../router.js";

  let isSidebarOpen = false;

  $: profile = $usersStore.profile;

  // 1. Jalankan sekali untuk mengecek apakah pengguna sudah login
  onMount(() => {
    const authToken = apiHelper.getAccessToken();
    if (authToken) {
      usersStore.asyncSetProfile();
    } else {
      navigate("/auth/login");
    }
  });

  // 2. Jika proses pengambilan profil selesai dan tidak ada profile, arahkan ke login
  $: if ($usersStore.isProfile) {
    usersStore.setIsProfile(false);
    if (!profile) {
      apiHelper.putAccessToken("");
      navigate("/auth/login");
    }
  }

  // 3. Efek setelah logout
  $: if ($authStore.isAuthLogout) {
    authStore.setIsAuthLogout(false);
    navigate("/auth/login");
  }

  function handleLogout() {
    authStore.asyncSetIsAuthLogout();
  }

  function handleCloseSidebar() {
    isSidebarOpen = false;
  }
</script>

<a
  href="#main-content"
  class="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-indigo-600 focus:text-white focus:rounded-lg focus:shadow-lg focus:outline-none"
>
  Lewati ke konten utama
</a>

{#if !profile}
  <main id="main-content" class="min-h-screen flex items-center justify-center bg-slate-50" aria-busy="true">
    <div class="flex flex-col items-center gap-3">
      <div class="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      <h1 class="text-sm font-medium text-slate-700">Memuat sesi pengguna...</h1>
    </div>
  </main>
{:else}
  <div class="min-h-screen bg-slate-50 text-slate-800">
    <NavbarComponent
      {profile}
      {isSidebarOpen}
      onLogout={handleLogout}
      onToggleSidebar={() => (isSidebarOpen = !isSidebarOpen)}
      on:logout={handleLogout}
      on:toggle-sidebar={() => (isSidebarOpen = !isSidebarOpen)}
    />

    <SidebarComponent
      {isSidebarOpen}
      onCloseMobile={handleCloseSidebar}
      on:close-mobile={handleCloseSidebar}
    />

    <main id="main-content" class="pt-16 md:pl-64 transition-all">
      <div class="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <slot />
      </div>
    </main>
  </div>
{/if}
