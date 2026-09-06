import type { Status } from "./types.js";

export function slugify(titulo: string): string {
  return titulo
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

export interface NovaTarefa {
  titulo: string;
  tipo: string;
  prioridade: string;
  status: Status;
}

export function nomeArquivo(next: string, titulo: string): string {
  const slug = slugify(titulo);
  return `T-${next}-${slug === "" ? "tarefa" : slug}.md`;
}

export function esqueletoNovaTarefa(next: string, t: NovaTarefa, agora: string): string {
  return `---\nid: T-${next}\ntitulo: ${t.titulo}\nstatus: ${t.status}\ntipo: ${t.tipo}\nprioridade: ${t.prioridade}\nresponsavel: null\ncriado_em: ${agora}\natualizado_em: ${agora}\nversao: 1\nestimativa: ?\ndependencias: []\ntags: []\narquivos_relevantes: []\nclarity_score: 20\nquality:\n  status: pendente\n  relatorio: reports/T-${next}-quality.json\n---\n\n## Objetivo\n${t.titulo}\n`;
}
