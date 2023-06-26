<script lang="ts">
  import '@fontsource-variable/inter';
  import '../styles/main.css';
  import Navigation from '$lib/component/Navigation.svelte';
  import { Modals, closeModal } from 'svelte-modals';
</script>

<Navigation />

<slot />

<Modals>
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div slot="backdrop" class="backdrop" on:click={closeModal} />
</Modals>

<style>
  .backdrop {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.5);
  }
</style>
