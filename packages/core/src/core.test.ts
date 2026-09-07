import { describe, expect, it } from "vitest";
import { avaliarClareza } from "../src/clarity.js";
import { parseTask } from "../src/parse-task.js";
import { verificarQuality } from "../src/quality.js";
import { avaliarArquivo, detectarFugaDeTipos, detectarObvios, detectarTextoSlop, slopScore } from "../src/slop.js";
import { allowedFrom, assertTransition, checkReady } from "../src/transitions.js";
import { aplicarMovimento } from "../src/mover.js";
import { esqueletoNovaTarefa, nomeArquivo, slugify } from "../src/nova.js";
import { parseConfig, resolverProjeto } from "../src/projetos.js";
import { sugerirBranch, validarBranch } from "../src/branch.js";
import type { Status } from "../src/types.js";

const BASE = `---
id: T-001
titulo: Implementar login com magic link
status: fazendo
tipo: feature
prioridade: P1
projeto: taskia
branch: feat/T-001-magic-link
responsavel: ia-opencode
criado_em: 2026-09-05T10:00:00Z
atualizado_em: 2026-09-05T12:00:00Z
versao: 3
estimativa: M
dependencias: []
tags: [auth]
arquivos_relevantes:
  - src/auth/login.ts
clarity_score: 85
quality:
  status: pendente
  relatorio: reports/T-001-quality.json
---

## Objetivo
Permitir login sem senha.

## Contexto
Reduz suporte.

## Escopo
- [ ] gerar token

## Fora de escopo
- social

## Critérios de aceite (Done)
- [ ] Dado e-mail válido, quando solicito link, então recebo e-mail

## Plano
1. token
2. endpoint

## Handoff
Nada pendente.

## Log
- 2026-09-05: criada.
`;

describe("parseTask", () => {
  it("parseia tarefa válida", () => {
    const r = parseTask(BASE);
    expect(r.ok).toBe(true);
    if (r.ok) {
      const f = r.value.frontmatter;
      expect(f.id).toBe("T-001");
      expect(f.titulo).toBe("Implementar login com magic link");
      expect(f.status).toBe("fazendo");
      expect(f.tipo).toBe("feature");
      expect(f.prioridade).toBe("P1");
      expect(f.projeto).toBe("taskia");
      expect(f.branch).toBe("feat/T-001-magic-link");
      expect(f.responsavel).toBe("ia-opencode");
      expect(f.versao).toBe(3);
      expect(f.estimativa).toBe("M");
      expect(f.tags).toEqual(["auth"]);
      expect(f.arquivos_relevantes).toEqual(["src/auth/login.ts"]);
      expect(f.clarity_score).toBe(85);
      expect(f.quality).toEqual({ status: "pendente", relatorio: "reports/T-001-quality.json" });
      expect(f.slop).toBeUndefined();
    }
  });
  it("preserva estimativa ? via sanitizador YAML", () => {
    const md = BASE.replace("estimativa: M", "estimativa: ?");
    const r = parseTask(md);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.frontmatter.estimativa).toBe("?");
  });
  it("rejeita sem frontmatter", () => {
    expect(parseTask("sem nada").ok).toBe(false);
  });
  it("rejeita yaml inválido", () => {
    expect(parseTask("---\n: [\n---\ncorpo").ok).toBe(false);
  });
  it("rejeita sem id", () => {
    expect(parseTask(BASE.replace("id: T-001", "id: ''")).ok).toBe(false);
  });
  it("rejeita sem titulo", () => {
    expect(parseTask(BASE.replace("Implementar login com magic link", "")).ok).toBe(false);
  });
  it("aplica defaults quando tipos vêm errados", () => {
    const md = `---
id: T-010
titulo: Tarefa com tipos errados
status: 42
tipo: 42
prioridade: 42
responsavel: 42
criado_em: 42
atualizado_em: 42
versao: muita
estimativa: 42
dependencias: solta
tags: solta
arquivos_relevantes: solta
branch: 42
clarity_score: alta
quality:
  status: 42
  relatorio: 42
slop:
  score: 90
  perfil: custom
---

## Objetivo
Cobrir ramos de default.
`;
    const parsed = parseTask(md);
    expect(parsed.ok).toBe(true);
    if (parsed.ok) {
      const f = parsed.value.frontmatter;
      expect(f.status).toBe(42 as never);
      expect(f.versao).toBe(1);
      expect(f.projeto).toBe("");
      expect(f.estimativa).toBe("?");
      expect(f.dependencias).toEqual([]);
      expect(f.branch).toBe("");
      expect(f.clarity_score).toBe(0);
      expect(f.slop?.score).toBe(90);
      expect(f.slop?.perfil).toBe("custom");
      expect(f.quality.status).toBe(42 as never);
      expect(f.quality.relatorio).toBe("");
    }
  });
  it("aceita transição para o mesmo status", () => {
    expect(assertTransition("pronto", "pronto").ok).toBe(true);
  });
  it("rejeita frontmatter escalar e quality fora do mapa", () => {
    expect(parseTask("---\nso texto solto\n---\ncorpo").ok).toBe(false);
    const q = parseTask(BASE.replace("quality:\n  status: pendente\n  relatorio: reports/T-001-quality.json", "quality: 42"));
    expect(q.ok).toBe(true);
    const noId = parseTask(BASE.replace("id: T-001", "id: 42"));
    expect(noId.ok).toBe(false);
  });
  it("aplica defaults de status/tipo/prioridade/quality quando ausentes", () => {
    const md = `---
id: T-011
titulo: Minima valida para defaults
quality: {}
---

## Objetivo
Cobrir ramos de default.
`;
    const parsed = parseTask(md);
    expect(parsed.ok).toBe(true);
    if (parsed.ok) {
      expect(parsed.value.frontmatter.status).toBe("inbox");
      expect(parsed.value.frontmatter.tipo).toBe("feature");
      expect(parsed.value.frontmatter.prioridade).toBe("P2");
      expect(parsed.value.frontmatter.quality.status).toBe("pendente");
      expect(parsed.value.frontmatter.responsavel).toBeNull();
    }
  });
});

