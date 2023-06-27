<script lang="ts">
  import { type LabelledData, names } from '$lib/model';

  export let data: LabelledData;
  let canvas: HTMLCanvasElement;

  $: if (data && canvas) {
    const ctx = canvas.getContext('2d')!;

    // clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const {
      img,
      boxesData,
      classesData,
      scoresData,
      ratios: [xRatio, yRatio]
    } = data;

    // resize canvas to match image
    canvas.width = img instanceof HTMLVideoElement ? img.videoWidth : img.width;
    canvas.height = img instanceof HTMLVideoElement ? img.videoHeight : img.height;

    // draw image
    ctx.drawImage(img, 0, 0);

    // loop over chunks of 4 through boxes_data
    for (let i = 0; i < boxesData.length; i += 4) {
      // get the box data
      const [y, x, y1, x1] = boxesData.slice(i, i + 4);

      // get the class data
      const { name, color } = names[classesData[i / 4]];

      // get the score data
      const scoreData = (scoresData[i / 4] * 100).toFixed(2);

      // draw the outline box
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.strokeRect(x * xRatio, y * yRatio, (x1 - x) * xRatio, (y1 - y) * yRatio);

      // draw a slightly transparent box
      ctx.fillStyle = color;
      ctx.globalAlpha = 0.2;
      ctx.fillRect(x * xRatio, y * yRatio, (x1 - x) * xRatio, (y1 - y) * yRatio);
      ctx.globalAlpha = 1;

      // draw a box around the class name
      ctx.font = '20px Arial';
      const text = `${name} @ ${scoreData}%`;
      const textWidth = ctx.measureText(text).width;
      ctx.fillStyle = color;
      ctx.fillRect(x * xRatio, y * yRatio - 20, textWidth, 20);

      // draw the class name
      ctx.fillStyle = 'white';
      ctx.fillText(text, x * xRatio, y * yRatio - 5);
    }
  }
</script>

<slot />
<canvas bind:this={canvas} />

<style>
  canvas {
    border: 1px solid black;
  }
</style>
