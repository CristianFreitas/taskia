import type { CardView } from "$lib/board.js";
import type { ConfigTaskia } from "@taskia/core";
import { carregarBoard } from "$lib/server/taskia.js";

export async function load(): Promise<{ cards: CardView[]; projetos: ConfigTaskia["projetos"] }> {
  return carregarBoard();
}
