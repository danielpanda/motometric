<script lang="ts">
  import { formatNumber } from '$lib/utils';
  
  interface Props {
    isOpen: boolean;
    currentOdometer: number;
    onClose: () => void;
    onConfirm: (newOdometer: number) => void;
  }
  
  let { isOpen, currentOdometer, onClose, onConfirm }: Props = $props();
  
  let newOdometer = $state(currentOdometer);
  
  $effect(() => {
    if (isOpen) {
      newOdometer = currentOdometer;
    }
  });
  
  function handleConfirm() {
    if (newOdometer >= 0) {
      onConfirm(newOdometer);
    }
  }
  
  function handleOverlayClick(e: MouseEvent) {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }
  
  function quickAdd(amount: number) {
    newOdometer += amount;
  }
</script>

{#if isOpen}
  <div class="modal-overlay" onclick={handleOverlayClick} role="dialog" aria-modal="true">
    <div class="modal-content">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-bold text-dark-100">Update Odometer</h2>
        <button 
          onclick={onClose}
          class="btn btn-ghost btn-icon"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div class="space-y-4">
        <!-- Current value -->
        <p class="text-center text-dark-500">
          Saat ini: <span class="text-dark-300">{formatNumber(currentOdometer)} km</span>
        </p>
        
        <!-- Input -->
        <div>
          <input 
            type="number" 
            bind:value={newOdometer}
            class="input input-lg"
            min="0"
            step="1"
          />
          <p class="text-center text-xs text-dark-500 mt-2">
            Masukkan nilai KM terbaru dari speedometer
          </p>
        </div>
        
        <!-- Quick add buttons -->
        <div>
          <p class="text-sm text-dark-500 mb-2 text-center">Tambah cepat:</p>
          <div class="grid grid-cols-4 gap-2">
            {#each [10, 25, 50, 100] as amount}
              <button 
                onclick={() => quickAdd(amount)}
                class="btn btn-secondary text-sm py-2"
              >
                +{amount}
              </button>
            {/each}
          </div>
        </div>
        
        <!-- Difference indicator -->
        {#if newOdometer !== currentOdometer}
          <div class="p-3 bg-dark-800/50 rounded-lg text-center">
            <span class="text-dark-500">Perubahan: </span>
            <span class="{newOdometer > currentOdometer ? 'text-emerald-400' : 'text-amber-400'} font-semibold">
              {newOdometer > currentOdometer ? '+' : ''}{formatNumber(newOdometer - currentOdometer)} km
            </span>
          </div>
        {/if}
      </div>
      
      <div class="flex gap-3 mt-6">
        <button 
          onclick={onClose}
          class="btn btn-secondary flex-1"
        >
          Batal
        </button>
        <button 
          onclick={handleConfirm}
          class="btn btn-primary flex-1"
          disabled={newOdometer < 0}
        >
          <svg class="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          Simpan
        </button>
      </div>
    </div>
  </div>
{/if}