describe("transitions", () => {
  it("permite pronto → fazendo", () => {
    expect(assertTransition("pronto", "fazendo").ok).toBe(true);
  });
  it("mensagens exatas por transição (mata if(false)/||)", () => {
    const casos: [Status, Status, string][] = [
      ["inbox", "fazendo", "refinamento"],
      ["fazendo", "feito", "revisão"],
      ["feito", "fazendo", "linkada"],
      ["pronto", "feito", "TRANSICAO_INVALIDA"],
      ["feito", "pronto", "TRANSICAO_INVALIDA"],
    ];
    for (const [from, to, esperado] of casos) {
      const r = assertTransition(from, to);
      expect(r.ok).toBe(false);
      if (!r.ok) expect(r.error).toContain(esperado);
    }
  });
  it("bloqueia inbox → fazendo com motivo", () => {
    const r = assertTransition("inbox", "fazendo");
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toContain("refinamento");
  });
  it("bloqueia fazendo → feito", () => {
    expect(assertTransition("fazendo", "feito").ok).toBe(false);
  });
  it("bloqueia feito → fazendo", () => {
    const r = assertTransition("feito", "fazendo");
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toContain("linkada");
  });
  it("bloqueia transição genérica inválida com código", () => {
    const r = assertTransition("feito", "pronto");
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toContain("TRANSICAO_INVALIDA");
  });
  it("checkReady exige clarity", () => {
    const parsed = parseTask(BASE.replace("clarity_score: 85", "clarity_score: 10"));
    expect(parsed.ok).toBe(true);
    if (parsed.ok) expect(checkReady(parsed.value, true).ok).toBe(false);
  });
  it("checkReady exige aceite", () => {
    const parsed = parseTask(BASE.replace("## Critérios de aceite (Done)", "## Nada"));
    expect(parsed.ok).toBe(true);
    if (parsed.ok) expect(checkReady(parsed.value, true).ok).toBe(false);
  });
  it("checkReady exige deps feitas", () => {
    const parsed = parseTask(BASE);
    expect(parsed.ok).toBe(true);
    if (parsed.ok) expect(checkReady(parsed.value, false).ok).toBe(false);
  });
  it("checkReady passa quando tudo ok", () => {
    const parsed = parseTask(BASE);
    expect(parsed.ok).toBe(true);
    if (parsed.ok) expect(checkReady(parsed.value, true).ok).toBe(true);
  });
});

