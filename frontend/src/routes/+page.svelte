<script lang="ts">
  import { backend } from '$lib/backend';
  import FileUpload from '$lib/component/FileUpload.svelte';
  import { IconCamera, IconFile } from '@tabler/icons-svelte';

  let file: File | undefined;

  $: if (file) {
    const url = backend("upload");

    const formData = new FormData();

    formData.append("file", file);

    fetch(url, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }
</script>

<svelte:head>
  <title>ASL Caption</title>
</svelte:head>

<main>
  <h1>See the world speak.</h1>

  <h3>We translate ASL to English in all media.</h3>

  <img src="landing.png" alt="Hand doing the ASL pose for 'R'." />

  <div class="container">
    <div id="upload">
      <h2>Upload your Media</h2>
      <div class="buttons">
        <FileUpload class="button" id="file" name="file" bind:file><IconFile />From File</FileUpload>
        <button class="button"><IconCamera />From Camera</button>
      </div>
    </div>
  </div>
</main>

<style>
  main {
    margin: 2rem;
  }

  h1 {
    font-size: 4rem;
    text-align: center;
  }

  h3 {
    font-size: 1.7rem;
    text-align: center;
    font-weight: 200;
    line-height: 1.2;
  }

  img {
    display: block;
    margin: 0 auto;
    height: 25rem;
  }

  .container {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  #upload {
    text-align: center;
    background-color: var(--primary);
  }

  /* TODO: i don't quite like the spacing of the icons - this can probably be tinkered with a bit to look better */
  :global(.button) {
    position: relative;
    border: 4px solid transparent;
    background-color: var(--surface);

    cursor: pointer;

    margin: 0;

    padding: 0.4em 1.25em;
    font-weight: 500;
    font-size: var(--text-large);

    color: var(--text-primary);
    background-color: var(--secondary);
    border-radius: 0;

    display: flex;
    justify-content: center;
    align-items: center;
  }

  :global(.button):hover {
    background-color: var(--secondary-hover);
  }

  .buttons {
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
