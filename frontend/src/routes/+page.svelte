<script lang="ts">
  import { backend } from '$lib/backend';
  import FileUpload from '$lib/component/FileUpload.svelte';
  import { enhance } from '$app/forms';

  let file: File | undefined;
</script>

<svelte:head>
  <title>ASL Caption</title>
</svelte:head>

<h1>ASL Caption</h1>
<h2>Caption alphabetic ASL images (and TODO video) with ease</h2>

<h2>File Upload Test</h2>
<form action={backend('upload')} method="post" enctype="multipart/form-data" use:enhance>
  <FileUpload id="file" name="file" bind:file>Please choose a file</FileUpload>

  <button type="submit" class="primary">Upload</button>
</form>
