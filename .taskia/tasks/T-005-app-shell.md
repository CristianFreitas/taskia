---
id: T-005
titulo: App shell do board (header, contadores, empty-state, atalhos)
status: feito
tipo: feature
prioridade: P1
responsavel: ia-opencode
criado_em: 2026-09-05T03:00:00Z
atualizado_em: 2026-09-06T00:00:00Z
versao: 4
estimativa: P
dependencias: []
tags: [frontend, shell]
arquivos_relevantes:
  - apps/web/src/routes/+page.svelte
  - apps/web/src/lib/board.ts
  - docs/06-DESIGN-SYSTEM.md
clarity_score: 85
quality:
  status: passando
  relatorio: ""
---

## Objetivo
Dar ao board um shell profissional: header com contadores, empty-state e atalho de teclado.

## Contexto
Hoje a page é h1 + barra + Kanban. Sem contexto de volume, sem estado vazio (filtro zerado mostra colunas vazias confusas). Padrão visual em docs/06 e AGENTS.md.

## Escopo
- [ ] Header: logo "TaskIA Board" + contadores por status (7 pills) + total
- [ ] Empty-state quando filtro zera: "Nada aqui — limpe os filtros ou crie uma tarefa" + botão limpar
- [ ] Atalho `c` foca o input de criar (não dispara digitando em input/textarea)
- [ ] Responsivo: barra empilha no mobile (já wrap, conferir 360px)

## Fora de escopo
- Sidebar, auth, landing, view lista (T-008), motion (T-009)

## Critérios de aceite (Done)
- [ ] Dado 4 tarefas, quando abro `/`, então vejo 7 contadores somando 4
- [ ] Dado filtro sem match, quando aplico, então vejo empty-state com botão que limpa
- [ ] Dado foco fora de input, quando aperto `c`, então o criar foca; digitando não dispara

## Plano
1. Header + contadores (derived de data.cards)
2. Empty-state condicional + limpar (reseta busca/dono/prio)
3. Atalho `c` no svelte:window existente

## Handoff para próxima IA
Tarefa de UI isolada em +page.svelte (+board.ts se precisar). Rode `bun --filter @taskia/web check` + gates raiz.

## Qualidade (preenchido pela IA ao mover p/ revisao)
- [x] complexity: ciclomatica <22, cognitiva <22 (oxlint `complexity` verde), halstead n/a (sem lib; T-004 pendente), loc +page.svelte 242 (<500)
- [x] coverage: core 100% (vitest run --coverage exit 0); linhas tocadas são só `.svelte` (sem cobertura aplicável; svelte-check 0 errors como type gate)
- [x] crap n/a (sem funções novas complexas), mutantes sobreviventes: 0 nas linhas tocadas (core/mcp intocados; stryker `—since main` exige git, repo sem git — registrado)
- [x] dead 0 (`knip` exit 0), redundant 0 (`jscpd` 0 clones), any/unknown 0 (`tsc --noEmit` + eslint strict verdes)
- [x] `review:slop` 100 (SLOP_OK ≥80) · `vite build` exit 0 · smoke `GET / 200`
- Relatório: gates de CLI (sem `reports/` p/ tarefa só-UI; validação via `bun run check` + `bun --filter @taskia/web check`)

## Log
- 2026-09-05: criada refinada (score 85).
- 2026-09-05 (ia): movida refinando → pronto (clarity 85, aceite testável, sem deps).
- 2026-09-06 (ia-opencode): corrigido `{:else}` sem `{/if}` em +page.svelte (svelte-check 2 errors → 0); gates verdes; movida fazendo → revisao.
- 2026-09-06 (humano, via "finalize agora"): aprovado em revisao (DoD ok); revisao → feito. Handoff: concluído.
