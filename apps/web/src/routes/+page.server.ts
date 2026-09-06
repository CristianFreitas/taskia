import { paraCard, type CardView } from "$lib/board.js";
import { listarArquivos } from "$lib/server/taskia.js";

export async function load(): Promise<{ cards: CardView[] }> {
  const arquivos = await listarArquivos();
  const porId = new Map(arquivos.map((a) => [a.task.frontmatter.id, a.task.frontmatter.status]));
  return { cards: arquivos.map((a) => paraCard(a.task, (id) => porId.get(id) === "feito")) };
}
