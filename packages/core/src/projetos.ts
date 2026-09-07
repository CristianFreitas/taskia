import { parse } from "yaml";
import type { ConfigTaskia, Projeto, Result } from "./types.js";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function toProjeto(value: unknown): Result<Projeto> {
  if (!isRecord(value)) return { ok: false, error: "VALIDATION: projeto precisa ser um mapa {id, nome, cor}" };
  const { id, nome, cor } = value;
  if (typeof id !== "string" || id.trim() === "") {
    return { ok: false, error: "VALIDATION: todo projeto precisa de id não-vazio" };
  }
  return {
    ok: true,
    value: {
      id,
      nome: typeof nome === "string" && nome !== "" ? nome : id,
      cor: typeof cor === "string" && cor !== "" ? cor : "#8A8F98",
    },
  };
}

export function parseConfig(markdown: string): Result<ConfigTaskia> {
  let raw: unknown;
  try {
    raw = parse(markdown);
  } catch {
    return { ok: false, error: "VALIDATION: config YAML inválido" };
  }
  if (!isRecord(raw)) return { ok: false, error: "VALIDATION: config precisa ser um mapa" };
  if (!Array.isArray(raw["projetos"]) || raw["projetos"].length === 0) {
    return { ok: false, error: "VALIDATION: config precisa de projetos[] não-vazio" };
  }
  const projetos: Projeto[] = [];
  for (const p of raw["projetos"]) {
    const r = toProjeto(p);
    if (!r.ok) return r;
    projetos.push(r.value);
  }
  const ids = new Set(projetos.map((p) => p.id));
  if (ids.size !== projetos.length) {
    return { ok: false, error: "VALIDATION: ids de projeto duplicados no config" };
  }
  const padrao = typeof raw["projeto_padrao"] === "string" ? raw["projeto_padrao"] : "";
  if (!ids.has(padrao)) {
    return { ok: false, error: "VALIDATION: projeto_padrao precisa existir em projetos[]" };
  }
  return { ok: true, value: { projetos, projeto_padrao: padrao } };
}

export function resolverProjeto(projeto: string, cfg: ConfigTaskia): Result<string> {
  if (projeto === "") return { ok: true, value: cfg.projeto_padrao };
  if (cfg.projetos.some((p) => p.id === projeto)) return { ok: true, value: projeto };
  const ids = cfg.projetos.map((p) => p.id).join(", ");
  return { ok: false, error: `VALIDATION: projeto "${projeto}" não existe no config (projetos: ${ids})` };
}
