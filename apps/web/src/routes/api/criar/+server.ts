import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import { json, type RequestHandler } from "@sveltejs/kit";
import { esqueletoNovaTarefa, nomeArquivo, resolverProjeto } from "@taskia/core";
import { carregarConfig, dirTarefas, listarArquivos } from "$lib/server/taskia.js";

const TIPOS = ["feature", "bug", "chore", "spike", "decisao"];
const PRIORIDADES = ["P0", "P1", "P2", "P3"];

export const POST: RequestHandler = async ({ request }) => {
  const body = (await request.json()) as { titulo?: unknown; tipo?: unknown; prioridade?: unknown; projeto?: unknown };
  if (typeof body.titulo !== "string" || body.titulo.trim().length < 3) {
    return json({ error: "VALIDATION: titulo (3+ caracteres) obrigatório." }, { status: 400 });
  }
  const cfg = await carregarConfig();
  if (cfg === null) return json({ error: "VALIDATION: config.yaml inválido." }, { status: 500 });
  const proj = resolverProjeto(typeof body.projeto === "string" ? body.projeto : "", cfg);
  if (!proj.ok) return json({ error: proj.error }, { status: 400 });
  const tipo = typeof body.tipo === "string" && TIPOS.includes(body.tipo) ? body.tipo : "feature";
  const prioridade =
    typeof body.prioridade === "string" && PRIORIDADES.includes(body.prioridade) ? body.prioridade : "P2";
  const existentes = await listarArquivos();
  const ids = existentes.map((e) => Number(e.task.frontmatter.id.slice(2, 5))).filter((n) => !Number.isNaN(n));
  const next = String(Math.max(0, ...ids) + 1).padStart(3, "0");
  const agora = new Date().toISOString();
  const titulo = body.titulo.trim();
  await writeFile(
    join(dirTarefas(), nomeArquivo(next, titulo)),
    esqueletoNovaTarefa(next, { titulo, tipo, prioridade, status: "inbox", projeto: proj.value }, agora),
    "utf8",
  );
  return json({ ok: true, id: `T-${next}` });
};
