<script lang="ts">
  import FileUpload from '$lib/component/FileUpload.svelte';
  import { process } from '$lib/model';
  import { IconCamera, IconFile, IconLoader } from '@tabler/icons-svelte';
  import * as tf from '@tensorflow/tfjs';
  import { loadGraphModel } from '@tensorflow/tfjs-converter';
  import { onMount } from 'svelte';
  import { getContext } from 'svelte';
  const { open } = getContext('simple-modal');
  import ImageDisplay from '$lib/component/display/ImageDisplay.svelte';
  import VideoDisplay from '$lib/component/display/VideoDisplay.svelte';
  import type * as cjs from 'chart.js';

  // Statistics
  import { Line } from 'svelte-chartjs';
  import 'chart.js/auto';
  import results from '../stats/results.csv';
  const parsedResults = results.map((result) =>
    Object.fromEntries(Object.entries(result).map(([key, value]) => [key.trim(), value.trim()]))
  );

  const labels = parsedResults.map((result) => result.epoch);

  const dataFilters = [
    "epoch",
    "lr/"
  ]

  interface Category {
    name: string;
    labels: string[];
  }

  const categories: Category[] = [
    {
      name: "Loss",
      labels: ["box_loss", "cls_loss", "dfl_loss"]
    },
    {
      name: "Precision & Recall",
      labels: ["precision", "recall", "mAP50", "mAP50-95"]
    },
  ]

  const rawData = parsedResults.reduce((acc: Record<string, string[]>, result) => {
    Object.entries(result).forEach(([key, value]) => {
      if (!dataFilters.some((filter) => key.includes(filter))) {
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(value);
      }
    });
    return acc;
  }, {});

  const defaultOptions: Partial<cjs.ChartDataset<'line', number[]>> = {
    borderCapStyle: 'butt',
    borderDash: [],
    borderDashOffset: 0.0,
    borderJoinStyle: 'miter',
    pointBorderWidth: 10,
    pointHoverRadius: 5,
    pointHoverBorderWidth: 2,
    pointRadius: 0,
    pointHitRadius: 10,
    tension: 0.5
  };

  const datasets = Object.entries(rawData).map(([key, values]) => ({
    label: key,
    ...defaultOptions,
    data: values.map((value) => parseFloat(value))
  }))

  let data: cjs.ChartData<'line', number[], unknown> = {
    labels,
    datasets,
  };

  // Team photos
  import Hazel from '../images/selfies/hazel.png';
  import Temp from '../images/selfies/temp.jpg';

  // Model files
  import MODEL_URL from '../model/model.json?url';
  const shards = import.meta.glob('../model/*.bin', { as: 'url', eager: true });

  let file: File | undefined;
  let model: tf.GraphModel<string | tf.io.IOHandler>;
  let loading = true;

  onMount(async () => {
    model = await loadGraphModel(
      tf.io.http(MODEL_URL, {
        fetchFunc: (url: string, init: Parameters<typeof fetch>[1]) => {
          const filename = url.split('/').pop() as string;
          const shard = shards[`../model/${filename}`];
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
          const data = await process(model, img);

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
</script>

<svelte:head>
  <title>ASL Caption</title>
</svelte:head>

<main>
  <div class="landing">
    <h1>See the <span class="gradient">world</span> speak.</h1>

    <h2>
      We translate <a href="https://www.nidcd.nih.gov/health/american-sign-language">ASL</a> to English
      in all media.
    </h2>

    <img src="landing.png" alt="Hand doing the ASL pose for 'R'." />

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
            From Camera
          </button>
        </div>
      </div>
    </div>
  </div>
  <div class="slant">
    <h2 id="about">About Us</h2>

    <p>
      We're a group of students who are <b>passionate</b> about promoting inclusive communication
      for all. We firmly believe that <b>communication</b> is a fundamental human right and no one should
      be left behind due to barriers caused by hearing differences.
    </p>

    <p>
      Our mission is to create a world where everyone can <b>effectively</b> and <b>effortlessly</b>
      communicate, regardless of their hearing abilities. By recognizing the importance of American Sign
      Language and its role in facilitating communication for the deaf community, we have taken our first
      step towards making the world a more accessible place.
    </p>

    <h3 style="font-size: 35px">Our Team</h3>

    <div id="people">
      <img src={Hazel} alt="Hazel" />
      <img src={Temp} alt="Temp" />
      <img src={Temp} alt="Temp" />
      <img src={Temp} alt="Temp" />
      <img src={Temp} alt="Temp" />
      <img src={Temp} alt="Temp" />
    </div>
  </div>
  <div class="color-container">
    <div class="slant slant-secondary">
      <h2>Evaluation</h2>

      <div id="evaluationGrid">
        <Line 
          {data}
          options={{ 
            responsive: true,
            scales: {
              x: {
                title: {
                  display: true,
                  text: 'Epoch',
                  color: 'white'
                },
                ticks: {
                  color: 'white'
                },
                grid: {
                  color: 'rgba(224, 224, 224, 0.2)'
                }
              },
              y: {
                ticks: {
                  color: 'white',
                  major: {
                    enabled: true
                  }
                },
                grid: {
                  color: 'rgba(224, 224, 224, 0.2)'
                }
              },
            },
            color: 'white',
            font: {
              family: "'Inter Variable', sans-serif",
              weight: "900"
            }
          }}
        />

        {#each categories as category}
          <button class="categorySwitch" on:click={() => {
            for (const datasetName of category.labels) {
              const dataset = datasets.find(dataset => dataset.label === datasetName);

              if (dataset) {
                dataset.hidden = !dataset.hidden;
              }
            }

            data = data
          }}>{category.name}</button>
        {/each}
      </div>
    </div>
  </div>
</main>

<footer>
  Source on <a href="https://github.com/LeoDog896/asl-caption">GitHub</a>
</footer>

<style>
  :root {
    --max-width: 1500px;
  }

  .categorySwitch {
    font-weight: 800;
    padding: 0.5rem;
    color: white;
    border: 2px solid var(--secondary-hover);
    margin: 1rem;
    background-color: var(--secondary);
    transition: background-color 0.1s cubic-bezier(0.075, 0.82, 0.165, 1);
  }

  .categorySwitch:hover {
    background-color: var(--primary);
  }

  .small-call {
    font-size: 35px;
    margin: 1rem;
    font-weight: 800;
  }

  footer {
    text-align: center;
    padding: 1rem;
  }

  .gradient {
    background: linear-gradient(90deg, var(--primary), var(--secondary));
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  :global(.spin) {
    animation: spin 1s linear infinite;
  }

  p {
    max-width: 1500px;
    margin: 2rem auto;
  }

  #people {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    max-width: 1500px;
    margin: 0 auto;
  }

  #people img {
    margin: 0;
  }

  #evaluationGrid {
    max-width: 1500px;
    margin: 0 auto;
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
    background-color: var(--test-color);
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

  .landing {
    padding: 2rem;
    animation: entry 1s cubic-bezier(0.075, 0.82, 0.165, 1);
  }

  @keyframes entry {
    0% {
      opacity: 0;
      transform: translateY(2rem);
    }

    100% {
      opacity: 1;
      transform: translateY(0);
    }
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
    font-weight: 800;
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
    height: 100%;

    font-weight: 400;
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
