---
id: T-015
titulo: Sincronizar README com monorepo e fases atuais
status: feito
tipo: chore
prioridade: P2
responsavel: ia-opencode
criado_em: 2026-09-06T00:00:00Z
atualizado_em: 2026-09-06T00:00:00Z
versao: 6
estimativa: PP
dependencias: []
tags: [docs, readme]
arquivos_relevantes:
  - README.md
  - docs/08-ROADMAP.md
clarity_score: 88
quality:
  status: isento
  relatorio: ""
---

## Objetivo
README reflete o monorepo e as fases reais (sem "amanhã Fase 1" nem MCP futuro).

## Contexto
Piloto dual-MCP T-014: `memory_briefing` (70ms) + `memory_query` (304ms) revelaram que o ai-memory já é padrão na sales-platform (decisão 2026-09-03) — contexto que o README sozinho não daria. O README atual mente em 4 pontos: estrutura sem `packages/metrics`/`opencode.json`/componentes, fases no futuro, MCP "a implementar", próximo passo obsoleto.

## Escopo
- [ ] Estrutura: + `packages/metrics/`, `opencode.json`, componentes web, `docs/13`
- [ ] Fases no presente (Fase 1 e base da 2 prontas, com links)
- [ ] Mutação atual (core 84.77, metrics 87.88) e próximo passo real (aprovar revisao)

## Fora de escopo
- Reescrever docs/, mudar tom/voz, landing

## Critérios de aceite (Done)
- [ ] Dado README lido, quando comparo com o repo, então pacotes, componentes, fases e scores batem
- [ ] Dado `grep -i "amanhã\|quando formos codar" README.md`, quando rodo, então 0 matches

## Plano
1. Reescrever blocos Estrutura/Fases/Stack+Próximo passo
2. Grep de frases obsoletas + revisão humana

## Handoff para próxima IA
Veículo do piloto T-014. Gates automatizados não cobrem `.md` (jscpd ignora, lint não lê) — validação é revisão + grep. Quality `isento` com este motivo.

## Log
- 2026-09-06 (ia-opencode): criada no piloto T-014 (score 88).
- 2026-09-06 (ia-opencode): inbox → refinando → pronto (clarity 88, aceite testável, sem deps) → fazendo (veículo do piloto T-014).
- 2026-09-06 (ia-opencode): reescritos blocos Estrutura/Fases/Stack/Próximo passo; grep 0 obsoletos + 6 refs atuais; fazendo → revisao (quality isento: só `.md`, sem gates automatizados aplicáveis).
- 2026-09-06 (humano): aprovado em revisao (DoD ok); revisao → feito. Handoff: concluído.
