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

  // Statistics
  import { Line } from 'svelte-chartjs'
  import 'chart.js/auto';
  import results from "../stats/results.csv"
  const parsedResults = results.map(result => 
    Object.fromEntries(Object.entries(result).map(([key, value]) => [key.trim(), value.trim()]))
  );

  const labels = parsedResults.map(result => result.epoch);

  const rawData = parsedResults.reduce((acc, result) => {
    Object.entries(result).forEach(([key, value]) => {
      if (key !== "epoch") {
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(value);
      }
    });
    return acc;
  }, {} as Record<string, string[]>);

  console.log(rawData)

  const colors = [
    "#5EB1BF",
    "#D81E5B",
    "#2E4057",
    "#C6AC8F",
    "#04724D",
    "#F7FE72",
    "#90F1EF",
    "#FFD6E0",
    "#D5A021",
    "#30638E",
    "#EDAE49",
    "#5F4BB6"
  ]

  const defaultOptions = Object.freeze({
    borderCapStyle: "butt",
    borderDash: [],
    borderDashOffset: 0.0,
    borderJoinStyle: "miter",
    pointBorderColor: "rgb(205, 130,1 58)",
    pointBackgroundColor: "rgb(255, 255, 255)",
    pointBorderWidth: 10,
    pointHoverRadius: 5,
    pointHoverBackgroundColor: "rgb(0, 0, 0)",
    pointHoverBorderColor: "rgba(220, 220, 220,1)",
    pointHoverBorderWidth: 2,
    pointRadius: 0,
    pointHitRadius: 10,
  })

  let data: import("chart.js").ChartData<"line", (number | import("chart.js").Point)[], unknown> = {
    labels,
    datasets: [
      // {
      //   label: "My First dataset",
      //   borderColor: "rgb(205, 130, 158)",
      //   ...defaultOptions,
      //   data: [65, 59, 80, 81, 56, 55, 40]
      // },
      // {
      //   label: "My Second dataset",
      //   borderColor: "rgb(35, 26, 136)",
      //   ...defaultOptions,
      //   data: [28, 48, 40, 19, 86, 27, 90]
      // }
      ...Object.entries(rawData).map(([key, values], index) => ({
        label: key,
        borderColor: colors[index],
        ...defaultOptions,
        data: values.map(value => parseFloat(value))
      }))
    ],
  };
  

  // Team photos
  import Hazel from '../images/selfies/hazel.png'
  import Temp from '../images/selfies/temp.jpg'

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

    <h2>We translate <a href="https://www.nidcd.nih.gov/health/american-sign-language">ASL</a> to English in all media.</h2>

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
      We're a group of students who are <b>passionate</b> about promoting inclusive communication for all.
      We firmly believe that <b>communication</b> is a fundamental human right and no one should be left
      behind due to barriers caused by hearing differences.
    </p>

    <p>
      Our mission is to create a world where everyone can <b>effectively</b> and <b>effortlessly</b> communicate,
      regardless of their hearing abilities. By recognizing the importance of American Sign Language
      and its role in facilitating communication for the deaf community, we have taken the first
      step towards making the world a more accessible place.
    </p>

    <h3 style="font-size: 35px">Our Team</h3>

    <div id="people">
      <img src={Hazel} alt="Hazel"/>
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
        <!-- {#each graphs as graph}
          <div class="graph">
            <div class="display">
              <img src={graph.source} alt={graph.alt} />
              TODO: -->
              <!-- svelte-ignore a11y-no-noninteractive-tabindex
              <div class="description" tabindex="0">
                <p>{graph.description}</p>
              </div>
            </div>
            <p>{graph.title}</p>
          </div>
        {/each} -->
        <Line {data} options={{ responsive: true }}></Line>
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
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(2, 1fr);
    grid-gap: 1rem;
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