describe("mover", () => {
  it("move válido, bump de versão e log", () => {
    const r = aplicarMovimento(BASE, "revisao", "testes ok", "2026-09-05T14:00:00Z", true);
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.value.de).toBe("fazendo");
      expect(r.value.para).toBe("revisao");
      expect(r.value.versao).toBe(4);
      expect(r.value.raw).toContain("status: revisao");
      expect(r.value.raw).toContain("versao: 4");
      expect(r.value.raw).toContain("Motivo: testes ok");
      expect(r.value.raw.split("## Log").length - 1).toBe(1);
    }
  });
  it("anexa ao Log existente ou cria a seção", () => {
    const semLog = BASE.split("## Log")[0];
    const r = aplicarMovimento(semLog ?? BASE, "revisao", "x", "2026-09-05T14:00:00Z", true);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.raw).toContain("## Log\n- 2026-09-05T14:00:00Z");
  });
  it("bloqueia transição ilegal e pronto sem ready", () => {
    expect(aplicarMovimento(BASE, "feito", "x", "2026-09-05T14:00:00Z", true).ok).toBe(false);
    expect(aplicarMovimento("lixo sem frontmatter", "revisao", "x", "2026-09-05T14:00:00Z", true).ok).toBe(false);
    const refinando = BASE.replace("status: fazendo", "status: refinando").replace("clarity_score: 85", "clarity_score: 10");
    const r = aplicarMovimento(refinando, "pronto", "x", "2026-09-05T14:00:00Z", true);
    expect(r.ok).toBe(false);
  });
  it("fazendo exige branch com sugestão", () => {
    const semBranch = BASE.replace("branch: feat/T-001-magic-link\n", "");
    const r = aplicarMovimento(semBranch.replace("status: fazendo", "status: pronto"), "fazendo", "x", "2026-09-05T14:00:00Z", true);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toContain("feat/T-001-implementar-login-com-magic-link");
    const ok = aplicarMovimento(BASE.replace("status: fazendo", "status: pronto"), "fazendo", "x", "2026-09-05T14:00:00Z", true);
    expect(ok.ok).toBe(true);
  });
});

describe("nova", () => {
  it("slug sem acento, sem pontas, com fallback", () => {
    expect(slugify("Implementar login com magic link")).toBe("implementar-login-com-magic-link");
    expect(slugify("Revisão rápida")).toBe("revisao-rapida");
    expect(slugify("!!!")).toBe("");
    expect(nomeArquivo("004", "!!!")).toBe("T-004-tarefa.md");
    expect(nomeArquivo("004", " cria X ")).toBe("T-004-cria-x.md");
  });
  it("esqueleto válido que o parse aceita", () => {
    const agora = "2026-09-05T15:00:00Z";
    const md = esqueletoNovaTarefa("007", { titulo: "Nova", tipo: "bug", prioridade: "P0", status: "inbox", projeto: "taskia", branch: "fix/T-007-nova" }, agora);
    expect(md).toContain("id: T-007");
    expect(md).toContain("prioridade: P0");
    expect(md).toContain("projeto: taskia");
    expect(md).toContain("branch: fix/T-007-nova");
    const p = parseTask(md);
    expect(p.ok).toBe(true);
    if (p.ok) expect(p.value.frontmatter.projeto).toBe("taskia");
    const semBranch = esqueletoNovaTarefa("008", { titulo: "Outra", tipo: "feature", prioridade: "P2", status: "inbox", projeto: "taskia" }, agora);
    expect(semBranch).toContain("branch: \n");
  });
});

describe("branch", () => {
  it("validarBranch exige formato", () => {
    const vazia = validarBranch("");
    expect(vazia.ok).toBe(false);
    if (!vazia.ok) expect(vazia.error).toContain("vazia");
    expect(validarBranch("main-errada").ok).toBe(false);
    expect(validarBranch("feat/T-1-X").ok).toBe(false);
    expect(validarBranch("feat/T-021-branch-por-tarefa")).toEqual({ ok: true, value: "feat/T-021-branch-por-tarefa" });
  });
  it("sugerirBranch por tipo com fallback", () => {
    expect(sugerirBranch("feature", "T-001", "Login magic")).toBe("feat/T-001-login-magic");
    expect(sugerirBranch("bug", "T-002", "WIP")).toBe("fix/T-002-wip");
    expect(sugerirBranch("chore", "T-003", "X")).toBe("chore/T-003-x");
    expect(sugerirBranch("spike", "T-004", "Y")).toBe("spike/T-004-y");
    expect(sugerirBranch("decisao", "T-005", "Z")).toBe("docs/T-005-z");
    expect(sugerirBranch("feature", "T-006", "!!!")).toBe("feat/T-006-tarefa");
  });
});

