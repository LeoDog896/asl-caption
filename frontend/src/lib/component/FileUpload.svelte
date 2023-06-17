<script lang="ts">
  import {IconX} from "@tabler/icons-svelte"

  export let id: string;
  export let name: string;
  export let accept: string | undefined = undefined;
  export let required: boolean = true;

  export let file: File | undefined;

  let input: HTMLInputElement;

  const change = () => {
    file = input.files?.item(0) || undefined;
  };

  const remove = () => {
    input.value = '';
    change();
  };
</script>

<div class="wrapper">
  <label for={id}>
    File Upload

    <div class="file">
      {#if file === undefined}
        No File Specified
      {:else}
        {file.name}

        <button class="remove" on:click={remove}>
          <IconX />
        </button>
      {/if}
    </div>
  </label>

  <input type="file" {id} {name} {accept} {required} bind:this={input} on:change={change} />
</div>

<style>
  .wrapper {
    position: relative;
  }

  input {
    opacity: 0;
    pointer-events: none;

    position: absolute;
    bottom: 0;
    left: 0;
  }
</style>
