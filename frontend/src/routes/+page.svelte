<script lang="ts">
  import { backend } from '$lib/backend';
  import FileUpload from '$lib/component/FileUpload.svelte';
  import { enhance } from '$app/forms';

  let file: File | undefined;
</script>

<svelte:head>
  <title>ASL Caption</title>
</svelte:head>

<main>
  <h1>See the world speak.</h1>

  <h3>We translate ASL to English in all media.</h3>

  <img src="landing.png" alt="Hand doing the ASL pose for 'R'." />

  <h2>Upload an image</h2>

  <form action={backend('upload')} method="post" enctype="multipart/form-data" use:enhance>
    <FileUpload id="file" name="file" bind:file>Please choose a file</FileUpload>

    <button type="submit" class="primary">Upload</button>
  </form>
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
    width: 15%;
  }
</style>
