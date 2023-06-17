<script lang="ts">
  import type { PageData } from './$types';

  import { backend } from '$lib/backend';
  import FileUpload from '$lib/component/FileUpload.svelte';
  import { enhance } from '$app/forms';

  export let data: PageData;

  let file: File | undefined;
</script>

<svelte:head>
  <title>ASL Caption</title>
</svelte:head>

<h1>ASL Caption</h1>
Very much a WIP

<h2>Server Response Status: <code>{data.status} {data.statusText}</code></h2>
Server Message:<code>{data.message}</code>

<h2>File Upload Test</h2>
<form action={backend('upload')} method="post" enctype="multipart/form-data" use:enhance>
  <FileUpload id="file" name="file" bind:file />

  <button type="submit">Upload</button>
</form>
