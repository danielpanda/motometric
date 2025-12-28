<script lang="ts">
  import type { ComponentStatus } from '$lib/types';
  import { formatNumber, formatDate } from '$lib/utils';
  
  interface Props {
    status: ComponentStatus;
    onService: () => void;
    onViewHistory?: () => void;
  }
  
  let { status, onService, onViewHistory }: Props = $props();
  
  const statusColors = {
    safe: { bg: 'progress-safe', badge: 'badge-safe', text: 'text-emerald-400' },
    warning: { bg: 'progress-warning', badge: 'badge-warning', text: 'text-amber-400' },
    danger: { bg: 'progress-danger', badge: 'badge-danger', text: 'text-rose-400' }
  };
  
  let colors = $derived(statusColors[status.status]);
  let clampedPercent = $derived(Math.min(status.maxPercent, 100));
</script>

<div class="card p-4 hover:border-dark-600/50 transition-all duration-200 group">
  <div class="flex items-start justify-between gap-3 mb-3">
    <div class="flex-1 min-w-0">
      <h3 class="font-semibold text-dark-100 truncate">
        {status.component.name}
      </h3>
      <div class="flex items-center gap-2 mt-1">
        <span class="badge {colors.badge}">
          {status.status === 'danger' ? 'Servis!' : status.status === 'warning' ? 'Segera' : 'Aman'}
        </span>
        <span class="text-xs text-dark-500">
          {status.maxPercent}%
        </span>
      </div>
    </div>
    
    <button 
      onclick={onService}
      class="btn btn-ghost btn-icon opacity-0 group-hover:opacity-100 sm:opacity-100 transition-opacity"
      title="Servis sekarang"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    </button>
  </div>
  
  <!-- Dual Progress Bars -->
  <div class="space-y-2 mb-3">
    <!-- KM Progress -->
    <div>
      <div class="flex justify-between text-xs text-dark-500 mb-1">
        <span>KM</span>
        <span>{status.kmPercent}%</span>
      </div>
      <div class="progress-bar">
        <div 
          class="progress-fill {colors.bg}"
          style="width: {Math.min(status.kmPercent, 100)}%"
        ></div>
      </div>
    </div>
    
    <!-- Time Progress -->
    <div>
      <div class="flex justify-between text-xs text-dark-500 mb-1">
        <span>Waktu</span>
        <span>{status.timePercent}%</span>
      </div>
      <div class="progress-bar">
        <div 
          class="progress-fill opacity-60 {colors.bg}"
          style="width: {Math.min(status.timePercent, 100)}%"
        ></div>
      </div>
    </div>
  </div>
  
  <!-- Stats -->
  <div class="grid grid-cols-2 gap-3 text-sm">
    <div class="bg-dark-800/50 rounded-lg p-2 light-theme:bg-dark-100">
      <p class="text-dark-500 text-xs">Sisa KM</p>
      <p class="font-semibold {status.remainingKm <= 0 ? 'text-rose-400' : 'text-dark-200'}">
        {status.remainingKm <= 0 ? 'Sudah Lewat!' : formatNumber(status.remainingKm) + ' km'}
      </p>
    </div>
    <div class="bg-dark-800/50 rounded-lg p-2 light-theme:bg-dark-100">
      <p class="text-dark-500 text-xs">Estimasi</p>
      <p class="font-semibold {status.remainingDays <= 0 ? 'text-rose-400' : 'text-dark-200'}">
        {status.remainingDays <= 0 ? 'Sekarang!' : status.remainingDays + ' hari lagi'}
      </p>
    </div>
  </div>
  
  <!-- Last service info -->
  <div class="mt-3 pt-3 border-t border-dark-800 flex items-center justify-between text-xs text-dark-500">
    <span>Terakhir: {formatDate(status.component.lastServiceDate)} @ {formatNumber(status.component.lastServiceKm)} km</span>
    {#if status.component.history.length > 0 && onViewHistory}
      <button onclick={onViewHistory} class="text-orange-400 hover:text-orange-300">
        Riwayat ({status.component.history.length})
      </button>
    {/if}
  </div>
</div>

<style>
  .light-theme\:bg-dark-100 {
    /* This will be handled by parent theme class */
  }
</style>
