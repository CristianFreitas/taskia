#!/usr/bin/env bun
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { deveAnalisar, verificarLimite } from "./cognitiva.js";

const MAX = Number(process.env["TASKIA_COGNITIVA_MAX"] ?? 22);
const IGNORAR_DIRS = new Set(["node_modules", "dist", "build", "coverage"]);

async function coletarArquivos(dir: string, out: string[]): Promise<void> {
  const entradas = await readdir(dir, { withFileTypes: true });
  for (const e of entradas) {
    if (e.name.startsWith(".") || IGNORAR_DIRS.has(e.name)) {
      continue;
    }
    const caminho = join(dir, e.name);
    if (e.isDirectory()) {
      await coletarArquivos(caminho, out);
    } else if (deveAnalisar(caminho)) {
      out.push(caminho);
    }
  }
}

const alvos = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const raizes = alvos.length > 0 ? alvos : ["packages", "apps"];
const arquivos: string[] = [];
for (const raiz of raizes) {
  await coletarArquivos(raiz, arquivos);
}
arquivos.sort();
if (arquivos.length === 0) {
  console.error("uso: check-cli.ts [dir...] (nenhum .ts encontrado)");
  process.exit(2);
}

let falhas = 0;
for (const arquivo of arquivos) {
  const conteudo = await readFile(arquivo, "utf8");
  const violacoes = verificarLimite(arquivo, conteudo, MAX);
  for (const v of violacoes) {
    console.log(`${v.arquivo}:${v.linha} ${v.nome} cognitiva ${v.cognitiva} >= max ${MAX}`);
    falhas += 1;
  }
}
if (falhas > 0) {
  console.error(`COGNITIVA_REPROVADA: ${falhas} função(ões) >= ${MAX}`);
  process.exit(1);
}
console.log(`COGNITIVA_OK: ${arquivos.length} arquivos, 0 violações (max ${MAX})`);
