<script lang="ts">
  import 'unfonts.css';
  import '../styles/main.css';
  import Navigation from '$lib/component/Navigation.svelte';
</script>

<Navigation />

<main>
  <slot />
</main>

<style>
  main {
    margin: 2rem;
  }
</style>
