import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import { json, type RequestHandler } from "@sveltejs/kit";
import { esqueletoNovaTarefa, nomeArquivo } from "@taskia/core";
import { dirTarefas, listarArquivos } from "$lib/server/taskia.js";

const TIPOS = ["feature", "bug", "chore", "spike", "decisao"];
const PRIORIDADES = ["P0", "P1", "P2", "P3"];

export const POST: RequestHandler = async ({ request }) => {
  const body = (await request.json()) as { titulo?: unknown; tipo?: unknown; prioridade?: unknown };
  if (typeof body.titulo !== "string" || body.titulo.trim().length < 3) {
    return json({ error: "VALIDATION: titulo (3+ caracteres) obrigatório." }, { status: 400 });
  }
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
    esqueletoNovaTarefa(next, { titulo, tipo, prioridade, status: "inbox" }, agora),
    "utf8",
  );
  return json({ ok: true, id: `T-${next}` });
};
