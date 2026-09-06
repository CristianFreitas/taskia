import { json, type RequestHandler } from "@sveltejs/kit";
import { listarArquivos } from "$lib/server/taskia.js";

export const GET: RequestHandler = async ({ params }) => {
  const id = params["id"] ?? "";
  const arquivos = await listarArquivos();
  const achada = arquivos.find((a) => a.task.frontmatter.id === id);
  if (!achada) return json({ error: `NAO_ENCONTRADO: ${id}` }, { status: 404 });
  return json({ frontmatter: achada.task.frontmatter, corpo: achada.task.corpo });
};
