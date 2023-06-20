<script lang="ts">
  export let id: string;
  export let accept: string | undefined = undefined;
  export let required: boolean = true;

  export let file: File | undefined;

  let input: HTMLInputElement;

  const change = () => {
    file = input.files?.item(0) || undefined;
  };
</script>

<div class="wrapper">
  <label for={id}>
    <slot />
  </label>

  <input type="file" {id} {accept} {required} bind:this={input} on:change={change} />
</div>

<style>
  .wrapper {
    display: relative;
  }

  label {
    display: contents;
  }

  input {
    position: absolute;
    bottom: 0;
    left: 0;

    opacity: 0;
  }
</style>
