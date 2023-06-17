<script lang="ts">
  import {IconX} from "@tabler/icons-svelte"
  import {page} from "$app/stores"

  export let id: string;
  export let name: string;
  export let accept: string | undefined = undefined;
  export let required: boolean = true;

  export let file: File | undefined;

  let input: HTMLInputElement;

  const change = () => {
    file = input.files?.item(0) || undefined;
  };

  const remove = (e: MouseEvent) => {
    e.preventDefault();
    input.value = '';
    change();
  };
</script>

<div class="wrapper">
  <label for={id} class:ready={file !== undefined}>
    <div class="content">
      <slot>File Upload</slot>
    </div>

    <div class="file">
      <div class="message">
        {#if file === undefined}
          No File Specified
        {:else}
          {file.name}
        {/if}
      </div>

      <button class="remove" on:click={remove}>
        <IconX />
      </button>
    </div>
  </label>

  <input type="file" {id} {name} {accept} {required} bind:this={input} on:change={change} />
</div>

<style>
  .wrapper {
    position: relative;
    align-self: stretch;
  }

  input {
    opacity: 0;
    pointer-events: none;

    position: absolute;
    bottom: 0;
    left: 0;
  }

  label {
    display: flex;
    flex-direction: column;
    align-items: center;

    padding: var(--gap) var(--gap) 0;
    text-align: center;
    font-size: 1.5rem;
    font-weight: 600;

    overflow: hidden;
    cursor: pointer;

    box-shadow: var(--shadow);
  }
  label.ready {
    cursor: default;
  }

  .content {
    transition: transform 0.6s var(--ease-cubic);
  }
  label.ready .content {
    transform: translateY(1em);
  }

  .file {
    --offset: 2.5;

    border-top-left-radius: var(--radius-small);
    border-top-right-radius: var(--radius-small);

    font-size: var(--text-large);
    font-weight: 400;

    margin-top: var(--gap);
    padding: 0.5rem;
    width: calc(min(20rem, 80vw));
    height: 2em;

    display: flex;
    align-items: center;
    justify-content: center;

    background-color: var(--surface);
    transition: all 0.6s var(--ease-cubic), color 0s linear;
  }
  label.ready .file {
    color: var(--text-primary);
    background-color: var(--primary);

    transform: translateY(calc(var(--gap) * var(--offset) * -1));
    height: calc(2em + var(--gap) * var(--offset));
    margin-bottom: calc(var(--gap) * var(--offset) * -1);
  }

  .message {
    flex-grow: 1;
    text-align: center;
  }

  .remove {
    all: unset;
    float: right;
    width: 0;
    padding: 0.22rem 0;

    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    opacity: 0;

    transition: all 0.6s var(--ease-cubic);
  }
  label.ready .remove {
    width: 1em;
    padding: 0.22rem;
    opacity: 1;
  }
</style>
