---
id: T-004
titulo: Automatizar cognitive complexity no CI (sem sonarjs)
status: feito
tipo: chore
prioridade: P2
projeto: taskia
responsavel: ia-opencode
criado_em: 2026-09-05T02:00:00Z
atualizado_em: 2026-09-06T00:00:00Z
versao: 7
estimativa: P
dependencias: []
tags: [quality, ci]
arquivos_relevantes:
  - docs/09-QUALIDADE.md
  - packages/core/src/quality.ts
  - eslint.config.js
clarity_score: 85
quality:
  status: passando
  relatorio: ""
---

## Objetivo
Medir cognitive complexity <22 por função no CI sem depender de plugin quebrado.

## Contexto
sonarjs v2 crasha com ts-eslint v8 (puxa v7 interno, regra sanitize explode no Object.create). v3 exige eslint 10. escomplex/typhonjs mortos há 7 anos. Hoje o gate é manual (review + review:slop). Ver docs/09 linha do gate 2 e docs/11.

## Escopo
- [ ] Avaliar: oxlint tem regra? eslint-plugin alternativo mantido? walker próprio via oxc?
- [ ] Implementar check que falha o CI acima de 22
- [ ] Atualizar docs/09 (trocar ⚠️ por ferramenta)

## Fora de escopo
- Halstead automatizado (gate secundário, T-futura)
- Mudar threshold 22

## Critérios de aceite (Done)
- [ ] Dado função com cognitiva 22+, quando roda `bun run check`, então falha com arquivo:linha
- [ ] Dado repo atual, quando roda o check, então passa (código atual está abaixo)

## Plano
1. Listar regras de complexidade do oxlint instalado (`oxlint --rules`) e checar se há cognitiva; se houver, ligar com threshold 22 no `.oxlintrc.json`.
2. Senão, comparar `ast-grep` (scan com regra YAML) vs walker próprio via `oxc-parser`; escolher o mantido e sem `any`.
3. Implementar `bun run check:cognitiva` e fiar no `check` raiz (falha com `arquivo:linha` acima de 22).
4. Validar: repo atual passa; fixture com cognitiva 22+ falha apontando o local.
5. Atualizar `docs/09-QUALIDADE.md` (trocar ⚠️ do gate 2 pela ferramenta).

## Handoff para próxima IA
Contexto completo acima + docs/09 + docs/11. Comece listando candidatos (oxlint rules, ast-grep, walker oxc) e escolha o mantido.

## Qualidade (preenchido pela IA ao mover p/ revisao)
- [x] complexity: oxlint verde; walker com funções pequenas (dispatch ~8 ramos, resto 1-4)
- [x] coverage: metrics 100% (14 testes) · core 100% mantido · stryker metrics 87.88 ≥ 70
- [x] dead 0 (knip), redundant 0 (jscpd 0; configs por pacote ignoradas por decisão documentada em 09), any/unknown 0
- [x] `review:slop` 100 · `bun run check:cognitiva`: repo 24 arquivos 0 violações; fixture 66 falha com `arquivo:linha` (exit 1)
- Decisões de automação: pacote `packages/metrics` separado (fora do bundle web); `.svelte` fora do escopo v1 (documentado no cabeçalho de `cognitiva.ts`)

## Log
- 2026-09-05 (ia): criada a partir do scaffold (sonarjs removido por crash). Score 78.
- 2026-09-06 (ia-opencode): refinado de verdade — Plano preenchido em 5 passos, score 78 → 85, seções `## Log` duplicadas (artefato do bug T-010) unificadas; refinando → pronto.
- 2026-09-06 (ia-opencode): puxada de pronto (humano mandou finalizar); pronto → fazendo.
- 2026-09-06 (ia-opencode): implementado (`packages/metrics`: walker via API do TS + 14 testes + CLI fiada no `check`); oxlint sem regra cognitiva confirmado por fixture; docs/09 (gate 2 ✅) e docs/10 atualizados; fazendo → revisao.
- 2026-09-06 (humano): aprovado em revisao (DoD ok); revisao → feito. Handoff: concluído.
