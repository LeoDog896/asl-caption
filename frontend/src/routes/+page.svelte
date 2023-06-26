<script lang="ts">
  import FileUpload from '$lib/component/FileUpload.svelte';
  import { process } from '$lib/model';
  import { IconCamera, IconFile, IconLoader } from '@tabler/icons-svelte';
  import * as tf from '@tensorflow/tfjs';
  import { loadGraphModel } from '@tensorflow/tfjs-converter';
  import { onMount } from 'svelte';
  import { openModal } from 'svelte-modals';
  import ImageDisplay from '$lib/component/display/ImageDisplay.svelte';
  import VideoDisplay from '$lib/component/display/VideoDisplay.svelte';

  // Statistic images
  import ConfusionMatrixNormalized from '../images/statistics/confusion_matrix_normalized.png';
  import PCurve from '../images/statistics/P_curve.png';
  import PRCurve from '../images/statistics/PR_curve.png';
  import RCurve from '../images/statistics/R_curve.png';

  // Model files
  import MODEL_URL from '../model/model.json?url';
  const shards = import.meta.glob('../model/*.bin', { as: 'url', eager: true })

  let file: File | undefined;
  let model: tf.GraphModel<string | tf.io.IOHandler>;
  let loading = true;

  onMount(async () => {
    model = await loadGraphModel(
      tf.io.http(MODEL_URL, {
        fetchFunc: (
          url: string,
          init: Parameters<typeof fetch>[1]
        ) => {
          const filename = url.split('/').pop() as string;
          const shard = shards[`../model/${filename}`];
          if (shard) {
            return fetch(shard, init);
          }
          return fetch(url, init)
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
          const data = await process(model, img);

          openModal(ImageDisplay, {
            data
          });
        };

        img.src = reader.result as string;
      };

      reader.readAsDataURL(file);
    }
  }

  function openVideo() {
    openModal(VideoDisplay, {
      model
    });
  }

  interface Graph {
    source: string;
    alt: string;
    description: string;
  }

  const graphs: Graph[] = [
    {
      source: ConfusionMatrixNormalized,
      alt: 'Confusion Matrix',
      description: 'Confusion Matrix'
    },
    {
      source: PCurve,
      alt: 'P Curve',
      description: 'P Curve'
    },
    {
      source: PRCurve,
      alt: 'PR Curve',
      description: 'PR Curve'
    },
    {
      source: RCurve,
      alt: 'R Curve',
      description: 'R Curve'
    }
  ]
</script>

<svelte:head>
  <title>ASL Caption</title>
</svelte:head>

<main>
  <div class="padding">
    <h1>See the <span class="gradient">world</span> speak.</h1>

    <h2>We translate ASL to English in all media.</h2>

    <img src="landing.png" alt="Hand doing the ASL pose for 'R'." />

    <div class="container">
      <div id="upload">
        <h3>Upload your Media</h3>
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
            From Camera
          </button>
        </div>
      </div>
    </div>
  </div>
  <div class="slant">
    <h2 id="about">About Us</h2>

    <p>
      We're a group of students who are passionate about closing the gap between the hearing and
      deaf communities as well as promoting inclusive communication for all. We firmly believe that
      communication is a fundamental human right and no one should be left behind due to barriers
      caused by hearing differences.
    </p>

    <p>
      Our mission is to create a world where everyone can effectively and effortlessly communicate,
      regardless of their hearing abilities. By recognizing the importance of American Sign Language
      and its role in facilitating communication for the deaf community, we have taken the first
      step towards making the world a more accessible place.
    </p>
  </div>
  <div class="color-container">
    <div class="slant slant-secondary">
      <spacer type="horizontal" width="500" height="500" />
      <h2>Evaluation</h2>

      <div id="evaluationGrid">
        {#each graphs as graph}
          <div class="graph">
            <img src={graph.source} alt={graph.alt} />
            <p>{graph.description}</p>
          </div>
        {/each}
      </div>
    </div>
  </div>
</main>

<style>
  .gradient {
    background: linear-gradient(90deg, var(--primary), var(--secondary));
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  :global(.spin) {
    animation: spin 1s linear infinite;
  }

  #evaluationGrid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(2, 1fr);
    grid-gap: 1rem;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }

    100% {
      transform: rotate(360deg);
    }
  }

  .slant {
    padding: 2rem;
    padding-top: 4rem;
    background-color: var(--primary);
    height: 100%;
    clip-path: polygon(0 5rem, 100% 0, 100% calc(100% + 5rem), 0 100%);
    text-align: center;
  }

  .slant-secondary {
    background-color: var(--secondary);
    clip-path: polygon(0 0, 100% 5rem, 100% 100%, 0 100%);
  }

  .color-container {
    background-color: var(--primary);
  }

  .slant p {
    font-size: 1.2rem;
    font-weight: 400;
    line-height: 1.5;
  }

  .padding {
    padding: 2rem;
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

  h2 {
    font-size: 2.7rem;
    text-align: center;
    font-weight: 700;
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

  .buttons {
    display: flex;
    flex-direction: column;
    background-color: var(--secondary);
  }

  /* TODO: i don't quite like the spacing of the icons - this can probably be tinkered with a bit to look better */
  .buttons .button {
    position: relative;
    display: inline-block !important;
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
    height: 100%;
  }

  .buttons .button:disabled {
    opacity: 0.5;
  }

  .buttons .button:hover {
    background-color: var(--secondary-hover);
  }

  

  @media (min-width: 700px) {
    .buttons {
      flex-direction: row;
    }
  }
</style>
