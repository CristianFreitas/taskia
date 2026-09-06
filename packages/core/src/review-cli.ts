#!/usr/bin/env bun
import { readFile } from "node:fs/promises";
import { avaliarArquivo } from "./slop.js";

const MIN = Number(process.env["TASKIA_SLOP_MIN"] ?? 80);
// *.test.ts são dados do próprio detector (strings de teste idênticas a violações
// por construção) — gate de teste é coverage+mutação, não slop. Passe --include-tests p/ auditar.
const incluirTestes = process.argv.includes("--include-tests");
const arquivos = process.argv.slice(2).filter((a) => !a.startsWith("--") && (incluirTestes || !a.endsWith(".test.ts")));
if (arquivos.length === 0) {
  console.error("uso: review-cli.ts <arquivo...>");
  process.exit(2);
}

let pior = 100;
for (const arquivo of arquivos) {
  const conteudo = await readFile(arquivo, "utf8");
  const av = avaliarArquivo(arquivo, conteudo);
  pior = Math.min(pior, av.score);
  console.log(`${av.score} ${av.arquivo}`);
  for (const a of av.achados) console.log(`  L${a.linha} [${a.tipo}] ${a.sugestao}`);
}
if (pior < MIN) {
  console.error(`SLOP_REPROVADO: pior score ${pior} < min ${MIN}`);
  process.exit(1);
}
console.log(`SLOP_OK: pior score ${pior} >= min ${MIN}`);
