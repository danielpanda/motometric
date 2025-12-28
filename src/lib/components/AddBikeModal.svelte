<script lang="ts">
  import { BIKE_PRESETS, type BikeType } from '$lib/presets';
  
  interface Props {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (name: string, type: BikeType, odometer: number, dailyUsage: number, freshService: boolean) => void;
  }
  
  let { isOpen, onClose, onConfirm }: Props = $props();
  
  let step = $state(1);
  let bikeName = $state('');
  let bikeType = $state<BikeType>('matic_honda');
  let currentOdometer = $state(0);
  let dailyUsage = $state(50);
  let freshService = $state(true);
  
  const bikeTypeOptions = Object.entries(BIKE_PRESETS).map(([key, value]) => ({
    value: key as BikeType,
    label: value.label
  }));
  
  function resetForm() {
    step = 1;
    bikeName = '';
    bikeType = 'matic_honda';
    currentOdometer = 0;
    dailyUsage = 50;
    freshService = true;
  }
  
  function nextStep() {
    if (step < 3) step++;
  }
  
  function prevStep() {
    if (step > 1) step--;
  }
  
  function handleConfirm() {
    onConfirm(bikeName, bikeType, currentOdometer, dailyUsage, freshService);
    resetForm();
  }
  
  function handleOverlayClick(e: MouseEvent) {
    if (e.target === e.currentTarget) {
      onClose();
      resetForm();
    }
  }
  
  $effect(() => {
    if (isOpen) {
      resetForm();
    }
  });
</script>

