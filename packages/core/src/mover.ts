import type { Result, Status } from "./types.js";
import { parseTask } from "./parse-task.js";
import { assertTransition, checkReady } from "./transitions.js";
import { sugerirBranch, validarBranch } from "./branch.js";

export interface MovimentoOk {
  raw: string;
  de: Status;
  para: Status;
  versao: number;
}

export function aplicarMovimento(
  markdown: string,
  para: Status,
  motivo: string,
  agora: string,
  depsFeitas: boolean,
): Result<MovimentoOk> {
  const parsed = parseTask(markdown);
  if (!parsed.ok) return parsed;
  const de = parsed.value.frontmatter.status;
  const tr = assertTransition(de, para);
  if (!tr.ok) return tr;
  if (para === "pronto") {
    const ready = checkReady(parsed.value, depsFeitas);
    if (!ready.ok) return ready;
  }
  if (para === "fazendo") {
    const f = parsed.value.frontmatter;
    const vb = validarBranch(f.branch);
    if (!vb.ok) {
      const sugestao = sugerirBranch(f.tipo, f.id, f.titulo);
      return { ok: false, error: `${vb.error} Sugestão: "${sugestao}". Crie a branch e registre via atualizar_tarefa.` };
    }
  }
  const versao = parsed.value.frontmatter.versao + 1;
  const atualizado = markdown
    .replace(`status: ${de}`, `status: ${para}`)
    .replace(/versao: \d+/, `versao: ${versao}`)
    .replace(/atualizado_em: .*/, `atualizado_em: ${agora}`);
  const linha = `- ${agora} : mover → ${para}. Motivo: ${motivo}\n`;
  const raw = atualizado.includes("## Log") ? `${atualizado.trim()}\n${linha}` : `${atualizado.trim()}\n\n## Log\n${linha}`;
  return {
    ok: true,
    value: { raw, de, para, versao },
  };
}
