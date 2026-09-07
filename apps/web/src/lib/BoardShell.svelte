<script lang="ts">
  import { Kanban, WillowDark } from "@svar-ui/svelte-kanban";
  import type { Quadro } from "$lib/usarQuadro.svelte.js";
  import TaskCard from "$lib/TaskCard.svelte";
  import TaskDrawer from "$lib/TaskDrawer.svelte";
  import TaskTable from "$lib/TaskTable.svelte";
  import TaskToast from "$lib/TaskToast.svelte";

  interface Props {
    q: Quadro;
    esquema: "padrao" | "denso" | "zen";
    visao: "kanban" | "lista";
  }
  let { q, esquema, visao }: Props = $props();
</script>

{#if q.filtrados.length > 0 && visao === "kanban"}
  <div class="boardwrap" data-layout={esquema}>
    <WillowDark fonts={false}>
      <Kanban
        cards={q.cards}
        columns={q.columns}
        cardContent={TaskCard}
        init={(api) => q.observarMoves(api)}
      />
    </WillowDark>
  </div>
{/if}
{#if q.filtrados.length > 0 && visao === "lista"}
  <div class="boardwrap listascroll">
    <TaskTable linhas={q.filtrados} onAbrir={(id) => void q.abrir(id)} />
  </div>
{/if}
{#if q.aberta !== null}
  <TaskDrawer
    frontmatter={q.aberta}
    corpo={q.corpoAberto}
    movendo={q.movendo}
    erroMover={q.erroMover}
    onFechar={() => q.fechar()}
    onMover={(para) => void q.moverDaDrawer(para)}
  />
{/if}
<TaskToast toast={q.toast} />

<style>
  .boardwrap {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
  }
  .boardwrap > :global(.wx-kanban) {
    height: 100%;
  }
  .boardwrap.listascroll {
    overflow: auto;
  }
</style>
