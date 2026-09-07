---
id: T-020
titulo: Separar quadro por projeto (multi-projeto no mesmo .taskia)
status: feito
tipo: feature
prioridade: P0
projeto: taskia
branch: main
responsavel: ia-opencode
criado_em: 2026-09-06T00:00:00Z
atualizado_em: 2026-09-06T00:00:00Z
versao: 5
estimativa: M
dependencias: []
tags: [core, mcp, web, modelo]
arquivos_relevantes:
  - packages/core/src/types.ts
  - packages/core/src/parse-task.ts
  - apps/mcp/src/index.ts
  - apps/web/src/lib/board.ts
  - .taskia/config.yaml
  - docs/03-FORMATO-TASK.md
clarity_score: 87
quality:
  status: passando
  relatorio: ""
---

## Objetivo
Tarefas pertencem a um projeto (`projeto: <id>`), com lista de projetos e cores no config e filtro na UI — sem misturar o taskia-dev com projetos novos.

## Contexto
Humano vai iniciar um projeto novo e o quadro hoje é plano: tudo cai no mesmo board sem dono-projeto. Decisão de desenho: sequência global `T-XXX` (links estáveis), campo `projeto` com default, `projetos:` + `projeto_padrao` no config. Migração: tarefas existentes ganham o projeto do repo atual.

## Escopo
- [ ] Core: `projeto: string` no frontmatter (default `projeto_padrao`), validação contra `projetos:` do config
- [ ] MCP: `criar_tarefa` aceita `projeto`; `listar_tarefas` filtra; `resumir_quadro` agrupa por projeto
- [ ] Web: badge/filtro por projeto (cor do config), DTO estendido
- [ ] `board.md`: cards com tag de projeto; migrar T-001..T-019 p/ projeto inicial
- [ ] Docs 03/04/05 atualizados (campo, DoR, tools)

## Fora de escopo
- Múltiplos `.taskia/` agregados, permissões por projeto, renomear IDs (T-XXX global permanece), UI de gerenciar projetos (só via config)

## Critérios de aceite (Done)
- [ ] Dada tarefa sem `projeto`, quando parseada, então assume o `projeto_padrao` sem erro
- [ ] Dado `projeto` inexistente, quando criado/movido via MCP, então erro `VALIDATION` legível
- [ ] Dado 2 projetos, quando abro `/`, então filtro por projeto funciona e badge mostra a cor
- [ ] Dado `board.md`, quando leio, então cada card tem tag de projeto

## Plano
1. Core (tipos, parse, validação + testes 100%)
2. MCP (3 tools + smoke)
3. Web (DTO, filtro, badge) + migração das tarefas + docs
4. Gates + build + smoke

## Handoff para próxima IA
`projeto_padrao` inicial sugerido: `taskia`. Cuidado com knip (tipos exportados com uso cruzado) e jscpd (não copie handlers MCP).

## Log
- 2026-09-06: criada refinada (score 87, pedido direto do humano antes do projeto novo).
- 2026-09-06 (ia-opencode): refinando → pronto (clarity 87, sem deps) → fazendo.
- 2026-09-06 (ia-opencode): implementado (core projetos.ts + frontmatter.projeto, MCP criar/listar/resumir/dividir, web DTO+filtro+badge+criar, backfill 20 tarefas, docs 03/05, board com tags); smokes MCP+web em board temporário (cria/default/inválido/filtro/agrupado); gates verdes; fazendo → revisao.
- 2026-09-06 (humano, via "pode seguir dou meu ok"): aprovado em revisao (DoD ok); revisao → feito. Handoff: concluído.

## Qualidade (preenchido pela IA ao mover p/ revisao)
- [x] complexity: oxlint verde; projetos.ts fns pequenas; handlers MCP/web sem aninhamento novo
- [x] coverage: core 100% (parseConfig/resolverProjeto cobertos, inclusives ramos de erro)
- [x] crap n/a, mutantes: score 84.89 ≥ 70 (60 sobreviventes na classe cosmética já allowlistada)
- [x] dead 0 (knip), redundant 0 (jscpd 0), any/unknown 0 (tsc+eslint verdes)
- [x] `review:slop` 100 · `vite build` + `svelte-check` exit 0
