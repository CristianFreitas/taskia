import type { QualityThresholds, Result, Task } from "./types.js";
import { DEFAULT_THRESHOLDS } from "./types.js";

export interface FileMetric {
  arquivo: string;
  ciclomatica: number;
  cognitiva: number;
  halstead: number;
  loc: number;
  coverage: number;
  crap: number;
}

export interface QualityReport {
  metricas: FileMetric[];
  mutantesSobreviventes: number;
  deadCode: number;
  clonesNovos: number;
  anyUnknown: number;
  slopScore: number;
}

export interface QualityFailure {
  metrica: string;
  detalhe: string;
}

export function verificarQuality(
  task: Task,
  report: QualityReport,
  thresholds: QualityThresholds = DEFAULT_THRESHOLDS,
): Result<Task> {
  if (task.frontmatter.quality.status === "isento") return { ok: true, value: task };

  const falhas: QualityFailure[] = [];
  for (const m of report.metricas) {
    if (m.ciclomatica >= thresholds.cyclomaticMax)
      falhas.push({ metrica: "ciclomatica", detalhe: `${m.arquivo}: ${m.ciclomatica} (max ${thresholds.cyclomaticMax})` });
    if (m.cognitiva >= thresholds.cognitiveMax)
      falhas.push({ metrica: "cognitiva", detalhe: `${m.arquivo}: ${m.cognitiva} (max ${thresholds.cognitiveMax})` });
    if (m.halstead >= thresholds.halsteadMax)
      falhas.push({ metrica: "halstead", detalhe: `${m.arquivo}: ${m.halstead} (max ${thresholds.halsteadMax})` });
    if (m.loc >= thresholds.locMax)
      falhas.push({ metrica: "loc", detalhe: `${m.arquivo}: ${m.loc} (max ${thresholds.locMax})` });
    if (m.coverage < thresholds.coverageMin)
      falhas.push({ metrica: "coverage", detalhe: `${m.arquivo}: ${m.coverage}% (min ${thresholds.coverageMin}%)` });
    if (m.crap >= thresholds.crapMax)
      falhas.push({ metrica: "crap", detalhe: `${m.arquivo}: ${m.crap} (max ${thresholds.crapMax})` });
  }
  if (report.mutantesSobreviventes > 0)
    falhas.push({ metrica: "mutantes", detalhe: `${report.mutantesSobreviventes} sobreviventes não-justificados` });
  if (report.deadCode > 0) falhas.push({ metrica: "dead", detalhe: `${report.deadCode} símbolos mortos` });
  if (report.clonesNovos > 0) falhas.push({ metrica: "redundant", detalhe: `${report.clonesNovos} clones novos` });
  if (report.anyUnknown > thresholds.anyUnknownMax)
    falhas.push({ metrica: "any_unknown", detalhe: `${report.anyUnknown} ocorrências (max 0)` });
  if (report.slopScore < thresholds.slopMin)
    falhas.push({ metrica: "slop", detalhe: `score ${report.slopScore} (min ${thresholds.slopMin})` });

  if (falhas.length > 0) {
    const detalhe = falhas.map((f) => `${f.metrica}: ${f.detalhe}`).join("; ");
    return { ok: false, error: `QUALIDADE_REPROVADA: ${detalhe}` };
  }
  return { ok: true, value: task };
}
