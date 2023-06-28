<script lang="ts">
  import { Canvas, Layer, type Render } from 'svelte-canvas';

  let innerWidth: number;
  let innerHeight: number;
  let scrollY: number;

  type Point = [x: number, y: number, z: number];
  const points: Point[] = Array.from({ length: 100 }, () => [Math.random(), Math.random(), Math.random()]);

  let render: Render;
  $: render = ({ context, width, height }) => {
    for (const [x, y, z] of points) {
      context.fillStyle = `rgba(255, 255, 255, ${z})`;
      context.beginPath();
      context.arc(x * width, (y * height) + (scrollY / (1 / z)), 2, 0, 2 * Math.PI);
      context.fill();
    }
  }
</script>

<svelte:window bind:innerWidth bind:innerHeight bind:scrollY />

<Canvas width={innerWidth} height={innerHeight} class="canvas">
  <Layer {render} />
</Canvas>
