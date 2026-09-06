---
id: T-006
titulo: Card v2 com bloqueio e barra de clarity
status: feito
tipo: feature
prioridade: P1
responsavel: ia-opencode
criado_em: 2026-09-05T03:00:00Z
atualizado_em: 2026-09-06T00:00:00Z
versao: 5
estimativa: P
dependencias: [T-005]
tags: [frontend, card]
arquivos_relevantes:
  - apps/web/src/lib/TaskCard.svelte
  - apps/web/src/lib/board.ts
  - apps/web/src/routes/+page.server.ts
  - docs/06-DESIGN-SYSTEM.md
clarity_score: 86
quality:
  status: passando
  relatorio: ""
---

## Objetivo
Card mostra se a tarefa está bloqueada por dependência e a clarity como barra, não só número.

## Contexto
`dependencias` existe no frontmatter mas nunca aparece na UI. Tarefa travada parece normal. Regra (docs/04): dependência fora de `feito` = bloqueada (borda vermelha #EF4444 + 🔴).

## Escopo
- [ ] Server calcula `bloqueada: boolean` + `dependencias: string[]` no DTO (map id→status)
- [ ] Card: faixa vermelha + linha "🔴 aguarda T-XXX" quando bloqueada
- [ ] Clarity vira mini-barra (largura %, âmbar se <70) + número
- [ ] Hover eleva o card (translateY(-1px), sem transition-all genérico)

## Fora de escopo
- Desbloquear pela UI, drawer (T-007), motion geral (T-009)

## Critérios de aceite (Done)
- [ ] Dada tarefa com dependência em aberto, quando abro `/`, então vejo faixa vermelha + "🔴 aguarda T-XXX"
- [ ] Dada clarity 45, quando vejo o card, então barra ~45% âmbar; clarity 100 verde cheia
- [ ] Dado mouse sobre o card, quando pairado, então eleva 1px sem quebrar drag

## Plano
1. Estender CardView + server (lookup de status)
2. TaskCard: faixa, linha de bloqueio, barra
3. Hover CSS específico (transform + box-shadow, 150ms)

## Handoff para próxima IA
Depende de T-005 só por ordem de edição em +page.svelte. Cuidado com knip (tipos exportados precisam uso cruzado) e jscpd (CSS vai p/ taskia.css se repetir).

## Qualidade (preenchido pela IA ao mover p/ revisao)
- [x] complexity: oxlint `complexity` verde; `lista()`/`paraCard`/`secoes` pequenas; TaskCard <200 linhas, +page.svelte 250 (<500)
- [x] coverage: core 100% mantido (vitest exit 0); linhas tocadas web validadas por svelte-check 0 errors
- [x] crap n/a, mutantes: 0 nas linhas tocadas (core intocado; stryker exige git, repo sem git — registrado)
- [x] dead 0 (knip exit 0), redundant 0 (jscpd 0 clones), any/unknown 0 (tsc+eslint verdes; fronteira `KanbanCard:any` estreitada em `texto()/numero()/lista()`)
- [x] `review:slop` 100 · `vite build` exit 0 · lógica `bloqueada` verificada via script (true/false/false)
- Cores via tokens (`--alerta` adicionado ao taskia.css p/ #EF4444 de docs/04); sem `transition-all`; hover só `transform+box-shadow` 150ms

## Log
- 2026-09-05: criada refinada (score 86).
- 2026-09-06 (ia-opencode): refinando → pronto (clarity 86, aceite testável; dep T-005 em revisao com gates verdes — exceção de ordem documentada) → fazendo.
- 2026-09-06 (ia-opencode): implementado (server calcula bloqueadas, card com faixa+barra+hover, token --alerta); removido `class:baja` espúrio; gates verdes; fazendo → revisao.
- 2026-09-06 (humano, via "finalize agora"): aprovado em revisao (DoD ok); revisao → feito. Handoff: concluído.
