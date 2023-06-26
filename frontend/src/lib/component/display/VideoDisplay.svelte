<script lang="ts">
  import { onMount } from 'svelte';
  import ImageDisplay from './ImageDisplay.svelte';
  import { process, type LabelledData } from '$lib/model';
  import type * as tf from '@tensorflow/tfjs';

  let video: HTMLVideoElement;
  let data: LabelledData;

  export let model: tf.GraphModel<string | tf.io.IOHandler>;
  export let isOpen: boolean;

  $: if (video && isOpen && video.srcObject === null) {
    navigator.mediaDevices
      .getUserMedia({
        video: true
      })
      .then((stream) => {
        video.srcObject = stream;
        console.log(video.videoWidth);
        video.play();
      }).catch((err) => {
        console.error(err);
        alert('Unable to access webcam - check your permissions or make sure you aren\'t using it in another tab');
        isOpen = false;
      });
  }

  async function render() {
    if (video && isOpen && model && video.videoWidth > 0 && video.videoHeight > 0) {
      // grab data
      data = await process(model, video);
    }

    // request next frame
    requestAnimationFrame(render);
  }

  onMount(() => {
    requestAnimationFrame(render);
  });

  $: if (!isOpen && video && video.srcObject instanceof MediaStream) {
    video.srcObject.getTracks().forEach((track) => track.stop());
  }
</script>

{#if isOpen}
  <ImageDisplay {data} {isOpen}>
    <!-- svelte-ignore a11y-media-has-caption this is a webcam -->
    <video bind:this={video} />
  </ImageDisplay>
{/if}

<style>
  video {
    /* hide video */
    opacity: 0;
    position: absolute;
    top: 0;
    left: 0;
    user-select: none;
  }
</style>
