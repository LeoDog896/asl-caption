<script lang="ts">
  import { IconX } from '@tabler/icons-svelte';

  export let onClose: (
    event: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement }
  ) => unknown;
</script>

<button on:click={onClose}><IconX /></button>

<style>
  button {
    all: unset;
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;

    color: var(--background-text);
    cursor: pointer;
  }
</style>
