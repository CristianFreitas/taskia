import type { Result, Tipo } from "./types.js";
import { slugify } from "./nova.js";

export const BRANCH_RE = /^(feat|fix|chore|docs|spike)\/T-\d+-[a-z0-9]+(?:-[a-z0-9]+)*$/;

const PREFIXO_POR_TIPO: Record<Tipo, "feat" | "fix" | "chore" | "docs" | "spike"> = {
  feature: "feat",
  bug: "fix",
  chore: "chore",
  spike: "spike",
  decisao: "docs",
};

export function sugerirBranch(tipo: Tipo, id: string, titulo: string): string {
  const slug = slugify(titulo);
  return `${PREFIXO_POR_TIPO[tipo]}/${id}-${slug === "" ? "tarefa" : slug}`;
}

export function validarBranch(branch: string): Result<string> {
  if (branch === "") return { ok: false, error: "VALIDATION: branch vazia. Preencha antes de ir p/ fazendo." };
  if (!BRANCH_RE.test(branch)) {
    return {
      ok: false,
      error: "VALIDATION: branch fora do padrão. Esperado: <feat|fix|chore|docs|spike>/T-XXX-slug-kebab (ex: feat/T-021-branch-por-tarefa).",
    };
  }
  return { ok: true, value: branch };
}
