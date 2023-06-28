<script lang="ts">
  import { Canvas, Layer, type Render } from 'svelte-canvas';

  let innerWidth: number;
  let innerHeight: number;
  let scrollY = 0;

  const random = (min: number, max: number) => Math.random() * (max - min) + min;

  type Point = [x: number, y: number, z: number];

  const points: Point[] = Array.from({ length: 200 }, () => [
    random(0, 1),
    // We move the y start back -1 to add extra stars above the screen when the user eventually scrolls down
    random(-1, 1),
    // and include Z for a parallax effect
    random(0, 1)
  ]);

  let render: Render;
  $: render = ({ context, width, height }) => {
    for (const [x, y, z] of points) {
      context.fillStyle = `rgba(255, 255, 255, ${z})`;
      context.beginPath();
      context.arc(x * width, y * height - (2 * scrollY * z) / 3, 2, 0, 2 * Math.PI);
      context.fill();
    }
  };
</script>

<svelte:window 
  bind:innerWidth
  bind:innerHeight
  on:scroll={() => scrollY = window.scrollY}
/>

<Canvas width={innerWidth} height={innerHeight} class="canvas">
  <Layer {render} />
</Canvas>

<style>
  :global(.canvas) {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
  }
</style>
