<script lang="ts">
  import { appStore, garageCount, isDarkTheme } from '$lib/stores';
  import type { Bike } from '$lib/types';
  
  interface Props {
    bikes: Bike[];
    activeBikeId: string | null;
    onAddBike: () => void;
    onOpenSettings: () => void;
  }
  
  let { bikes, activeBikeId, onAddBike, onOpenSettings }: Props = $props();
  
  function handleBikeChange(e: Event) {
    const select = e.target as HTMLSelectElement;
    appStore.setActiveBike(select.value);
  }
</script>

<header class="sticky top-0 z-40 bg-dark-950/80 backdrop-blur-xl border-b border-dark-800/50 safe-area-top">
  <div class="max-w-2xl mx-auto px-4 py-3">
    <div class="flex items-center justify-between gap-3">
      <!-- Logo -->
      <div class="flex items-center gap-2">
        <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/30">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
              d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h1 class="font-display font-bold text-lg gradient-text hidden sm:block">MotoMetric</h1>
      </div>
      
      <!-- Bike Selector -->
      {#if bikes.length > 0}
        <div class="flex-1 max-w-xs">
          <select 
            value={activeBikeId || ''} 
            onchange={handleBikeChange}
            class="select text-sm py-2"
          >
            {#each bikes as bike}
              <option value={bike.id}>{bike.name}</option>
            {/each}
          </select>
        </div>
      {/if}
      
      <!-- Actions -->
      <div class="flex items-center gap-1">
        <button 
          onclick={onAddBike}
          class="btn btn-ghost btn-icon"
          title="Tambah Motor"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
        
        <button 
          onclick={onOpenSettings}
          class="btn btn-ghost btn-icon"
          title="Pengaturan"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</header>

<style>
  :global(.light-theme) header {
    @apply bg-white/80 border-dark-200/50;
  }
</style>
