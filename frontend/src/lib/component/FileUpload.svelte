<script lang="ts">
  import { IconX } from '@tabler/icons-svelte';

  export let id: string;
  export let name: string;
  export let accept: string | undefined = undefined;
  export let required: boolean = true;
  let clazz: string | undefined = undefined;

  export { clazz as class };

  export let file: File | undefined;

  let input: HTMLInputElement;

  const change = () => {
    file = input.files?.item(0) || undefined;
  };
</script>

<button class={clazz} on:click={() => input.click()}>
  <slot />
</button>

<input hidden type="file" {id} {name} {accept} {required} bind:this={input} on:change={change} />
