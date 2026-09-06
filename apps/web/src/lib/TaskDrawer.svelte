<script lang="ts">
  import { onDestroy } from "svelte";
  import "../theme/taskia.css";
  import { allowedFrom, type Status, type TaskFrontmatter } from "@taskia/core";
  import { secoes } from "$lib/board.js";

  interface Props {
    frontmatter: TaskFrontmatter;
    corpo: string;
    movendo: boolean;
    erroMover: string | null;
    onFechar: () => void;
    onMover: (para: Status) => void;
  }
  let { frontmatter, corpo, movendo, erroMover, onFechar, onMover }: Props = $props();

  let destinos = $derived(allowedFrom(frontmatter.status));
  let partes = $derived(secoes(corpo));
  let copiado = $state<string | null>(null);
  let timer: ReturnType<typeof setTimeout> | null = null;

  onDestroy(() => {
    if (timer !== null) clearTimeout(timer);
  });

  function tecla(e: KeyboardEvent): void {
    if (e.key === "Escape") onFechar();
  }

  function classeQualidade(status: string): string {
    if (status === "passando") return "q qok";
    if (status === "isento") return "q qneutro";
    return "q qatencao";
  }

  function montarContexto(): string {
    const f = frontmatter;
    return `# ${f.id} — ${f.titulo}\n\n- status: ${f.status}\n- tipo: ${f.tipo}\n- prioridade: ${f.prioridade}\n- responsavel: ${f.responsavel ?? "—"}\n- clarity: ${f.clarity_score}\n\n${corpo}\n`;
  }

  async function copiar(): Promise<void> {
    if (timer !== null) {
      clearTimeout(timer);
      timer = null;
    }
    try {
      await navigator.clipboard.writeText(montarContexto());
      copiado = "copiado ✓";
    } catch {
      copiado = "clipboard indisponível neste navegador";
    }
    timer = setTimeout(() => {
      copiado = null;
      timer = null;
    }, 2000);
  }
</script>

<svelte:window onkeydown={tecla} />

<div class="overlay" role="presentation" onclick={onFechar}></div>
<aside class="drawer taskia-drawer-in" aria-label="Detalhe da tarefa {frontmatter.id}">
  <header>
    <div>
      <span class="id">{frontmatter.id}</span>
      <h2>{frontmatter.titulo}</h2>
      <p class="meta">
        {frontmatter.status} · {frontmatter.tipo} · {frontmatter.prioridade} ·
        {frontmatter.responsavel ?? "sem dono"} · clarity {frontmatter.clarity_score}
      </p>
    </div>
    <button class="fechar" onclick={onFechar} aria-label="Fechar">✕</button>
  </header>

  <section class="mover">
    <h3>Mover para</h3>
    <div class="botoes">
      {#each destinos as d (d)}
        <button class="taskia-btn" disabled={movendo} onclick={() => onMover(d)}>{d}</button>
      {/each}
    </div>
    {#if erroMover !== null}
      <p class="taskia-erro">{erroMover}</p>
    {/if}
  </section>

  <section>
    <h3>Qualidade</h3>
    <p class="meta">
      <span class={classeQualidade(frontmatter.quality.status)}>quality: {frontmatter.quality.status}</span>
      {#if frontmatter.slop}
        · slop {frontmatter.slop.score} ({frontmatter.slop.perfil})
      {/if}
    </p>
  </section>

  <section>
    <h3>Contexto p/ IA</h3>
    <button class="taskia-btn" onclick={() => void copiar()}>⧉ Copiar contexto</button>
    {#if copiado !== null}
      <p class="copiado">{copiado}</p>
    {/if}
  </section>

  {#each partes as s (s.titulo)}
    <section>
      <h3>{s.titulo}</h3>
      <p class="texto">{s.texto}</p>
    </section>
  {/each}
</aside>

<style>
  .overlay {
    position: fixed;
    inset: 0;
    background: rgb(0 0 0 / 55%);
    z-index: 40;
  }
  .drawer {
    position: fixed;
    top: 0;
    right: 0;
    width: min(440px, 94vw);
    height: 100vh;
    overflow-y: auto;
    background: var(--bg-1);
    border-left: 1px solid var(--border);
    z-index: 41;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  header {
    display: flex;
    justify-content: space-between;
    gap: 12px;
  }
  .id {
    font-family: "JetBrains Mono", monospace;
    font-size: 11px;
    color: var(--text-2);
  }
  h2 {
    margin: 4px 0;
    font-size: 18px;
    color: var(--text-1);
  }
  .meta {
    font-size: 12px;
    color: var(--text-2);
    margin: 0;
  }
  .fechar {
    background: none;
    border: 1px solid var(--border);
    color: var(--text-1);
    border-radius: 8px;
    height: 32px;
    min-width: 32px;
    cursor: pointer;
  }
  h3 {
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--text-2);
    margin: 0 0 8px;
  }
  .botoes {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  .q {
    font-weight: 700;
  }
  .qok {
    color: var(--st-feito);
  }
  .qneutro {
    color: var(--text-2);
  }
  .qatencao {
    color: var(--st-fazendo);
  }
  .copiado {
    font-size: 12px;
    color: var(--st-feito);
    margin: 8px 0 0;
  }
  .texto {
    white-space: pre-line;
    font-size: 13px;
    color: var(--text-1);
    margin: 0;
  }
</style>
