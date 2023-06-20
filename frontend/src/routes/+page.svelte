<script lang="ts">
  import { backend } from '$lib/backend';
  import FileUpload from '$lib/component/FileUpload.svelte';
  import { enhance } from '$app/forms';
  import { IconCamera, IconFile } from '@tabler/icons-svelte';

  let file: File | undefined;
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
        <button><IconFile />From File</button>
        <button><IconCamera />From Camera</button>
      </div>
    </div>
  </div>

  <!-- <h2>Upload an image</h2>

  <form action={backend('upload')} method="post" enctype="multipart/form-data" use:enhance>
    <FileUpload id="file" name="file" bind:file>Please choose a file</FileUpload>

    <button type="submit" class="primary">Upload</button>
  </form> -->
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
  button {
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

  .buttons {
    display: flex;
    justify-content: center;
    align-items: center;
  }

</style>
