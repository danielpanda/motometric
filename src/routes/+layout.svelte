<script lang="ts">
  import '../app.css';
  import { onMount } from 'svelte';
  import { appStore, isDarkTheme } from '$lib/stores';
  
  onMount(() => {
    appStore.init();
  });
  
  // Apply theme class to body
  $effect(() => {
    if (typeof document !== 'undefined') {
      document.body.classList.toggle('light-theme', !$isDarkTheme);
    }
  });
</script>

<slot />
