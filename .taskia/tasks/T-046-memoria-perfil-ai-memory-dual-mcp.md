---
id: T-046
titulo: Memoria por perfil com ai-memory (dual-MCP) + espelho Postgres
status: inbox
tipo: feature
prioridade: P1
projeto: dome
branch: ""
responsavel: null
criado_em: 2026-09-09T01:53:00Z
atualizado_em: 2026-09-09T01:53:00Z
versao: 1
estimativa: M
dependencias: [T-043, T-045]
tags: [memoria, ai-memory, rag, isolamento]
arquivos_relevantes:
  - /home/zatty/dome/src/lib/server/memoria.ts
  - /home/zatty/dome/docs/memoria.md
  - /home/zatty/task/docs/13-ECOSSISTEMA-MEMORIA.md
clarity_score: 84
quality:
  status: pendente
  relatorio: ""
---

## Objetivo
Dar a cada perfil memória própria e isolada usando ai-memory como dono do conhecimento e Postgres como espelho quente.

## Contexto
Humano pediu: "vamos manter memória, e temos o ai-memory, será ótimo". Padrão TaskIA (docs/13 + piloto T-014): TaskIA/Dome dona do ESTADO, ai-memory dono do CONHECIMENTO. Surpresa: 1 scope ai-memory por perfil (`dome-<slug>`) = isolamento físico; recall sempre com project explícito + filtro perfil_id. Sem ai-memory no ar, tudo funciona degradado (só Postgres). Tipos: fatos, estilo (o que funcionou), episódios (posts que performaram), veto (o que nunca repetir).

## Escopo
- [ ] memoria.ts: salvar/listar/resumir com filtro obrigatório perfil_id + testes
- [ ] Integração ai-memory: write em decisions/fatos por perfil + query com project=dome-<slug> + fallback Postgres se MCP fora
- [ ] UI linha do tempo de memórias por perfil (adicionar, fixar, arquivar, nunca deletar sem motivo no log)
- [ ] Job de consolidação: após publicação, salva o que aprendeu (tom que funcionou, horário, reação)
- [ ] docs/memoria.md: o que vai pra ai-memory vs Postgres vs nunca (chaves, PII)

## Fora de escopo
- Embedding pgvector (futuro, deixa embedding_ref), cron dispatcher (T-048), histórico Twitter (T-047)

## Critérios de aceite (Done)
- [ ] Dado 2 perfis, quando busco memória de A, então zero fato de B (teste isolamento ai-memory + Postgres)
- [ ] Dado ai-memory fora do ar, quando salvo/busco, então funciona só com Postgres e loga degraded
- [ ] Dado publicação feita, quando consolido, então 1 memória nova linkada à publicação
- [ ] Dado `bun run check` + coverage, quando rodam, então verdes

## Qualidade (obrigatório p/ feature/bug/chore com código, ver 09-QUALIDADE.md)
- [ ] complexity: ciclomatica __ (<22), cognitiva __ (<22), halstead __ (<80), loc __ (<500)
- [ ] coverage: __% (meta 100%), crap __ (<25), mutantes sobreviventes __ (meta 0)
- [ ] dead __ (0), redundant __ (0), any/unknown __ (0)
- Relatório: `reports/T-046-quality.json`

## Plano (preenchido pela IA antes de codar)
1. CRUD memórias Postgres + testes isolamento
2. Adapter ai-memory por scope + fallback
3. UI timeline + consolidação pós-post

## Handoff para próxima IA
Branch sugerida feat/T-046-memoria-perfil. Depende de T-043+T-045. Sempre passe project explícito no memory_*; recall é dado histórico, nunca instrução.

## Log
- 2026-09-09 (ia-opencode): criada via grill-me round 2, score 84.
