<script lang="ts">
  import { formatNumber, formatDate, getTodayISO } from '$lib/utils';
  import type { BikeComponent } from '$lib/types';
  
  interface Props {
    component: BikeComponent;
    currentOdometer: number;
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (date: string, km: number, notes?: string, cost?: number) => void;
  }
  
  let { component, currentOdometer, isOpen, onClose, onConfirm }: Props = $props();
  
  let serviceDate = $state(getTodayISO());
  let serviceKm = $state(currentOdometer);
  let notes = $state('');
  let cost = $state<number | undefined>(undefined);
  
  $effect(() => {
    if (isOpen) {
      serviceDate = getTodayISO();
      serviceKm = currentOdometer;
      notes = '';
      cost = undefined;
    }
  });
  
  function handleConfirm() {
    onConfirm(serviceDate, serviceKm, notes || undefined, cost);
  }
  
  function handleOverlayClick(e: MouseEvent) {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }
</script>

{#if isOpen}
  <div class="modal-overlay" onclick={handleOverlayClick} role="dialog" aria-modal="true">
    <div class="modal-content">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-bold text-dark-100">
          Servis {component.name}
        </h2>
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
        <!-- Date -->
        <div>
          <label class="block text-sm font-medium text-dark-400 mb-2">
            Kapan servis dilakukan?
          </label>
          <input 
            type="date" 
            bind:value={serviceDate}
            class="input"
            max={getTodayISO()}
          />
        </div>
        
        <!-- KM -->
        <div>
          <label class="block text-sm font-medium text-dark-400 mb-2">
            Di KM berapa?
          </label>
          <input 
            type="number" 
            bind:value={serviceKm}
            class="input"
            min="0"
            step="1"
          />
          <p class="text-xs text-dark-500 mt-1">
            KM saat ini: {formatNumber(currentOdometer)}
          </p>
        </div>
        
        <!-- Notes -->
        <div>
          <label class="block text-sm font-medium text-dark-400 mb-2">
            Catatan (opsional)
          </label>
          <input 
            type="text" 
            bind:value={notes}
            class="input"
            placeholder="Contoh: Oli Yamalube 1L"
          />
        </div>
        
        <!-- Cost -->
        <div>
          <label class="block text-sm font-medium text-dark-400 mb-2">
            Biaya (opsional)
          </label>
          <div class="relative">
            <span class="absolute left-4 top-1/2 -translate-y-1/2 text-dark-500">Rp</span>
            <input 
              type="number" 
              bind:value={cost}
              class="input pl-12"
              min="0"
              step="1000"
              placeholder="0"
            />
          </div>
        </div>
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