const CFG = `projetos:
  - { id: taskia, nome: "TaskIA", cor: "#6366F1" }
  - { id: site, nome: "Site", cor: "#10B981" }
projeto_padrao: taskia
`;

describe("projetos", () => {
  it("parseConfig válido", () => {
    const r = parseConfig(CFG);
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.value.projeto_padrao).toBe("taskia");
      expect(r.value.projetos.map((p) => p.id)).toEqual(["taskia", "site"]);
    }
  });
  it("parseConfig rejeita formas inválidas", () => {
    expect(parseConfig(": [").ok).toBe(false);
    expect(parseConfig("42").ok).toBe(false);
    expect(parseConfig("projetos: []\nprojeto_padrao: taskia\n").ok).toBe(false);
    expect(parseConfig("projetos:\n  - 42\nprojeto_padrao: taskia\n").ok).toBe(false);
    expect(parseConfig("projetos:\n  - { id: '', nome: X, cor: '#fff' }\nprojeto_padrao: ''\n").ok).toBe(false);
    expect(parseConfig("projetos:\n  - { id: a, nome: A, cor: '#fff' }\n  - { id: a, nome: B, cor: '#000' }\nprojeto_padrao: a\n").ok).toBe(false);
    expect(parseConfig("projetos:\n  - { id: a, nome: A, cor: '#fff' }\nprojeto_padrao: b\n").ok).toBe(false);
    expect(parseConfig("projetos:\n  - { id: a, nome: A, cor: '#fff' }\n").ok).toBe(false);
  });
  it("parseConfig aplica defaults de nome e cor", () => {
    const r = parseConfig("projetos:\n  - { id: x }\nprojeto_padrao: x\n");
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value.projetos[0]).toEqual({ id: "x", nome: "x", cor: "#8A8F98" });
  });
  it("resolverProjeto usa padrao, aceita conhecido e rejeita resto", () => {
    const cfg = parseConfig(CFG);
    expect(cfg.ok).toBe(true);
    if (!cfg.ok) return;
    expect(resolverProjeto("", cfg.value)).toEqual({ ok: true, value: "taskia" });
    expect(resolverProjeto("site", cfg.value)).toEqual({ ok: true, value: "site" });
    const r = resolverProjeto("narnia", cfg.value);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toContain("narnia");
  });
});

