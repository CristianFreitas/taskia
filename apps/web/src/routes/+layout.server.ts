import type { CardView } from "$lib/board.js";
import { carregarBoard } from "$lib/server/taskia.js";

export async function load(): Promise<{ cards: CardView[] }> {
  return carregarBoard();
}
