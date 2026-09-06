<script lang="ts">
  interface Contador {
    id: string;
    label: string;
    cor: string;
    total: number;
  }

  interface Props {
    busca?: string;
    dono?: string;
    prio?: string;
    novoTitulo?: string;
    visao?: "kanban" | "lista";
    criando: boolean;
    total: number;
    abertas: number;
    vazio: boolean;
    contadores: Contador[];
    onCriar: () => void;
    onLimpar: () => void;
    onVisao: (v: "kanban" | "lista") => void;
  }

  let {
    busca = $bindable(""),
    dono = $bindable("todas"),
    prio = $bindable("todas"),
    novoTitulo = $bindable(""),
    visao = $bindable("kanban"),
    criando,
    total,
    abertas,
    vazio,
    contadores,
    onCriar,
    onLimpar,
    onVisao,
  }: Props = $props();

  let buscaEl = $state<HTMLInputElement | null>(null);
  let criarEl = $state<HTMLInputElement | null>(null);

  function atalho(e: KeyboardEvent): void {
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
    if (e.key === "/" && buscaEl !== null) {
      e.preventDefault();
      buscaEl.focus();
    }
    if ((e.key === "c" || e.key === "C") && criarEl !== null) {
      e.preventDefault();
      criarEl.focus();
    }
  }
</script>

<svelte:window onkeydown={atalho} />

<header class="topo">
  <div class="marca">
    <span class="logo" aria-hidden="true">▦</span>
    <div>
      <h1>TaskIA</h1>
      <p>{total} tarefas · {abertas} em aberto</p>
    </div>
  </div>
  <div class="toggle" role="group" aria-label="Alternar visão">
    <button class="taskia-btn" class:ativo={visao === "kanban"} onclick={() => onVisao("kanban")}>Kanban</button>
    <button class="taskia-btn" class:ativo={visao === "lista"} onclick={() => onVisao("lista")}>Lista</button>
  </div>
</header>

<section class="painel" aria-label="Filtros e criação">
  <label class="busca">
    <span aria-hidden="true">🔍</span>
    <input
      class="taskia-campo"
      type="search"
      placeholder="Buscar tarefas…  ( / )"
      bind:value={busca}
      bind:this={buscaEl}
      aria-label="Buscar tarefas"
    />
  </label>
  <select class="taskia-campo" bind:value={dono} aria-label="Filtrar por dono">
    <option value="todas">todos</option>
    <option value="ia">🤖 IA</option>
    <option value="humano">🧑 humano</option>
  </select>
  <select class="taskia-campo" bind:value={prio} aria-label="Filtrar por prioridade">
    <option value="todas">todas</option>
    <option value="P0">P0</option>
    <option value="P1">P1</option>
    <option value="P2">P2</option>
    <option value="P3">P3</option>
  </select>
  <ul class="contadores" aria-label="Tarefas por coluna">
    {#each contadores as c (c.id)}
      <li><i style="background: {c.cor}" aria-hidden="true"></i>{c.label}<strong>{c.total}</strong></li>
    {/each}
  </ul>
  <form
    class="criar"
    onsubmit={(e) => {
      e.preventDefault();
      onCriar();
    }}
  >
    <input
      class="taskia-campo"
      type="text"
      placeholder="Nova tarefa… título  ( c )"
      bind:value={novoTitulo}
      bind:this={criarEl}
      aria-label="Título da nova tarefa"
    />
    <button class="taskia-btn taskia-btn-primario" type="submit" disabled={criando || novoTitulo.trim().length < 3}>
      + Criar
    </button>
  </form>
</section>

{#if vazio}
  <div class="vazio">
    <p class="vazio-icone" aria-hidden="true">🗂️</p>
    <p><strong>Nada por aqui.</strong> Ajuste os filtros ou crie uma tarefa.</p>
    <button class="taskia-btn" onclick={onLimpar}>Limpar filtros</button>
  </div>
{/if}

<style>
  .topo {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 12px;
  }
  .marca {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .logo {
    font-size: 28px;
    color: var(--st-pronto);
    line-height: 1;
  }
  .marca h1 {
    margin: 0;
    font-size: 20px;
    letter-spacing: -0.01em;
  }
  .marca p {
    margin: 2px 0 0;
    font-size: 12px;
    color: var(--text-2);
  }
  .painel {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    align-items: center;
    background: var(--bg-1);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 10px 12px;
    margin-bottom: 16px;
  }
  .busca {
    display: flex;
    align-items: center;
    gap: 8px;
    flex: 1 1 200px;
    min-width: 180px;
  }
  .busca input {
    flex: 1;
    min-width: 0;
  }
  .contadores {
    display: flex;
    gap: 4px;
    flex-wrap: wrap;
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .contadores li {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: var(--text-2);
    background: var(--bg-2);
    border: 1px solid var(--border);
    border-radius: 999px;
    padding: 4px 10px;
    white-space: nowrap;
  }
  .contadores i {
    width: 8px;
    height: 8px;
    border-radius: 999px;
    flex: none;
  }
  .contadores strong {
    color: var(--text-1);
  }
  .criar {
    display: flex;
    gap: 8px;
    margin-left: auto;
    flex: 0 1 auto;
  }
  .criar input {
    min-width: 200px;
    flex: 1;
  }
  .toggle {
    display: flex;
    width: fit-content;
  }
  .toggle .taskia-btn {
    border-radius: 0;
  }
  .toggle .taskia-btn:first-child {
    border-radius: 8px 0 0 8px;
  }
  .toggle .taskia-btn:last-child {
    border-radius: 0 8px 8px 0;
  }
  .toggle .taskia-btn.ativo {
    background: var(--st-pronto);
    border-color: var(--st-pronto);
    color: #fff;
    font-weight: 600;
  }
  .vazio {
    text-align: center;
    padding: 56px 24px;
    background: var(--bg-1);
    border: 1px dashed var(--border);
    border-radius: 12px;
    color: var(--text-2);
  }
  .vazio-icone {
    font-size: 32px;
    margin: 0 0 8px;
  }
  .vazio p {
    margin: 0 0 16px;
  }
  @media (max-width: 720px) {
    .criar {
      margin-left: 0;
      width: 100%;
    }
    .topo {
      flex-wrap: wrap;
    }
  }
</style>