describe("quality", () => {
  it("aprova relatório verde", () => {
    const parsed = parseTask(BASE);
    expect(parsed.ok).toBe(true);
    if (parsed.ok) {
      const r = verificarQuality(parsed.value, {
        metricas: [{ arquivo: "a.ts", ciclomatica: 5, cognitiva: 4, halstead: 10, loc: 100, coverage: 100, crap: 5 }],
        mutantesSobreviventes: 0,
        deadCode: 0,
        clonesNovos: 0,
        anyUnknown: 0,
        slopScore: 90,
      });
      expect(r.ok).toBe(true);
    }
  });
  it("reprova cada gate", () => {
    const parsed = parseTask(BASE);
    expect(parsed.ok).toBe(true);
    if (parsed.ok) {
      const r = verificarQuality(parsed.value, {
        metricas: [{ arquivo: "a.ts", ciclomatica: 30, cognitiva: 30, halstead: 90, loc: 900, coverage: 50, crap: 40 }],
        mutantesSobreviventes: 2,
        deadCode: 1,
        clonesNovos: 1,
        anyUnknown: 3,
        slopScore: 10,
      });
      expect(r.ok).toBe(false);
      if (!r.ok) {
        expect(r.error).toContain("QUALIDADE_REPROVADA");
        expect(r.error).toContain("ciclomatica");
        expect(r.error).toContain("slop");
      }
    }
  });
  it("reprova exatamente na fronteira de cada métrica", () => {
    const parsed = parseTask(BASE);
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;
    const base = { mutantesSobreviventes: 0, deadCode: 0, clonesNovos: 0, anyUnknown: 0, slopScore: 90 };
    const verde = { arquivo: "a.ts", ciclomatica: 21, cognitiva: 21, halstead: 79, loc: 499, coverage: 100, crap: 24 };
    expect(verificarQuality(parsed.value, { ...base, metricas: [verde] }).ok).toBe(true);
    const casos: [string, Partial<typeof verde>][] = [
      ["ciclomatica", { ciclomatica: 22 }],
      ["cognitiva", { cognitiva: 22 }],
      ["halstead", { halstead: 80 }],
      ["loc", { loc: 500 }],
      ["coverage", { coverage: 99 }],
      ["crap", { crap: 25 }],
    ];
    for (const [metrica, patch] of casos) {
      const r = verificarQuality(parsed.value, { ...base, metricas: [{ ...verde, ...patch }] });
      expect(r.ok).toBe(false);
      if (!r.ok) expect(r.error).toContain(metrica);
    }
    expect(verificarQuality(parsed.value, { ...base, slopScore: 80, metricas: [verde] }).ok).toBe(true);
    expect(verificarQuality(parsed.value, { ...base, slopScore: 79, metricas: [verde] }).ok).toBe(false);
  });
  it("cada gate isolado reprova com seu nome (mata if(false))", () => {
    const parsed = parseTask(BASE);
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;
    const verde = { arquivo: "a.ts", ciclomatica: 5, cognitiva: 4, halstead: 10, loc: 100, coverage: 100, crap: 5 };
    const base = { metricas: [verde], deadCode: 0, clonesNovos: 0, anyUnknown: 0, slopScore: 90 };
    const casos: [string, Record<string, number>][] = [
      ["mutantes", { mutantesSobreviventes: 1 }],
      ["dead", { deadCode: 1 }],
      ["redundant", { clonesNovos: 1 }],
      ["any_unknown", { anyUnknown: 1 }],
    ];
    for (const [metrica, patch] of casos) {
      const r = verificarQuality(parsed.value, { ...base, mutantesSobreviventes: 0, ...patch });
      expect(r.ok).toBe(false);
      if (!r.ok) expect(r.error).toContain(metrica);
    }
  });
  it("isento passa direto", () => {
    const parsed = parseTask(BASE.replace("status: pendente", "status: isento"));
    expect(parsed.ok).toBe(true);
    if (parsed.ok) {
      const r = verificarQuality(parsed.value, {
        metricas: [],
        mutantesSobreviventes: 99,
        deadCode: 99,
        clonesNovos: 99,
        anyUnknown: 99,
        slopScore: 0,
      });
      expect(r.ok).toBe(true);
    }
  });
});

