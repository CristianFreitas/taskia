import { readdir, readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { parseTask, type Task } from "@taskia/core";
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

export async function carregarBoard(root: string = taskiaRoot()): Promise<{ cards: CardView[] }> {
  const arquivos = await listarArquivos(root);
  const porId = new Map(arquivos.map((a) => [a.task.frontmatter.id, a.task.frontmatter.status]));
  return { cards: arquivos.map((a) => paraCard(a.task, (id) => porId.get(id) === "feito")) };
}
