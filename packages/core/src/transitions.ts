import type { Result, Status, Task } from "./types.js";

const TRANSITIONS: Record<Status, readonly Status[]> = {
  inbox: ["refinando", "arquivado"],
  refinando: ["pronto", "inbox", "arquivado"],
  pronto: ["fazendo", "refinando", "arquivado"],
  fazendo: ["revisao", "pronto", "refinando", "arquivado"],
  revisao: ["feito", "fazendo", "arquivado"],
  feito: ["arquivado"],
  arquivado: [],
};

export function allowedFrom(from: Status): readonly Status[] {
  return TRANSITIONS[from];
}

export function assertTransition(from: Status, to: Status): Result<Status> {
  if (from === to) return { ok: true, value: to };
  if (TRANSITIONS[from].includes(to)) return { ok: true, value: to };
  if (from === "inbox" && to === "fazendo")
    return { ok: false, error: "TRANSICAO_INVALIDA: inbox → fazendo pula refinamento. Use inbox → refinando." };
  if (from === "fazendo" && to === "feito")
    return { ok: false, error: "TRANSICAO_INVALIDA: fazendo → feito pula revisão. Use fazendo → revisao." };
  if (from === "feito" && to === "fazendo")
    return { ok: false, error: "TRANSICAO_INVALIDA: feito é terminal. Crie nova tarefa linkada." };
  return { ok: false, error: `TRANSICAO_INVALIDA: ${from} → ${to} não permitido.` };
}

export function checkReady(task: Task, depsFeitas: boolean): Result<Task> {
  if (task.frontmatter.clarity_score < 70)
    return { ok: false, error: `VALIDATION: clarity ${task.frontmatter.clarity_score} < 70. Refine antes de pronto.` };
  if (!task.corpo.includes("## Critérios de aceite"))
    return { ok: false, error: "VALIDATION: sem Critérios de aceite. Tarefa não é executável." };
  if (!depsFeitas)
    return { ok: false, error: "DEPENDENCIA_PENDENTE: há dependência fora de feito." };
  return { ok: true, value: task };
}
