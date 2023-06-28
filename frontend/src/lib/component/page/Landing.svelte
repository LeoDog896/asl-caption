<script lang="ts">
  import { fade, fly } from 'svelte/transition';
  import FileUpload from '$lib/component/FileUpload.svelte';
  import { IconCamera, IconFile, IconLoader } from '@tabler/icons-svelte';
  import ImageDisplay from '$lib/component/display/ImageDisplay.svelte';
  import VideoDisplay from '$lib/component/display/VideoDisplay.svelte';
  import type { Context } from 'svelte-simple-modal';
  import { spring } from 'svelte/motion';
  import * as tf from '@tensorflow/tfjs';
  import * as backend from '$lib/backend';
  import { loadGraphModel } from '@tensorflow/tfjs-converter';
  import { onMount } from 'svelte';
  import { getContext } from 'svelte';
  const { open } = getContext<Context>('simple-modal');

  // Hand images
  import LabeledHand from '../../../images/hands/landing.png';
  import UnlabeledHand from '../../../images/hands/landing-unlabeled.png';

  let loading = true;

  // Model files
  import MODEL_URL from '../../../model/model.json?url';
  const shards = import.meta.glob('../../../model/*.bin', { as: 'url', eager: true });

  let file: File | undefined;
  let model: tf.GraphModel<string | tf.io.IOHandler>;

  onMount(async () => {
    model = await loadGraphModel(
      tf.io.http(MODEL_URL, {
        fetchFunc: (url: string, init: Parameters<typeof fetch>[1]) => {
          // since Vite adds extra hashes to the filenames, we need to transform the requests to the hashed filenames
          const filename = url.split('/').pop() as string;
          const shard = shards[`../../../model/${filename}`];
          if (shard) {
            return fetch(shard, init);
          }
          return fetch(url, init);
        }
      })
    );
    loading = false;
  });

  $: if (file) {
    if (model) {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = async () => {
          const data = await backend.process(img);

          open(ImageDisplay, {
            data
          });
        };

        img.src = reader.result as string;
      };

      reader.readAsDataURL(file);
    }
  }

  function openVideo() {
    open(VideoDisplay, {
      model
    });
  }

  let slider: HTMLDivElement;
  let primaryHand: HTMLImageElement;
  let overlayHand: HTMLImageElement;
  let cursorX = spring(0);
  let tooltipEnabled = true;

  $: {
    if (slider) {
      slider.style.left = `${$cursorX}px`;

      const percent = (slider.offsetLeft / primaryHand.offsetWidth) * 100;

      tooltipEnabled = percent < 60;
      overlayHand.style.clipPath = `polygon(0% 100%, ${percent}% 100%, ${percent}% 0, 0% 0)`;
    }
  }
</script>

<div class="landing" transition:fly={{ y: 200, duration: 1000 }}>
  <h1>See the <span class="gradient">world</span> speak.</h1>

  <h2>
    We translate <a href="https://www.nidcd.nih.gov/health/american-sign-language">ASL</a> to English
    in all media.
  </h2>

  <div class="images">
    <div class="images-container" on:mousemove|self={(e) => ($cursorX = e.offsetX)}>
      <img
        bind:this={primaryHand}
        class="primary"
        src={UnlabeledHand}
        id="hand2"
        alt="Hand doing the ASL pose for 'R'."
      />
      <img
        bind:this={overlayHand}
        class="overlay"
        src={LabeledHand}
        id="hand"
        alt="Hand doing the ASL pose for 'R'."
      />
      <div class="slider" bind:this={slider}>
        {#if tooltipEnabled}
          <p transition:fade={{ duration: 500 }}>
            hover<br />
            over<br />
            me!
          </p>
        {/if}
      </div>
    </div>
  </div>

  <div class="container">
    <div id="upload">
      <h3 class="small-call">Upload your Media</h3>
      <div class="buttons">
        <FileUpload id="file" bind:file>
          <div class="button"><IconFile />From File</div>
        </FileUpload>
        <button class="button" on:click={openVideo} disabled={loading}>
          {#if loading}
            <IconLoader class="spin" />
          {:else}
            <IconCamera />
          {/if}
          Live Camera
        </button>
      </div>
    </div>
  </div>
</div>

<style>
  .buttons .button:disabled {
    opacity: 0.5;
  }

  .buttons .button:hover {
    background-color: var(--secondary-hover);
  }

  .images {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .images-container {
    position: relative;
    height: 100%;
    margin: 0 auto;
  }

  .images .overlay {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
  }

  .primary,
  .overlay,
  .slider {
    /* stops offsetX being transferred to the child elements */
    pointer-events: none;
  }

  .overlay {
    clip-path: polygon(0% 100%, 0% 100%, 0% 0, 0% 0);
  }

  .slider {
    position: absolute;
    top: 0;
    width: 0;
    border-left: 0.2rem dashed #8027e0;
    height: 72.6%;
  }

  .slider p {
    transform: rotate(9deg) translate(1rem, -1rem);
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
    color: var(--text);
  }

  .buttons {
    display: flex;
    justify-content: center;
    align-items: stretch;
    flex-wrap: wrap;
    background-color: var(--secondary);
  }

  @media (min-width: 700px) {
    .buttons {
      flex-direction: row;
    }
  }

  .buttons .button {
    position: relative;
    display: flex;
    border: none;
    border-radius: 0;

    cursor: pointer;

    margin: 0;
    padding: 0.5em 1.25em;
    font-weight: 500;
    font-size: var(--text-large);

    color: inherit;
    background-color: var(--secondary);

    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.2em;

    width: 14rem;

    font-weight: 400;
  }

  @media (max-width: 575px) {
    .buttons .button {
      width: 100%;
    }
  }

  .landing {
    padding: 2rem;
    color: var(--background-text);
  }

  h1 {
    font-size: 6rem;
    text-align: center;
    font-weight: 900;
  }

  @media (max-width: 600px) {
    h1 {
      font-size: 4rem;
    }
  }

  @media (max-width: 400px) {
    h1 {
      font-size: 3rem;
    }
  }

  .gradient {
    background: linear-gradient(90deg, var(--primary), var(--secondary));
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: gradient 5s ease-in-out infinite;
    background-size: 200% 400%;
  }

  .small-call {
    font-size: 35px;
    margin: 1rem;
    font-weight: 800;
  }

  h2 {
    font-size: 2.7rem;
    text-align: center;
    font-weight: 800;
    line-height: 1.2;
  }

  @keyframes gradient {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
</style>
