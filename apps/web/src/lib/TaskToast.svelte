<script lang="ts">
  interface Props {
    toast: { msg: string; ok: boolean } | null;
  }
  let { toast }: Props = $props();
</script>

<div class="toastwrap" aria-live="polite">
  {#if toast !== null}
    <p class="taskia-toast" class:ok={toast.ok}>{toast.msg}</p>
  {/if}
</div>

<style>
  .toastwrap {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 60;
  }
</style>
