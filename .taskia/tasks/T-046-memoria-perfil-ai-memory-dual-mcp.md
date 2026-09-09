---
id: T-046
titulo: Memoria por perfil com ai-memory (dual-MCP) + espelho Postgres
status: revisao
tipo: feature
prioridade: P1
projeto: dome
branch: "feat/T-046-memoria-perfil"
responsavel: ia-opencode
criado_em: 2026-09-09T01:53:00Z
atualizado_em: 2026-09-09T13:24:00Z
versao: 3
estimativa: M
dependencias: [T-043, T-045]
tags: [memoria, ai-memory, rag, isolamento]
arquivos_relevantes:
  - /home/zatty/dome/src/lib/server/memoria.ts
  - /home/zatty/dome/docs/memoria.md
  - /home/zatty/task/docs/13-ECOSSISTEMA-MEMORIA.md
clarity_score: 84
quality:
  status: passando
  relatorio: reports/T-046-quality.json
---

## Objetivo
Dar a cada perfil memória própria e isolada usando ai-memory como dono do conhecimento e Postgres como espelho quente.

## Contexto
Humano pediu: "vamos manter memória, e temos o ai-memory, será ótimo". Padrão TaskIA (docs/13 + piloto T-014): TaskIA/Dome dona do ESTADO, ai-memory dono do CONHECIMENTO. Surpresa: 1 scope ai-memory por perfil (`dome-<slug>`) = isolamento físico; recall sempre com project explícito + filtro perfil_id. Sem ai-memory no ar, tudo funciona degradado (só Postgres). Tipos: fatos, estilo (o que funcionou), episódios (posts que performaram), veto (o que nunca repetir).

## Escopo
- [x] memoria.ts: recentes/resumir/consolidar com filtro obrigatório perfil_id + testes (salvar/listar já existiam da T-043)
- [x] Integração ai-memory: ai-scope.ts (escopo dome-<slug> + doc + roteiro p/ runners MCP) + Postgres standalone como fallback
- [x] API GET memórias por perfil + placeholder timeline p/ Nemotron
- [x] consolidarAprendizado: após publicação, salva episódio auditável (episodio:<origem>)
- [x] docs/memoria.md: o que vai pra ai-memory vs Postgres vs nunca (chaves, PII)

## Fora de escopo
- Embedding pgvector (futuro, deixa embedding_ref), cron dispatcher (T-048), histórico Twitter (T-047)

## Critérios de aceite (Done)
- [x] Dado 2 perfis, quando busco memórias de A, então zero fato de B (teste isolamento Postgres; escopo ai-memory separado por slug)
- [x] Dado ai-memory fora do ar, quando salvo/busco, então funciona só com Postgres (design: Postgres standalone, MCP só nos runners)
- [x] Dado aprendizado, quando consolido, então 1 memória episodio:<origem> nova
- [x] Dado `bun run check` + coverage, quando rodam, então verdes (check 0, coverage 100%, knip 0, jscpd 0)

## Qualidade (obrigatório p/ feature/bug/chore com código, ver 09-QUALIDADE.md)
- [x] complexity: ciclomatica 4 (<22), cognitiva 8 (<22), halstead <50 (<80), loc 140 (<500)
- [x] coverage: 100% (meta 100%), crap <25 (<25), mutantes sobreviventes n/a (meta 0)
- [x] dead 0 (0), redundant 0 (0), any/unknown 0 (0)
- Relatório: `reports/T-046-quality.json`

## Plano (preenchido pela IA antes de codar)
1. CRUD memórias Postgres + testes isolamento
2. Adapter ai-memory por scope + fallback
3. UI timeline + consolidação pós-post

## Handoff para próxima IA
Concluído, em revisao. Commit 6ba6833 (git local, sem remote). Correção de clone no caminho: erroGuard() em http.ts. Próxima: T-047 histórico.

## Log
- 2026-09-09 (ia-opencode): criada via grill-me round 2, score 84.
- 2026-09-09T13:10:00Z : mover → refinando. Motivo: deps T-043/T-045 em feito.
- 2026-09-09T13:10:00Z : mover → pronto. Motivo: DoR ok (clarity 84>=70).
- 2026-09-09T13:10:00Z : mover → fazendo. Motivo: inicio memória dual-MCP. Desvio honesto: ai-memory é MCP-stdio p/ agentes — runtime TS não chama MCP; integração = contrato de escopo + roteiro p/ runners (T-048) + Postgres standalone.
- 2026-09-09T13:24:00Z : mover → revisao. Motivo: resumo/consolidação + contrato ai-scope + API memórias, 45 testes 100%, commit 6ba6833.
