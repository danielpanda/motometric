<script lang="ts">
  import type { Bike, ComponentStatus } from '$lib/types';
  import { formatNumber } from '$lib/utils';
  
  interface Props {
    bike: Bike;
    nextService: ComponentStatus | null;
    onOdometerEdit: () => void;
  }
  
  let { bike, nextService, onOdometerEdit }: Props = $props();
</script>

<div class="space-y-4">
  <!-- Odometer Card -->
  <div class="card p-6 text-center glow-orange">
    <p class="text-dark-500 text-sm mb-2">Odometer Saat Ini</p>
    <button 
      onclick={onOdometerEdit}
      class="group inline-flex items-center gap-2 hover:scale-105 transition-transform"
    >
      <span class="text-4xl sm:text-5xl font-display font-bold gradient-text">
        {formatNumber(bike.currentOdometer)}
      </span>
      <span class="text-xl text-dark-500">km</span>
      <svg class="w-5 h-5 text-dark-500 group-hover:text-orange-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
      </svg>
    </button>
    <p class="text-dark-500 text-xs mt-2">
      Terakhir update: {new Date(bike.lastUpdated).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
    </p>
  </div>
  
  <!-- Stats Grid -->
  <div class="grid grid-cols-2 gap-3">
    <!-- Daily Usage -->
    <div class="card p-4">
      <div class="flex items-center gap-2 mb-2">
        <div class="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
          <svg class="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        </div>
        <span class="text-xs text-dark-500 uppercase tracking-wide">Pemakaian</span>
      </div>
      <p class="text-xl font-bold text-dark-100">{bike.dailyUsageAvg} <span class="text-sm font-normal text-dark-500">km/hari</span></p>
    </div>
    
    <!-- Next Service -->
    <div class="card p-4">
      <div class="flex items-center gap-2 mb-2">
        <div class="w-8 h-8 rounded-lg 
          {nextService?.status === 'danger' ? 'bg-rose-500/20' : 
           nextService?.status === 'warning' ? 'bg-amber-500/20' : 'bg-emerald-500/20'} 
          flex items-center justify-center">
          <svg class="w-4 h-4 
            {nextService?.status === 'danger' ? 'text-rose-400' : 
             nextService?.status === 'warning' ? 'text-amber-400' : 'text-emerald-400'}" 
            fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <span class="text-xs text-dark-500 uppercase tracking-wide">Servis</span>
      </div>
      {#if nextService}
        <p class="text-sm font-semibold 
          {nextService.status === 'danger' ? 'text-rose-400' : 
           nextService.status === 'warning' ? 'text-amber-400' : 'text-dark-100'}">
          {nextService.remainingDays <= 0 ? 'Sekarang!' : nextService.remainingDays + ' hari lagi'}
        </p>
        <p class="text-xs text-dark-500 truncate">{nextService.component.name}</p>
      {:else}
        <p class="text-sm text-dark-500">Tidak ada data</p>
      {/if}
    </div>
  </div>
</div>
