import { onDestroy, onMount } from "svelte";
import { invalidateAll } from "$app/navigation";
import type { KanbanInstanceApi } from "@svar-ui/svelte-kanban";
import type { Status, TaskFrontmatter } from "@taskia/core";
import { COLUNAS, FILTRO_VAZIO, filtrar, type CardView } from "$lib/board.js";

// Estado + ações do quadro compartilhados pelas rotas `/`, `/a` e `/b`.
// Instanciar no topo do `<script>` do componente: `const q = new Quadro(() => data.cards)`.
// `obterCards` é um getter para continuar reativo após `invalidateAll`.
export class Quadro {
  toast = $state<{ msg: string; ok: boolean } | null>(null);
  busca = $state(FILTRO_VAZIO.busca);
  dono = $state(FILTRO_VAZIO.dono);
  prio = $state(FILTRO_VAZIO.prioridade);
  novoTitulo = $state("");
  criando = $state(false);
  visao = $state<"kanban" | "lista">("kanban");
  aberta = $state<TaskFrontmatter | null>(null);
  corpoAberto = $state("");
  movendo = $state(false);
  erroMover = $state<string | null>(null);

  private toastTimer: ReturnType<typeof setTimeout> | null = null;

  readonly columns = COLUNAS.map((c) => ({
    id: c.id,
    label: c.label,
    css: `tk-col-${c.id}`,
    ...(c.limite > 0 ? { cardLimit: c.limite } : {}),
  }));

  constructor(private obterCards: () => CardView[]) {
    onMount(() => {
      window.addEventListener("taskia:abrir", this.aoAbrirEvento);
      return () => {
        window.removeEventListener("taskia:abrir", this.aoAbrirEvento);
      };
    });
    onDestroy(() => {
      if (this.toastTimer !== null) clearTimeout(this.toastTimer);
    });
  }

  get filtrados(): CardView[] {
    return filtrar(this.obterCards(), { busca: this.busca, dono: this.dono, prioridade: this.prio });
  }

  get contadores() {
    return COLUNAS.map((c) => ({ ...c, total: this.obterCards().filter((t) => t.status === c.id).length }));
  }

  get total(): number {
    return this.obterCards().length;
  }

  get abertas(): number {
    return this.obterCards().filter((t) => t.status !== "feito" && t.status !== "arquivado").length;
  }

  get cards() {
    return this.filtrados.map((t: CardView) => ({
      id: t.id,
      label: t.titulo,
      column: t.status,
      status: t.status,
      tipo: t.tipo,
      priority: t.prioridade,
      dono: t.responsavel ?? "—",
      clarity: t.clarity,
      bloqueadas: t.bloqueadas,
    }));
  }

  mostrarToast(msg: string, ok: boolean): void {
    if (this.toastTimer !== null) {
      clearTimeout(this.toastTimer);
      this.toastTimer = null;
    }
    this.toast = { msg, ok };
    this.toastTimer = setTimeout(() => {
      this.toast = null;
      this.toastTimer = null;
    }, 4000);
  }

  async criar(): Promise<void> {
    if (this.novoTitulo.trim().length < 3 || this.criando) return;
    this.criando = true;
    const r = await fetch("/api/criar", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ titulo: this.novoTitulo.trim() }),
    });
    this.criando = false;
    if (!r.ok) {
      const corpo = (await r.json()) as { error?: unknown };
      this.mostrarToast(typeof corpo.error === "string" ? corpo.error : "Falha ao criar.", false);
      return;
    }
    const criado = (await r.json()) as { id?: unknown };
    this.novoTitulo = "";
    this.mostrarToast(`${typeof criado.id === "string" ? criado.id : "Tarefa"} criada ✓`, true);
    await invalidateAll();
  }

  async mover(id: string, para: string): Promise<string | null> {
    const r = await fetch("/api/mover", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ id, para }),
    });
    if (!r.ok) {
      const corpo = (await r.json()) as { error?: unknown };
      const msg = typeof corpo.error === "string" ? corpo.error : "Falha ao mover.";
      this.mostrarToast(msg, false);
      await invalidateAll();
      return msg;
    }
    this.mostrarToast(`${id} → ${para} ✓`, true);
    await invalidateAll();
    return null;
  }

  async abrir(id: string): Promise<void> {
    this.erroMover = null;
    const r = await fetch(`/api/tarefa/${id}`);
    if (!r.ok) {
      this.mostrarToast(`Tarefa ${id} não encontrada.`, false);
      return;
    }
    const detalhe = (await r.json()) as { frontmatter: TaskFrontmatter; corpo: string };
    this.aberta = detalhe.frontmatter;
    this.corpoAberto = detalhe.corpo;
  }

  fechar(): void {
    this.aberta = null;
    this.corpoAberto = "";
    this.erroMover = null;
  }

  async moverDaDrawer(para: Status): Promise<void> {
    const atual = this.aberta;
    if (atual === null) return;
    this.movendo = true;
    this.erroMover = null;
    const falha = await this.mover(atual.id, para);
    this.movendo = false;
    this.erroMover = falha;
    if (falha !== null) return;
    await this.abrir(atual.id);
  }

  limparFiltros(): void {
    this.busca = FILTRO_VAZIO.busca;
    this.dono = FILTRO_VAZIO.dono;
    this.prio = FILTRO_VAZIO.prioridade;
  }

  observarMoves(api: KanbanInstanceApi): void {
    api.on("move-card", (ev) => {
      // Fronteira sem tipos estritos (payload união da lib): estreita uma vez aqui.
      const p = ev as { id?: unknown; column?: unknown };
      if (typeof p.id !== "string" && typeof p.id !== "number") return;
      void this.mover(String(p.id), typeof p.column === "string" ? p.column : "");
    });
  }

  private aoAbrirEvento = (e: Event): void => {
    if (!(e instanceof CustomEvent)) return;
    if (typeof e.detail !== "string" || e.detail === "") return;
    void this.abrir(e.detail);
  };
}
