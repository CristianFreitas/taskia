import type { Task } from "./types.js";

export interface ClarityResult {
  score: number;
  faltando: string[];
  podeIrParaPronto: boolean;
}

export function avaliarClareza(task: Task): ClarityResult {
  const faltando: string[] = [];
  let score = 0;

  if (task.frontmatter.titulo.trim().split(/\s+/).length >= 3) score += 30;
  else faltando.push("objetivo não está em 1 frase com verbo de ação");

  const temAceiteTestavel = /dado .+, quando .+, então .+/i.test(task.corpo);
  if (task.corpo.includes("## Critérios de aceite") && temAceiteTestavel) score += 25;
  else faltando.push("aceite não testável (use Dado/Quando/Então)");

  if (task.corpo.includes("## Escopo") && task.corpo.includes("## Fora de escopo")) score += 20;
  else faltando.push("sem Escopo + Fora de escopo");

  if (task.frontmatter.arquivos_relevantes.length > 0 && task.corpo.includes("## Contexto")) score += 15;
  else faltando.push("sem contexto/arquivos relevantes");

  if (task.frontmatter.estimativa !== "?" && task.corpo.includes("## Plano")) score += 10;
  else faltando.push("sem estimativa + dependências mapeadas");

  return { score, faltando, podeIrParaPronto: score >= 70 && faltando.length <= 1 };
}
