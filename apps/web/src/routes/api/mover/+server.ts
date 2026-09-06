import { json, type RequestHandler } from "@sveltejs/kit";
import { aplicarMovimento, type Status } from "@taskia/core";
import { listarArquivos, salvar } from "$lib/server/taskia.js";

interface MoverBody {
  id?: unknown;
  para?: unknown;
  motivo?: unknown;
}

function eStatus(v: unknown): v is Status {
  return (
    v === "inbox" ||
    v === "refinando" ||
    v === "pronto" ||
    v === "fazendo" ||
    v === "revisao" ||
    v === "feito" ||
    v === "arquivado"
  );
}

export const POST: RequestHandler = async ({ request }) => {
  const body = (await request.json()) as MoverBody;
  if (typeof body.id !== "string") {
    return json({ error: "VALIDATION: id (string) obrigatório." }, { status: 400 });
  }
  const id: string = body.id;
  if (!eStatus(body.para)) {
    return json({ error: "VALIDATION: para (status válido) obrigatório." }, { status: 400 });
  }
  const motivo = typeof body.motivo === "string" && body.motivo !== "" ? body.motivo : "via web";
  const arquivos = await listarArquivos();
  const achada = arquivos.find((a) => a.task.frontmatter.id === id || a.arquivo.endsWith(`${id}.md`));
  if (!achada) return json({ error: `NAO_ENCONTRADO: ${id}` }, { status: 404 });
  const m = aplicarMovimento(achada.raw, body.para, motivo, new Date().toISOString(), true);
  if (!m.ok) return json({ error: m.error }, { status: 422 });
  await salvar(achada.arquivo, m.value.raw);
  return json({ ok: true, id, para: body.para, versao: m.value.versao });
};
