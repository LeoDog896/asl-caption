<script lang="ts">
  import { type LabelledData, names } from '$lib/model';
  import { Canvas, Layer, type Render } from 'svelte-canvas';

  export let data: LabelledData;
  let canvasWidth: number;
  let canvasHeight: number;

  let render: Render
  $: render = ({ context, width, height }) => {
    if (!data) return;

    // clear canvas
    context.clearRect(0, 0, width, height);

    const {
      img,
      boxesData,
      classesData,
      scoresData,
      ratios: [xRatio, yRatio]
    } = data;

    // resize canvas to match image
    canvasWidth = img instanceof HTMLVideoElement ? img.videoWidth : img.width;
    canvasHeight = img instanceof HTMLVideoElement ? img.videoHeight : img.height;

    // draw image
    context.drawImage(img, 0, 0);

    // loop over chunks of 4 through boxes_data
    for (let i = 0; i < boxesData.length; i += 4) {
      // get the box data
      const [y, x, y1, x1] = boxesData.slice(i, i + 4);

      // get the class data
      const { name, color } = names[classesData[i / 4]];

      // get the score data
      const scoreData = (scoresData[i / 4] * 100).toFixed(2);

      // draw the outline box
      context.strokeStyle = color;
      context.lineWidth = 2;
      context.strokeRect(x * xRatio, y * yRatio, (x1 - x) * xRatio, (y1 - y) * yRatio);

      // draw a slightly transparent box
      context.fillStyle = color;
      context.globalAlpha = 0.2;
      context.fillRect(x * xRatio, y * yRatio, (x1 - x) * xRatio, (y1 - y) * yRatio);
      context.globalAlpha = 1;

      // draw a box around the class name
      context.font = '20px Arial';
      const text = `${name} @ ${scoreData}%`;
      const textWidth = context.measureText(text).width;
      context.fillStyle = color;
      context.fillRect(x * xRatio, y * yRatio - 20, textWidth, 20);

      // draw the class name
      context.fillStyle = 'white';
      context.fillText(text, x * xRatio, y * yRatio - 5);
    }
  }
</script>

<slot />
<Canvas bind:width={canvasWidth} bind:height={canvasHeight} class="image-canvas">
  <Layer {render} />
</Canvas>
<style>
  :global(.image-canvas) {
    max-width: calc(max(80vw, 60rem));
  }
</style>
