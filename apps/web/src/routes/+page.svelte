<script lang="ts">
  import "../theme/taskia.css";
  import { onDestroy, onMount } from "svelte";
  import { Kanban, WillowDark } from "@svar-ui/svelte-kanban";
  import { invalidateAll } from "$app/navigation";
  import type { Status, TaskFrontmatter } from "@taskia/core";
  import { COLUNAS, FILTRO_VAZIO, filtrar, type CardView } from "$lib/board.js";
  import BoardTopo from "$lib/BoardTopo.svelte";
  import TaskCard from "$lib/TaskCard.svelte";
  import TaskDrawer from "$lib/TaskDrawer.svelte";
  import TaskTable from "$lib/TaskTable.svelte";
  import TaskToast from "$lib/TaskToast.svelte";

  interface Props {
    data: { cards: CardView[] };
  }
  let { data }: Props = $props();
  let toast = $state<{ msg: string; ok: boolean } | null>(null);
  let toastTimer: ReturnType<typeof setTimeout> | null = null;
  let busca = $state(FILTRO_VAZIO.busca);
  let dono = $state(FILTRO_VAZIO.dono);
  let prio = $state(FILTRO_VAZIO.prioridade);
  let novoTitulo = $state("");
  let criando = $state(false);
  let visao = $state<"kanban" | "lista">("kanban");
  let aberta = $state<TaskFrontmatter | null>(null);
  let corpoAberto = $state("");
  let movendo = $state(false);
  let erroMover = $state<string | null>(null);

  const columns = COLUNAS.map((c) => ({
    id: c.id,
    label: c.label,
    css: `tk-col-${c.id}`,
    ...(c.limite > 0 ? { cardLimit: c.limite } : {}),
  }));

  let filtrados = $derived(filtrar(data.cards, { busca, dono, prioridade: prio }));

  let contadores = $derived(
    COLUNAS.map((c) => ({ ...c, total: data.cards.filter((t) => t.status === c.id).length })),
  );

  let total = $derived(data.cards.length);

  let abertas = $derived(data.cards.filter((t) => t.status !== "feito" && t.status !== "arquivado").length);

  let cards = $derived(
    filtrados.map((t: CardView) => ({
      id: t.id,
      label: t.titulo,
      column: t.status,
      status: t.status,
      tipo: t.tipo,
      priority: t.prioridade,
      dono: t.responsavel ?? "—",
      clarity: t.clarity,
      bloqueadas: t.bloqueadas,
    })),
  );

  async function criar(): Promise<void> {
    if (novoTitulo.trim().length < 3 || criando) return;
    criando = true;
    const r = await fetch("/api/criar", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ titulo: novoTitulo.trim() }),
    });
    criando = false;
    if (!r.ok) {
      const corpo = (await r.json()) as { error?: unknown };
      mostrarToast(typeof corpo.error === "string" ? corpo.error : "Falha ao criar.", false);
      return;
    }
    const criado = (await r.json()) as { id?: unknown };
    novoTitulo = "";
    mostrarToast(`${typeof criado.id === "string" ? criado.id : "Tarefa"} criada ✓`, true);
    await invalidateAll();
  }

  function mostrarToast(msg: string, ok: boolean): void {
    if (toastTimer !== null) {
      clearTimeout(toastTimer);
      toastTimer = null;
    }
    toast = { msg, ok };
    toastTimer = setTimeout(() => {
      toast = null;
      toastTimer = null;
    }, 4000);
  }

  onDestroy(() => {
    if (toastTimer !== null) clearTimeout(toastTimer);
  });

  async function mover(id: string, para: string): Promise<string | null> {
    const r = await fetch("/api/mover", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ id, para }),
    });
    if (!r.ok) {
      const corpo = (await r.json()) as { error?: unknown };
      const msg = typeof corpo.error === "string" ? corpo.error : "Falha ao mover.";
      mostrarToast(msg, false);
      await invalidateAll();
      return msg;
    }
    mostrarToast(`${id} → ${para} ✓`, true);
    await invalidateAll();
    return null;
  }

  async function abrir(id: string): Promise<void> {
    erroMover = null;
    const r = await fetch(`/api/tarefa/${id}`);
    if (!r.ok) {
      mostrarToast(`Tarefa ${id} não encontrada.`, false);
      return;
    }
    const detalhe = (await r.json()) as { frontmatter: TaskFrontmatter; corpo: string };
    aberta = detalhe.frontmatter;
    corpoAberto = detalhe.corpo;
  }

  function fechar(): void {
    aberta = null;
    corpoAberto = "";
    erroMover = null;
  }

  async function moverDaDrawer(para: Status): Promise<void> {
    if (aberta === null) return;
    movendo = true;
    erroMover = null;
    const falha = await mover(aberta.id, para);
    movendo = false;
    erroMover = falha;
    if (falha !== null) return;
    await abrir(aberta.id);
  }

  function aoAbrirEvento(e: Event): void {
    if (!(e instanceof CustomEvent)) return;
    if (typeof e.detail !== "string" || e.detail === "") return;
    void abrir(e.detail);
  }

  onMount(() => {
    window.addEventListener("taskia:abrir", aoAbrirEvento);
    return () => window.removeEventListener("taskia:abrir", aoAbrirEvento);
  });

  function limparFiltros(): void {
    busca = FILTRO_VAZIO.busca;
    dono = FILTRO_VAZIO.dono;
    prio = FILTRO_VAZIO.prioridade;
  }
</script>

<main>
  <BoardTopo
    bind:busca
    bind:dono
    bind:prio
    bind:novoTitulo
    bind:visao
    {criando}
    {total}
    {abertas}
    {contadores}
    vazio={filtrados.length === 0}
    onCriar={() => void criar()}
    onLimpar={limparFiltros}
    onVisao={(v) => (visao = v)}
  />
  {#if filtrados.length > 0 && visao === "kanban"}
    <div class="boardwrap">
      <WillowDark fonts={false}>
        <Kanban
          {cards}
          {columns}
          cardContent={TaskCard}
          init={(api) => {
            api.on("move-card", (ev) => {
              if (typeof ev !== "object" || ev === null || !("id" in ev)) return;
              const col = "column" in ev ? ev.column : undefined;
              void mover(String(ev.id), typeof col === "string" ? col : "");
            });
          }}
        />
      </WillowDark>
    </div>
  {/if}
  {#if filtrados.length > 0 && visao === "lista"}
    <div class="boardwrap listascroll">
      <TaskTable linhas={filtrados} onAbrir={(id) => void abrir(id)} />
    </div>
  {/if}
  {#if aberta !== null}
    <TaskDrawer
      frontmatter={aberta}
      corpo={corpoAberto}
      {movendo}
      {erroMover}
      onFechar={fechar}
      onMover={(para) => void moverDaDrawer(para)}
    />
  {/if}
  <TaskToast {toast} />
</main>

<style>
  main {
    background: var(--bg-0);
    color: var(--text-1);
    height: 100vh;
    height: 100dvh;
    padding: 16px 24px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
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
  @media (max-width: 720px) {
    main {
      padding: 12px 16px;
    }
  }
</style>
