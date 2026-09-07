---
id: T-002
titulo: Corrigir WIP que não bloqueia movimento
status: arquivado
tipo: bug
prioridade: P1
projeto: taskia
responsavel: null
criado_em: 2026-09-05T09:00:00Z
atualizado_em: 2026-09-06T00:00:00Z
versao: 3
estimativa: P
dependencias: []
tags: [kanban, validacao]
arquivos_relevantes:
  - docs/05-MCP-API.md
clarity_score: 78
---

## Objetivo
Impedir mover pra `fazendo` quando o WIP da coluna estourou.

## Contexto
Hoje a regra existe no doc mas ninguém impõe. Na Fase 0 é manual, na Fase 1 o MCP deve retornar WIP_LOTADO.

## Escopo
- [ ] Documentar mensagem de erro esperada
- [ ] Cobrir caso: 3 em fazendo + tentar 4ª

## Fora de escopo
- WIP por responsável (já definido, só falta implementar)

## Critérios de aceite (Done)
- [ ] Dado 3 tarefas em fazendo, quando tento mover a 4ª, então recebo erro WIP_LOTADO com instrução

## Plano
1. Definir texto do erro
2. Testar manualmente no board.md

## Handoff para próxima IA
Tarefa refinada e pronta pra puxar. Boa primeira tarefa pra testar o fluxo fim-a-fim.

## Log
- 2026-09-05 09:30 (humano): refinada, score 78, movida pra pronto.
- 2026-09-06 (humano, via "finalize"): exemplo do scaffold aposentado — nunca foi trabalho real. Arquivo preservado como referência. pronto → arquivado.
