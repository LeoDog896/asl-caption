<!-- Modal background for modal components -->
<div>
  <slot />
</div>

<style>
  div {
    padding: 1rem;
    background: white;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
</style>
