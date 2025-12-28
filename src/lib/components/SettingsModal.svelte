<script lang="ts">
  import { appStore, isDarkTheme } from '$lib/stores';
  import { get } from 'svelte/store';
  
  interface Props {
    isOpen: boolean;
    onClose: () => void;
  }
  
  let { isOpen, onClose }: Props = $props();
  
  let showExportSuccess = $state(false);
  let importError = $state('');
  let fileInput: HTMLInputElement;
  
  function handleExport() {
    const data = appStore.exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `motometric_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showExportSuccess = true;
    setTimeout(() => showExportSuccess = false, 3000);
  }
  
  function handleImportClick() {
    fileInput?.click();
  }
  
  function handleFileImport(e: Event) {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = appStore.importData(content);
      if (success) {
        importError = '';
        onClose();
      } else {
        importError = 'File tidak valid. Pastikan file adalah backup MotoMetric yang benar.';
      }
    };
    reader.readAsText(file);
  }
  
  function handleReset() {
    if (confirm('Apakah kamu yakin ingin menghapus semua data? Tindakan ini tidak dapat dibatalkan.')) {
      appStore.resetAll();
      onClose();
    }
  }
  
  function handleOverlayClick(e: MouseEvent) {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }
</script>

{#if isOpen}
  <div class="modal-overlay" onclick={handleOverlayClick} role="dialog" aria-modal="true">
    <div class="modal-content max-w-lg max-h-[85vh] overflow-y-auto">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-bold text-dark-100">Pengaturan</h2>
        <button 
          onclick={onClose}
          class="btn btn-ghost btn-icon"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div class="space-y-6">
        <!-- Theme Toggle -->
        <div class="flex items-center justify-between p-4 bg-dark-800/50 rounded-xl">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-dark-700 flex items-center justify-center">
              {#if $isDarkTheme}
                <svg class="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                </svg>
              {:else}
                <svg class="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
                </svg>
              {/if}
            </div>
            <div>
              <p class="font-medium text-dark-100">Mode Gelap</p>
              <p class="text-sm text-dark-500">{$isDarkTheme ? 'Aktif' : 'Nonaktif'}</p>
            </div>
          </div>
          <button 
            onclick={() => appStore.toggleTheme()}
            class="relative w-12 h-7 rounded-full transition-colors
              {$isDarkTheme ? 'bg-orange-500' : 'bg-dark-600'}"
          >
            <div class="absolute top-1 left-1 w-5 h-5 rounded-full bg-white shadow transition-transform
              {$isDarkTheme ? 'translate-x-5' : 'translate-x-0'}">
            </div>
          </button>
        </div>
        
        <!-- Export/Import -->
        <div>
          <h3 class="text-sm font-semibold text-dark-400 uppercase tracking-wide mb-3">Data</h3>
          
          <div class="space-y-3">
            <button 
              onclick={handleExport}
              class="w-full flex items-center gap-3 p-4 bg-dark-800/50 rounded-xl hover:bg-dark-800 transition-colors"
            >
              <div class="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                <svg class="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </div>
              <div class="text-left">
                <p class="font-medium text-dark-100">Export Data</p>
                <p class="text-sm text-dark-500">Download backup JSON</p>
              </div>
            </button>
            
            {#if showExportSuccess}
              <div class="p-3 bg-emerald-500/20 text-emerald-400 rounded-lg text-sm text-center">
                ✓ Data berhasil diexport!
              </div>
            {/if}
            
            <button 
              onclick={handleImportClick}
              class="w-full flex items-center gap-3 p-4 bg-dark-800/50 rounded-xl hover:bg-dark-800 transition-colors"
            >
              <div class="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <svg class="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              </div>
              <div class="text-left">
                <p class="font-medium text-dark-100">Import Data</p>
                <p class="text-sm text-dark-500">Restore dari file backup</p>
              </div>
            </button>
            
            <input 
              type="file" 
              accept=".json"
              bind:this={fileInput}
              onchange={handleFileImport}
              class="hidden"
            />
            
            {#if importError}
              <div class="p-3 bg-rose-500/20 text-rose-400 rounded-lg text-sm">
                {importError}
              </div>
            {/if}
          </div>
        </div>
        
        <!-- Danger Zone -->
        <div>
          <h3 class="text-sm font-semibold text-dark-400 uppercase tracking-wide mb-3">Zona Bahaya</h3>
          
          <button 
            onclick={handleReset}
            class="w-full flex items-center gap-3 p-4 bg-rose-500/10 rounded-xl hover:bg-rose-500/20 transition-colors border border-rose-500/20"
          >
            <div class="w-10 h-10 rounded-lg bg-rose-500/20 flex items-center justify-center">
              <svg class="w-5 h-5 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <div class="text-left">
              <p class="font-medium text-rose-400">Hapus Semua Data</p>
              <p class="text-sm text-dark-500">Menghapus semua motor dan riwayat</p>
            </div>
          </button>
        </div>
        
        <!-- About -->
        <div class="pt-4 border-t border-dark-800">
          <div class="text-center text-sm text-dark-500">
            <p class="gradient-text font-semibold mb-1">MotoMetric v1.0.0</p>
            <p>Aplikasi pencatat servis motor dengan Dual Trigger System</p>
            <p class="mt-2">Made with ❤️ for Indonesian Riders</p>
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}
