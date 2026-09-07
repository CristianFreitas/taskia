export type Status =
  | "inbox"
  | "refinando"
  | "pronto"
  | "fazendo"
  | "revisao"
  | "feito"
  | "arquivado";

export type Tipo = "feature" | "bug" | "chore" | "spike" | "decisao";

export type Prioridade = "P0" | "P1" | "P2" | "P3";

export type QualityStatus = "pendente" | "passando" | "falhando" | "isento";

export interface QualityFrontmatter {
  status: QualityStatus;
  relatorio: string;
}

export interface SlopFrontmatter {
  score: number;
  perfil: string;
}

export interface TaskFrontmatter {
  id: string;
  titulo: string;
  status: Status;
  tipo: Tipo;
  prioridade: Prioridade;
  projeto: string;
  branch: string;
  responsavel: string | null;
  criado_em: string;
  atualizado_em: string;
  versao: number;
  estimativa: string;
  dependencias: string[];
  tags: string[];
  arquivos_relevantes: string[];
  clarity_score: number;
  quality: QualityFrontmatter;
  slop: SlopFrontmatter | undefined;
}

export interface Task {
  frontmatter: TaskFrontmatter;
  corpo: string;
}

export type Result<T, E = string> =
  | { ok: true; value: T }
  | { ok: false; error: E };

export interface Projeto {
  id: string;
  nome: string;
  cor: string;
}

export interface ConfigTaskia {
  projetos: Projeto[];
  projeto_padrao: string;
}

export interface QualityThresholds {
  cyclomaticMax: number;
  cognitiveMax: number;
  halsteadMax: number;
  locMax: number;
  coverageMin: number;
  crapMax: number;
  anyUnknownMax: number;
  slopMin: number;
}

export const DEFAULT_THRESHOLDS: QualityThresholds = {
  cyclomaticMax: 22,
  cognitiveMax: 22,
  halsteadMax: 80,
  locMax: 500,
  coverageMin: 100,
  crapMax: 25,
  anyUnknownMax: 0,
  slopMin: 80,
};
