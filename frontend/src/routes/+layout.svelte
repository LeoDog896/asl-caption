<script lang="ts">
  import '@fontsource-variable/inter';
  import '@fontsource-variable/outfit';
  import '../styles/main.css';
  import Navigation from '$lib/component/Navigation.svelte';
  import Modal from 'svelte-simple-modal';
</script>

<Modal>
  <Navigation />

  <slot />
</Modal>
