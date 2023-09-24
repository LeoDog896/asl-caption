<script lang="ts">
  // fonts
  import '@fontsource-variable/inter';
  import '@fontsource-variable/outfit';

  import '../styles/main.css';
  import Navigation from '$lib/component/Navigation.svelte';
  import { Modal } from 'svelte-simple-modal';
  import CloseButton from '$lib/component/display/CloseButton.svelte';
</script>

<Modal
  unstyled={true}
  classBg="modalBg"
  classWindowWrap="modalWrapper"
  classWindow="modalWindow"
  classContent="modalContent"
  closeButton={CloseButton}
>
  <Navigation />

  <slot />
</Modal>

<style>
  /* custom modal styles */
  :global(.modalBg) {
    z-index: 10;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    display: flex;
    justify-content: center;
    align-items: center;

    background-color: #0002;
    backdrop-filter: blur(0.2em);
  }

  :global(.modalWrapper) {
    display: contents;
  }

  :global(.modalWindow) {
    max-width: 100vw;
    margin: 2rem;
    padding: 1rem;
    background-color: var(--background);
    border: 4px solid black;
    position: relative;
  }

  :global(.modalContent) {
    margin: 1rem;
    overflow-x: auto;
    border: 4px solid black;
  }
</style>
