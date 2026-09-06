import { parse } from "yaml";
import type { Result, Task, TaskFrontmatter } from "./types.js";

const FRONTMATTER_RE = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
const ESTIMATIVA_Q_RE = /^(estimativa): \?\s*$/m;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((v): v is string => typeof v === "string");
}

function toQuality(raw: unknown): TaskFrontmatter["quality"] {
  const q = isRecord(raw) ? raw : {};
  return {
    status: (q["status"] ?? "pendente") as TaskFrontmatter["quality"]["status"],
    relatorio: typeof q["relatorio"] === "string" ? q["relatorio"] : "",
  };
}

function toSlop(raw: unknown): TaskFrontmatter["slop"] {
  if (!isRecord(raw)) return undefined;
  return {
    score: typeof raw["score"] === "number" ? raw["score"] : 0,
    perfil: typeof raw["perfil"] === "string" ? raw["perfil"] : "v1",
  };
}

function toFrontmatter(raw: Record<string, unknown>): Result<TaskFrontmatter> {
  const id = typeof raw["id"] === "string" ? raw["id"] : "";
  const titulo = typeof raw["titulo"] === "string" ? raw["titulo"] : "";
  if (id === "") return { ok: false, error: "VALIDATION: id obrigatório" };
  if (titulo === "") return { ok: false, error: "VALIDATION: titulo obrigatório" };

  return {
    ok: true,
    value: {
      id,
      titulo,
      status: (raw["status"] ?? "inbox") as TaskFrontmatter["status"],
      tipo: (raw["tipo"] ?? "feature") as TaskFrontmatter["tipo"],
      prioridade: (raw["prioridade"] ?? "P2") as TaskFrontmatter["prioridade"],
      responsavel: typeof raw["responsavel"] === "string" ? raw["responsavel"] : null,
      criado_em: typeof raw["criado_em"] === "string" ? raw["criado_em"] : "",
      atualizado_em: typeof raw["atualizado_em"] === "string" ? raw["atualizado_em"] : "",
      versao: typeof raw["versao"] === "number" ? raw["versao"] : 1,
      estimativa: typeof raw["estimativa"] === "string" ? raw["estimativa"] : "?",
      dependencias: toStringArray(raw["dependencias"]),
      tags: toStringArray(raw["tags"]),
      arquivos_relevantes: toStringArray(raw["arquivos_relevantes"]),
      clarity_score: typeof raw["clarity_score"] === "number" ? raw["clarity_score"] : 0,
      quality: toQuality(raw["quality"]),
      slop: toSlop(raw["slop"]),
    },
  };
}

function parseYaml(frontmatterRaw: string): Result<unknown> {
  try {
    return { ok: true, value: parse(frontmatterRaw.replace(ESTIMATIVA_Q_RE, '$1: "?"')) };
  } catch {
    return { ok: false, error: "VALIDATION: frontmatter YAML inválido" };
  }
}

export function parseTask(markdown: string): Result<Task> {
  const match = FRONTMATTER_RE.exec(markdown.trim());
  // Grupo 1 sempre participa quando há match (marcadores literais exigidos) —
  // ramo undefined inalcançável por construção; equivalente a allowlist (docs/09).
  /* v8 ignore next 3 */
  if (!match?.[1]) return { ok: false, error: "VALIDATION: frontmatter ausente (bloco --- inicial)" };
  /* v8 ignore next 1 -- grupo 2 ([\s\S]*) sempre participa; ?? é defesa contra mudança da regex */
  const corpo = (match[2] ?? "").trim();

  const yaml = parseYaml(match[1]);
  if (!yaml.ok) return yaml;
  if (!isRecord(yaml.value)) return { ok: false, error: "VALIDATION: frontmatter precisa ser um mapa" };

  const frontmatter = toFrontmatter(yaml.value);
  if (!frontmatter.ok) return frontmatter;
  return { ok: true, value: { frontmatter: frontmatter.value, corpo } };
}
