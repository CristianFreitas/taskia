<script lang="ts">
  import type { KanbanCard } from "@svar-ui/svelte-kanban";
  import { corStatus, rotuloStatus } from "$lib/board.js";

  interface Props {
    card: KanbanCard;
  }
  let { card }: Props = $props();

  // Fronteira de lib de terceiros (KanbanCard tem índice `any`): estreita uma vez aqui.
  function texto(v: unknown, padrao = "—"): string {
    return typeof v === "string" && v !== "" ? v : padrao;
  }
  function numero(v: unknown): number | null {
    return typeof v === "number" ? v : null;
  }
  function lista(v: unknown): string[] {
    return Array.isArray(v) && v.every((x): x is string => typeof x === "string") ? v : [];
  }

  const PRIORIDADE_COR: Record<string, string> = {
    P0: "#EF4444",
    P1: "#F97316",
    P2: "#3B82F6",
    P3: "#A1A1AA",
  };

  let id = $derived(texto(card.id));
  let titulo = $derived(texto(card.label, "(sem título)"));  let status = $derived(texto(card.status, "inbox"));
  let tipo = $derived(texto(card.tipo, "feature"));
  let prioridade = $derived(texto(card.priority, "P2"));
  let responsavel = $derived(texto(card.dono, "—"));
  let clarity = $derived(numero(card.clarity));
  let bloqueadas = $derived(lista(card.bloqueadas));
  let bloqueada = $derived(bloqueadas.length > 0);
  let eIA = $derived(responsavel.startsWith("ia-"));
  let cor = $derived(corStatus(status));
  let rotulo = $derived(rotuloStatus(status));
  let corPrioridade = $derived(PRIORIDADE_COR[prioridade] ?? "#A1A1AA");

  let downX = $state(0);
  let downY = $state(0);

  function aoPressionar(e: PointerEvent): void {
    downX = e.clientX;
    downY = e.clientY;
  }

  function aoSoltar(e: PointerEvent): void {
    const dx = e.clientX - downX;
    const dy = e.clientY - downY;
    if (dx * dx + dy * dy > 36) return;
    abrir();
  }

  function abrir(): void {
    window.dispatchEvent(new CustomEvent<string>("taskia:abrir", { detail: id }));
  }

  function aoTeclar(e: KeyboardEvent): void {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      abrir();
    }
  }
</script>

<div
  class="card"
  class:bloqueado={bloqueada}
  style="--prio: {corPrioridade}"
  role="button"
  tabindex="0"
  aria-label="Abrir {id}: {titulo}"
  onpointerdown={aoPressionar}
  onpointerup={aoSoltar}
  onkeydown={aoTeclar}
>
  {#if bloqueada}
    <div class="faixa">🔴 aguarda {bloqueadas.join(", ")}</div>
  {/if}
  <header>
    <span class="id">{id}</span>
    {#if eIA}
      <span class="selo-ia">✨IA</span>
    {/if}
  </header>
  <h3>{titulo}</h3>
  <span class="dono-mini">{responsavel}</span>
  <div class="badges">
    <span class="badge" style="--st: {cor}">{rotulo}</span>
    <span class="tipo">{tipo}</span>
  </div>
  {#if clarity !== null}
    <div class="clarityline">
      <span class="clarity" class:baixa={clarity < 70}>clarity {clarity}</span>
      <div class="claritybar" role="img" aria-label="clarity {clarity} de 100">
        <span class:baixa={clarity < 70} style="width: {Math.min(100, Math.max(0, clarity))}%"></span>
      </div>
    </div>
  {/if}
  <footer>
    <span class="dono">{eIA ? "🤖" : "🧑"} {responsavel}</span>
    <span class="prio">{prioridade}</span>
  </footer>
</div>

<style>
  .card {
    background: var(--bg-2);
    border: 1px solid var(--border);
    border-left: 3px solid var(--prio);
    border-radius: 10px;
    padding: 10px 12px 11px;
    display: flex;
    flex-direction: column;
    gap: 7px;
    font-size: 13px;
    box-shadow: 0 1px 2px rgb(0 0 0 / 25%);
    transition: transform 150ms cubic-bezier(0.25, 1, 0.5, 1), box-shadow 150ms cubic-bezier(0.25, 1, 0.5, 1), border-color 150ms cubic-bezier(0.25, 1, 0.5, 1);
  }
  .card:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 18px rgb(0 0 0 / 40%);
    border-color: #3b445c;
  }
  .card:focus-visible {
    outline: 2px solid var(--st-pronto);
    outline-offset: 1px;
  }
  .card.bloqueado {
    border-color: var(--alerta);
  }
  .faixa {
    background: rgb(239 68 68 / 12%);
    border: 1px solid rgb(239 68 68 / 35%);
    color: #fca5a5;
    font-size: 11px;
    font-weight: 700;
    padding: 3px 8px;
    border-radius: 6px;
  }
  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .id {
    font-family: "JetBrains Mono", monospace;
    font-size: 11px;
    color: var(--text-2);
  }
  .dono-mini {
    display: none;
  }
  .selo-ia {
    background: linear-gradient(135deg, #8b5cf6, #6366f1);
    color: white;
    font-size: 10px;
    font-weight: 700;
    padding: 1px 6px;
    border-radius: 999px;
  }
  h3 {
    margin: 0;
    font-size: 13px;
    font-weight: 600;
    line-height: 1.45;
    color: var(--text-1);
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .badges {
    display: flex;
    gap: 6px;
    align-items: center;
    flex-wrap: wrap;
  }
  .badge {
    color: var(--st);
    border: 1px solid var(--st);
    border-radius: 999px;
    padding: 0 8px;
    font-size: 11px;
  }
  .tipo,
  .clarity {
    font-size: 11px;
    color: var(--text-2);
  }
  .clarity.baixa {
    color: #f59e0b;
    font-weight: 700;
  }
  .clarityline {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .clarityline .clarity {
    flex: none;
  }
  .claritybar {
    flex: 1;
    height: 4px;
    border-radius: 999px;
    background: var(--border);
    overflow: hidden;
  }
  .claritybar span {
    display: block;
    height: 100%;
    background: var(--st-feito);
  }
  .claritybar span.baixa {
    background: var(--st-fazendo);
  }
  footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 11px;
    color: var(--text-2);
    border-top: 1px solid var(--border);
    padding-top: 7px;
    margin-top: 1px;
  }
  .prio {
    font-weight: 700;
    color: var(--prio);
  }
</style>
