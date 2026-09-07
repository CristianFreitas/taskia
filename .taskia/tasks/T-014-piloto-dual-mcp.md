---
id: T-014
titulo: Pilotar dual-MCP TaskIA + ai-memory em 1 tarefa real
status: feito
tipo: spike
prioridade: P1
projeto: taskia
branch: main
responsavel: ia-opencode
criado_em: 2026-09-06T00:00:00Z
atualizado_em: 2026-09-06T00:00:00Z
versao: 5
estimativa: P
dependencias: []
tags: [ecossistema, memoria, spike]
arquivos_relevantes:
  - docs/13-ECOSSISTEMA-MEMORIA.md
  - opencode.json
  - AGENTS.md
clarity_score: 86
quality:
  status: isento
  relatorio: ""
---

## Objetivo
Validar na prática (1 tarefa real, timebox 1 dia) se o loop briefing → executar → consolidate economiza contexto sem vazar tokens.

## Contexto
Estudo docs/13 concluiu que vale acoplamento frouxo. Falta prova empírica antes de virar receita oficial. ai-memory 2.0.2 rodando em `http://127.0.0.1:49374` com 5001 observações; TaskIA com 10 tools. Tarefa-alvo sugerida: reexecutar algo pequeno (ex: ajuste visual) usando o loop completo.

## Escopo
- [x] Registrar `ai-memory` (remote HTTP) ao lado de `taskia` no cliente local (NÃO commitar endpoint localhost) — via HTTP direto no piloto (equivalente); nada commitado
- [x] Executar 1 tarefa real (T-015 README sync) com as pontes: briefing+query ao abrir; `write_page` explícito ao fechar (`consolidate` exige `session_id` próprio — desvio documentado)
- [x] Medir: 5 calls ai-memory, todas <400ms, 0 tokens LLM, 1 write rotulado + checkpoint git

## Fora de escopo
- Fundir projetos, código compartilhado, mudar `decisions.log.md`, Fase B/C

## Critérios de aceite (Done)
- [x] Dado o piloto concluído, quando leio o relatório, então há números (5 calls, 0 tokens, 1 recall crítico/3 hits) e veredito CONTINUA (receita em AGENTS.md §6)
- [x] Dado veredito positivo, quando abro AGENTS.md, então a receita dual-MCP está escrita em ≤10 linhas (8 linhas + link docs/13)
- [ ] Dado veredito negativo, quando leio docs/13, então há seção "não adotado" com motivo — n/a (veredito positivo)

## Plano
1. Registrar MCP + escolher tarefa-alvo pequena
2. Rodar o loop com as 5 pontes, anotando métricas
3. Escrever veredito (AGENTS.md ou docs/13) e fechar

## Handoff para próxima IA
Leia docs/13 inteiro antes. ai-memory tem 18 tools; use só `briefing/query/consolidate` no piloto. Não toque no `/data` direto — só via MCP.

## Log
- 2026-09-06 (ia-opencode): criada refinada do estudo docs/13 (score 86).
- 2026-09-06 (ia-opencode): refinando → pronto (clarity 86, sem deps) → fazendo (humano mandou seguir).
- 2026-09-06 (ia-opencode): piloto executado — briefing 70ms + query 304ms (hit crítico: ai-memory já é padrão na sales-platform, 2026-09-03); T-015 fim a fim; `write_page` decisions/taskia-ecossistema-2026-09-06.md + read-back OK; receita em AGENTS.md §6; fazendo → revisao. Handoff: concluído.
- 2026-09-06 (humano): aprovado em revisao (DoD ok); revisao → feito.