{#if isOpen}
  <div class="modal-overlay" onclick={handleOverlayClick} role="dialog" aria-modal="true">
    <div class="modal-content max-w-lg">
      <!-- Progress indicator -->
      <div class="flex items-center justify-center gap-2 mb-6">
        {#each [1, 2, 3] as s}
          <div class="flex items-center">
            <div class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all
              {step >= s ? 'bg-orange-500 text-white' : 'bg-dark-800 text-dark-500'}">
              {s}
            </div>
            {#if s < 3}
              <div class="w-8 h-0.5 {step > s ? 'bg-orange-500' : 'bg-dark-700'}"></div>
            {/if}
          </div>
        {/each}
      </div>
      
      <!-- Step 1: Basic Info -->
      {#if step === 1}
        <div class="animate-fade-in">
          <h2 class="text-xl font-bold text-dark-100 mb-2">Tambah Motor Baru</h2>
          <p class="text-dark-500 mb-6">Masukkan informasi dasar motor kamu</p>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-dark-400 mb-2">
                Nama Motor
              </label>
              <input 
                type="text" 
                bind:value={bikeName}
                class="input"
                placeholder="Contoh: Vario Merah 2015"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-dark-400 mb-2">
                Tipe Motor
              </label>
              <select bind:value={bikeType} class="select">
                {#each bikeTypeOptions as option}
                  <option value={option.value}>{option.label}</option>
                {/each}
              </select>
              <p class="text-xs text-dark-500 mt-2">
                ✨ Komponen servis akan otomatis dimuat berdasarkan tipe
              </p>
            </div>
          </div>
        </div>
      {/if}
      
      <!-- Step 2: Odometer & Usage -->
      {#if step === 2}
        <div class="animate-fade-in">
          <h2 class="text-xl font-bold text-dark-100 mb-2">KM & Pemakaian</h2>
          <p class="text-dark-500 mb-6">Seberapa sering motor kamu dipakai?</p>
          
          <div class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-dark-400 mb-2">
                Odometer Saat Ini (KM)
              </label>
              <input 
                type="number" 
                bind:value={currentOdometer}
                class="input input-lg"
                min="0"
                step="100"
                placeholder="0"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-dark-400 mb-2">
                Estimasi Pemakaian Harian: <span class="text-orange-400 font-bold">{dailyUsage} km/hari</span>
              </label>
              <input 
                type="range" 
                bind:value={dailyUsage}
                class="slider w-full"
                min="5"
                max="150"
                step="5"
              />
              <div class="flex justify-between text-xs text-dark-500 mt-1">
                <span>5 km</span>
                <span>150 km</span>
              </div>
              <p class="text-xs text-dark-500 mt-3">
                💡 Ini akan digunakan untuk memperkirakan waktu servis berdasarkan kebiasaan berkendara kamu
              </p>
            </div>
          </div>
        </div>
      {/if}
      
      <!-- Step 3: Service Status -->
      {#if step === 3}
        <div class="animate-fade-in">
          <h2 class="text-xl font-bold text-dark-100 mb-2">Status Servis</h2>
          <p class="text-dark-500 mb-6">Apakah baru saja servis total/besar?</p>
          
          <div class="space-y-3">
            <button 
              onclick={() => freshService = true}
              class="w-full p-4 rounded-xl border-2 text-left transition-all
                {freshService ? 'border-orange-500 bg-orange-500/10' : 'border-dark-700 hover:border-dark-600'}"
            >
              <div class="flex items-center gap-3">
                <div class="w-5 h-5 rounded-full border-2 flex items-center justify-center
                  {freshService ? 'border-orange-500' : 'border-dark-600'}">
                  {#if freshService}
                    <div class="w-2.5 h-2.5 rounded-full bg-orange-500"></div>
                  {/if}
                </div>
                <div>
                  <p class="font-semibold text-dark-100">Ya, baru servis total</p>
                  <p class="text-sm text-dark-500">Semua komponen dimulai dari 0%</p>
                </div>
              </div>
            </button>
            
            <button 
              onclick={() => freshService = false}
              class="w-full p-4 rounded-xl border-2 text-left transition-all
                {!freshService ? 'border-orange-500 bg-orange-500/10' : 'border-dark-700 hover:border-dark-600'}"
            >
              <div class="flex items-center gap-3">
                <div class="w-5 h-5 rounded-full border-2 flex items-center justify-center
                  {!freshService ? 'border-orange-500' : 'border-dark-600'}">
                  {#if !freshService}
                    <div class="w-2.5 h-2.5 rounded-full bg-orange-500"></div>
                  {/if}
                </div>
                <div>
                  <p class="font-semibold text-dark-100">Tidak / Tidak yakin</p>
                  <p class="text-sm text-dark-500">Komponen dimulai dari estimasi ~30%</p>
                </div>
              </div>
            </button>
          </div>
          
          <!-- Summary -->
          <div class="mt-6 p-4 bg-dark-800/50 rounded-xl">
            <h3 class="font-semibold text-dark-200 mb-3">Ringkasan</h3>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-dark-500">Nama:</span>
                <span class="text-dark-200">{bikeName || '(belum diisi)'}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-dark-500">Tipe:</span>
                <span class="text-dark-200">{BIKE_PRESETS[bikeType]?.label}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-dark-500">Odometer:</span>
                <span class="text-dark-200">{currentOdometer.toLocaleString('id-ID')} km</span>
              </div>
              <div class="flex justify-between">
                <span class="text-dark-500">Pemakaian:</span>
                <span class="text-dark-200">{dailyUsage} km/hari</span>
              </div>
              <div class="flex justify-between">
                <span class="text-dark-500">Komponen:</span>
                <span class="text-dark-200">{BIKE_PRESETS[bikeType]?.parts.length} item</span>
              </div>
            </div>
          </div>
        </div>
      {/if}
      
      <!-- Navigation buttons -->
      <div class="flex gap-3 mt-6">
        {#if step > 1}
          <button 
            onclick={prevStep}
            class="btn btn-secondary flex-1"
          >
            Kembali
          </button>
        {:else}
          <button 
            onclick={() => { onClose(); resetForm(); }}
            class="btn btn-secondary flex-1"
          >
            Batal
          </button>
        {/if}
        
        {#if step < 3}
          <button 
            onclick={nextStep}
            class="btn btn-primary flex-1"
            disabled={step === 1 && !bikeName.trim()}
          >
            Lanjut
          </button>
        {:else}
          <button 
            onclick={handleConfirm}
            class="btn btn-primary flex-1"
          >
            <svg class="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Tambah Motor
          </button>
        {/if}
      </div>
    </div>
  </div>
{/if}

<style>
  @keyframes fadeIn {
    from { opacity: 0; transform: translateX(10px); }
    to { opacity: 1; transform: translateX(0); }
  }
  
  .animate-fade-in {
    animation: fadeIn 0.3s ease-out;
  }
</style>
