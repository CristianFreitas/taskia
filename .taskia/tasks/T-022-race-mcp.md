---
id: T-022
titulo: Serializar writes concorrentes no MCP (race read-modify-write)
status: inbox
tipo: spike
prioridade: P2
responsavel: null
criado_em: 2026-09-06T00:00:00Z
atualizado_em: 2026-09-06T00:00:00Z
versao: 1
estimativa: M
dependencias: []
tags: [mcp, concorrencia]
arquivos_relevantes:
  - apps/mcp/src/index.ts
clarity_score: 80
quality:
  status: isento
  relatorio: ""
projeto: taskia
branch: ""
---

## Objetivo
Eliminar lost-update quando 2+ chamadas MCP gravam a mesma tarefa em paralelo.

## Contexto
Evidência no smoke da T-021: 4 requests pipelinados sem await — 2 writes concorrentes leram v1 e ambos gravaram v2 (um update perdido). Clientes MCP típicos chamam em sequência (risco baixo hoje), mas a visão multi-agente do produto exige correção. Padrões candidatos: fila/mutex por arquivo, lockfile com timeout, CAS via `versao_esperada` (otimista, sem lock).

## Escopo
- [ ] Reproduzir deterministicamente em board temporário
- [ ] Comparar fila vs lockfile vs CAS e escolher (critério: sem deadlock, erro legível, sem dependência nova)
- [ ] Implementar + testes + documentar no docs/05

## Fora de escopo
- Transações multi-arquivo, distributed lock, mudar protocolo MCP

## Critérios de aceite (Done)
- [ ] Dadas 2 escritas concorrentes na mesma tarefa, quando completam, então 0 lost-update (versões 2 e 3, nunca 2 e 2)
- [ ] Dado lock indisponível (se lockfile), quando expira o timeout, então erro legível, nunca hang

## Plano
1. Reproduzir + medir
2. Implementar a estratégia escolhida
3. Gates + smoke concorrente

## Handoff para próxima IA
Server stdio processa requests em paralelo (Bun async intercala nos awaits). `atualizar_tarefa`/`mover_tarefa`/`comentar_log`/`dividir_tarefa` fazem read-modify-write sem proteção.

## Log
- 2026-09-06 (ia-opencode): criada a partir do smoke da T-021 (score 80).
