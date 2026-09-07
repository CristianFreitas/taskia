import { readdir, readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { parseConfig, parseTask, type ConfigTaskia, type Task } from "@taskia/core";
import { paraCard, type CardView } from "$lib/board.js";

function taskiaRoot(): string {
  return process.env["TASKIA_ROOT"] ?? resolve(process.cwd(), "..", "..", ".taskia");
}

export function dirTarefas(root: string = taskiaRoot()): string {
  return join(root, "tasks");
}

interface ArquivoTarefa {
  arquivo: string;
  raw: string;
  task: Task;
}

export async function listarArquivos(root: string = taskiaRoot()): Promise<ArquivoTarefa[]> {
  const dir = dirTarefas(root);
  const files = (await readdir(dir)).filter((f) => f.endsWith(".md")).sort();
  const saida: ArquivoTarefa[] = [];
  for (const f of files) {
    const arquivo = join(dir, f);
    const raw = await readFile(arquivo, "utf8");
    const parsed = parseTask(raw);
    if (!parsed.ok) continue;
    saida.push({ arquivo, raw, task: parsed.value });
  }
  return saida;
}

export async function salvar(arquivo: string, raw: string): Promise<void> {
  await writeFile(arquivo, raw, "utf8");
}

export async function carregarConfig(root: string = taskiaRoot()): Promise<ConfigTaskia | null> {
  try {
    const parsed = parseConfig(await readFile(join(root, "config.yaml"), "utf8"));
    return parsed.ok ? parsed.value : null;
  } catch {
    return null;
  }
}

export async function carregarBoard(
  root: string = taskiaRoot(),
): Promise<{ cards: CardView[]; projetos: ConfigTaskia["projetos"] }> {
  const [arquivos, cfg] = await Promise.all([listarArquivos(root), carregarConfig(root)]);
  const porId = new Map(arquivos.map((a) => [a.task.frontmatter.id, a.task.frontmatter.status]));
  const corDe = new Map((cfg?.projetos ?? []).map((p) => [p.id, p.cor] as const));
  const emFeito = (id: string): boolean => porId.get(id) === "feito";
  const cards = arquivos.map((a) => {
    const base = paraCard(a.task, emFeito);
    const proj = base.projeto !== "" ? base.projeto : (cfg?.projeto_padrao ?? "");
    return { ...base, projeto: proj, projetoCor: corDe.get(proj) ?? "#8A8F98" };
  });
  return { cards, projetos: cfg?.projetos ?? [] };
}
