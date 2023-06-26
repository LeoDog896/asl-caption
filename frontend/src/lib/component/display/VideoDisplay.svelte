<script lang="ts">
  import { getContext, onDestroy, onMount } from 'svelte';
  import ImageDisplay from './ImageDisplay.svelte';
  import { process, type LabelledData } from '$lib/model';
  import type * as tf from '@tensorflow/tfjs';
  const { close } = getContext('simple-modal');

  let video: HTMLVideoElement;
  let data: LabelledData;

  export let model: tf.GraphModel<string | tf.io.IOHandler>;

  let animationFrame: number;

  async function render() {
    if (video && model && video.srcObject && video.videoWidth > 0 && video.videoHeight > 0) {
      // grab data
      data = await process(model, video);
    }

    // request next frame
    animationFrame = requestAnimationFrame(render);
  }

  onMount(() => {
    animationFrame = requestAnimationFrame(render);

    navigator.mediaDevices
      .getUserMedia({
        video: true
      })
      .then((stream) => {
        video.srcObject = stream;
        return video.play();
      }).catch((err) => {
        console.error(err);
        alert('Unable to access webcam - check your permissions or make sure you aren\'t using it in another tab');
        close();
      });
  });

  onDestroy(() => {
    if (video && video.srcObject instanceof MediaStream) {
      video.srcObject.getTracks().forEach((track) => track.stop());
    }

    cancelAnimationFrame(animationFrame);
  });
</script>

<ImageDisplay {data}>
  <!-- svelte-ignore a11y-media-has-caption this is a webcam -->
  <video autoplay tabindex=-1 bind:this={video} />
</ImageDisplay>

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
