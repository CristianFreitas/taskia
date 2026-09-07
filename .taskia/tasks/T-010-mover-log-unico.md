---
id: T-010
titulo: mover anexa ao ## Log existente em vez de duplicar
status: feito
tipo: bug
prioridade: P1
projeto: taskia
responsavel: ia-opencode
criado_em: 2026-09-06T00:00:00Z
atualizado_em: 2026-09-06T00:00:00Z
versao: 5
estimativa: PP
dependencias: []
tags: [core, mover]
arquivos_relevantes:
  - packages/core/src/mover.ts
  - packages/core/src/core.test.ts
clarity_score: 90
quality:
  status: passando
  relatorio: ""
---

## Objetivo
`aplicarMovimento` anexa a linha de mover ao `## Log` existente em vez de criar segunda seção.

## Contexto
Smoke manual em T-009 expôs: mover tarefa com `## Log` gerava `## Log` duplicado (MCP e web herdavam, pois ambos usam `aplicarMovimento`).

## Escopo
- [x] `mover.ts`: `includes("## Log")` → anexa linha; senão cria seção
- [x] Testes: contagem de `## Log` === 1 com Log existente; criação sem Log

## Fora de escopo
- Migrar arquivos já duplicados (só T-009, revertida à mão)

## Critérios de aceite (Done)
- [x] Dado doc com `## Log`, quando move, então há exatamente 1 seção e a linha nova no fim
- [x] Dado doc sem `## Log`, quando move, então seção criada com a linha

## Plano
1. Branch em `mover.ts` + 2 testes
2. Gates do core + stryker

## Handoff para próxima IA
Já implementado e verificado. Falta só aprovação humana p/ feito.

## Qualidade (preenchido pela IA ao mover p/ revisao)
- [x] complexity: oxlint verde; 1 branch a mais em função pequena
- [x] coverage: core 100% (40 testes) · stryker 84.77 ≥ 70
- [x] dead 0 (knip), redundant 0 (jscpd 0), any/unknown 0
- [x] `review:slop` 100

## Log
- 2026-09-06 (ia-opencode): criada (score 90) → pronto → fazendo (bug crítico de integridade, sem deps).
- 2026-09-06 (ia-opencode): implementado + testado; movida fazendo → revisao.
- 2026-09-06 (humano, via "finalize agora"): aprovado em revisao (DoD ok); revisao → feito. Handoff: concluído.