describe("clarity + slop", () => {
  it("clareza alta passa", () => {
    const parsed = parseTask(BASE);
    expect(parsed.ok).toBe(true);
    if (parsed.ok) {
      const c = avaliarClareza(parsed.value);
      expect(c.score).toBeGreaterThanOrEqual(70);
      expect(c.podeIrParaPronto).toBe(true);
    }
  });
  it("clareza baixa falha com lista", () => {
    const parsed = parseTask("---\nid: T-9\ntitulo: x\nstatus: inbox\ntipo: feature\nprioridade: P2\nresponsavel: null\ncriado_em: 2026-09-05T00:00:00Z\natualizado_em: 2026-09-05T00:00:00Z\nversao: 1\nestimativa: ?\ndependencias: []\ntags: []\narquivos_relevantes: []\nclarity_score: 10\nquality:\n  status: pendente\n  relatorio: reports/T-9-quality.json\n---\ncorpo vago");
    expect(parsed.ok).toBe(true);
    if (parsed.ok) {
      const c = avaliarClareza(parsed.value);
      expect(c.podeIrParaPronto).toBe(false);
      expect(c.faltando.length).toBeGreaterThan(0);
    }
  });
  it("clareza mede fronteiras exatas (mata mutantes de comparação)", () => {
    const scoreOf = (titulo: string, patch: (md: string) => string): number => {
      const parsed = parseTask(patch(BASE.replace("Implementar login com magic link", titulo)));
      expect(parsed.ok).toBe(true);
      if (!parsed.ok) return -1;
      return avaliarClareza(parsed.value).score;
    };
    const semArquivos = (md: string): string => md.replace("arquivos_relevantes:\n  - src/auth/login.ts", "arquivos_relevantes: []");
    expect(scoreOf("Um dois três", (md) => md)).toBe(100);
    expect(scoreOf("Um dois", (md) => md)).toBe(70);
    expect(scoreOf("Implementar login com magic link", (md) => md.replace("estimativa: M", "estimativa: ?"))).toBe(90);
    expect(scoreOf("Implementar login com magic link", semArquivos)).toBe(85);
  });
  it("2 palavras ainda passa no limite 70 (mata >= → >)", () => {
    const parsed = parseTask(BASE.replace("Implementar login com magic link", "Um dois"));
    expect(parsed.ok).toBe(true);
    if (parsed.ok) expect(avaliarClareza(parsed.value).podeIrParaPronto).toBe(true);
  });
  it("75 pontos com 2 faltando não vai pra pronto (mata && → ||)", () => {
    const md = BASE.replace("arquivos_relevantes:\n  - src/auth/login.ts", "arquivos_relevantes: []").replace(
      "estimativa: M",
      "estimativa: ?",
    );
    const parsed = parseTask(md);
    expect(parsed.ok).toBe(true);
    if (parsed.ok) {
      const c = avaliarClareza(parsed.value);
      expect(c.score).toBe(75);
      expect(c.podeIrParaPronto).toBe(false);
    }
  });
  it("aceite sem Dado/Quando/Então e escopo sem fora valem 0", () => {
    const semTeste = BASE.replace(
      "- [ ] Dado e-mail válido, quando solicito link, então recebo e-mail",
      "- [ ] teste passa",
    );
    const p1 = parseTask(semTeste);
    expect(p1.ok).toBe(true);
    if (p1.ok) expect(avaliarClareza(p1.value).score).toBe(75);
    const semFora = BASE.replace("## Fora de escopo", "## Quase fora");
    const p2 = parseTask(semFora);
    expect(p2.ok).toBe(true);
    if (p2.ok) expect(avaliarClareza(p2.value).score).toBe(80);
  });
  it("detecta comentário óbvio e fuga de tipos", () => {
    expect(detectarObvios(["// incrementa i", "const x = 1;"], "a.ts")).toHaveLength(1);
    expect(detectarFugaDeTipos("const x = y as any;", "a.ts")).toHaveLength(1);
    expect(detectarTextoSlop("Unlock potential", "a.svelte")).toHaveLength(1);
    expect(detectarTextoSlop("texto limpo", "a.svelte")).toHaveLength(0);
    expect(slopScore(100, [])).toBe(100);
    expect(slopScore(0, [])).toBe(100);
    expect(slopScore(10, detectarObvios(["// incrementa i"], "a.ts"))).toBeLessThan(100);
    expect(slopScore(10, detectarFugaDeTipos("const x = y as any;", "a.ts"))).toBeLessThan(100);
    expect(slopScore(1, [
      { tipo: "fuga_tipos", arquivo: "a.ts", linha: 1, sugestao: "x" },
      { tipo: "fuga_tipos", arquivo: "a.ts", linha: 2, sugestao: "x" },
    ])).toBe(0);
    expect(slopScore(100, [
      { tipo: "comentario_obvio", arquivo: "a.ts", linha: 1, sugestao: "x" },
      { tipo: "fuga_tipos", arquivo: "a.ts", linha: 2, sugestao: "x" },
    ])).toBe(80);
    expect(detectarObvios(["// Incrementa contador", "ok"], "a.ts")).toHaveLength(1);
    expect(detectarFugaDeTipos("const x = y as  any;", "a.ts")).toHaveLength(1);
    expect(detectarObvios(["// incrementa i // slop-allow: define padrão"], "a.ts")).toHaveLength(0);
    expect(detectarFugaDeTipos("const x = y as any; // slop-allow: falso positivo", "a.ts")).toHaveLength(0);
    expect(detectarTextoSlop("Unlock // slop-allow: define lista", "a.ts")).toHaveLength(0);
  });
  it("parseia slop com defaults quando tipos errados", () => {
    const parsed = parseTask(BASE.replace("clarity_score: 85", "clarity_score: 85\nslop:\n  score: alto\n  perfil: 42"));
    expect(parsed.ok).toBe(true);
    if (parsed.ok) {
      expect(parsed.value.frontmatter.slop?.score).toBe(0);
      expect(parsed.value.frontmatter.slop?.perfil).toBe("v1");
    }
  });
  it("allowedFrom expõe transições", () => {
    expect(allowedFrom("pronto")).toContain("fazendo");
    expect(allowedFrom("feito")).toContain("arquivado");
  });
  it("avaliarArquivo agrega achados e score", () => {
    const limpo = avaliarArquivo("ok.ts", "export const x = 1;\n");
    expect(limpo.score).toBe(100);
    expect(limpo.achados).toEqual([]);
    const sujo = avaliarArquivo("a.ts", "// incrementa i\nconst x = y as any;\n");
    expect(sujo.score).toBeLessThan(80);
    expect(sujo.achados.length).toBe(2);
  });
});
