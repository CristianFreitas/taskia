import type { Prioridade, Status, Task } from "@taskia/core";

interface Coluna {
  id: Status;
  label: string;
  limite: number;
  cor: string;
}

export const COLUNAS: Coluna[] = [
  { id: "inbox", label: "Inbox", limite: 0, cor: "#8A8F98" },
  { id: "refinando", label: "Refinando", limite: 5, cor: "#EAB308" },
  { id: "pronto", label: "Pronto", limite: 10, cor: "#3B82F6" },
  { id: "fazendo", label: "Fazendo", limite: 3, cor: "#F59E0B" },
  { id: "revisao", label: "Revisão", limite: 5, cor: "#8B5CF6" },
  { id: "feito", label: "Feito", limite: 0, cor: "#10B981" },
  { id: "arquivado", label: "Arquivado", limite: 0, cor: "#52525B" },
];

export function corStatus(status: string): string {
  return COLUNAS.find((c) => c.id === status)?.cor ?? "#8A8F98";
}

export function rotuloStatus(status: string): string {
  return COLUNAS.find((c) => c.id === status)?.label ?? status;
}

export interface CardView {
  id: string;
  titulo: string;
  status: Status;
  tipo: string;
  prioridade: Prioridade;
  responsavel: string | null;
  clarity: number;
  bloqueada: boolean;
  bloqueadas: string[];
}

interface Filtro {
  busca: string;
  dono: string;
  prioridade: string;
}

export const FILTRO_VAZIO: Filtro = { busca: "", dono: "todas", prioridade: "todas" };

function passaBusca(t: CardView, busca: string): boolean {
  if (busca.trim() === "") return true;
  return `${t.titulo} ${t.id}`.toLowerCase().includes(busca.trim().toLowerCase());
}

function passaDono(t: CardView, dono: string): boolean {
  if (dono === "todas") return true;
  const eIA = (t.responsavel ?? "").startsWith("ia-");
  return dono === "ia" ? eIA : !eIA;
}

export function filtrar(cards: CardView[], f: Filtro): CardView[] {
  return cards.filter(
    (t) =>
      passaBusca(t, f.busca) &&
      passaDono(t, f.dono) &&
      (f.prioridade === "todas" || t.prioridade === f.prioridade),
  );
}

const ORDEM_PRIO: Record<string, number> = { P0: 0, P1: 1, P2: 2, P3: 3 };
const ORDEM_STATUS = new Map(COLUNAS.map((c, i) => [c.id, i]));

export function ordenarParaLista(cards: CardView[]): CardView[] {
  return [...cards].sort((a, b) => {
    const pa = ORDEM_PRIO[a.prioridade] ?? 99;
    const pb = ORDEM_PRIO[b.prioridade] ?? 99;
    if (pa !== pb) return pa - pb;
    return (ORDEM_STATUS.get(a.status) ?? 99) - (ORDEM_STATUS.get(b.status) ?? 99);
  });
}

export function paraCard(task: Task, emFeito?: (id: string) => boolean): CardView {
  const f = task.frontmatter;
  const bloqueadas = emFeito ? f.dependencias.filter((d) => !emFeito(d)) : [];
  return {
    id: f.id,
    titulo: f.titulo,
    status: f.status,
    tipo: f.tipo,
    prioridade: f.prioridade,
    responsavel: f.responsavel,
    clarity: f.clarity_score,
    bloqueada: bloqueadas.length > 0,
    bloqueadas,
  };
}

interface Secao {
  titulo: string;
  texto: string;
}

export function secoes(corpo: string): Secao[] {
  const partes = corpo.split(/^## /m).map((p) => p.trim()).filter((p) => p !== "");
  return partes.map((p) => {
    const nl = p.indexOf("\n");
    if (nl < 0) return { titulo: p, texto: "" };
    return { titulo: p.slice(0, nl).trim(), texto: p.slice(nl + 1).trim() };
  });
}
