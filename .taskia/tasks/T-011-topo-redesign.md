---
id: T-011
titulo: Redesign do topo do board (header, toolbar, contadores, empty-state)
status: feito
tipo: feature
prioridade: P0
responsavel: ia-opencode
criado_em: 2026-09-06T00:00:00Z
atualizado_em: 2026-09-06T00:00:00Z
versao: 5
estimativa: P
dependencias: []
tags: [frontend, ux]
arquivos_relevantes:
  - apps/web/src/routes/+page.svelte
  - apps/web/src/lib/board.ts
  - apps/web/src/lib/TaskCard.svelte
  - apps/web/src/theme/taskia.css
  - docs/06-DESIGN-SYSTEM.md
clarity_score: 88
quality:
  status: passando
  relatorio: ""
---

## Objetivo
Refazer todo o topo do board (header, toolbar, filtros, contadores, empty-state) com visual profissional e centralizar cores de status.

## Contexto
Humano avaliou: "frontend tá feio, tudo no topo ruim". Causas reais: `.topo`/`.contadores`/`.vazio` sem CSS (lista com bullets), toggle cru, selects nativos claros no dark, sem focus ring, `STATUS_COR` duplicado entre board e card.

## Escopo
- [ ] Header novo: marca ▦ + nome + "N tarefas · M em aberto" + toggle Kanban/Lista à direita
- [ ] Painel único: busca com ícone, selects dono/prio, contadores como stat chips com dot na cor, criar à direita
- [ ] `cor` em `COLUNAS` (cores de config.yaml) + `corStatus()` em board.ts; TaskCard usa o helper (fim da duplicação)
- [ ] `color-scheme: dark`, focus-visible, empty-state estilizado, responsivo <720px
- [ ] Reindentar bloco Kanban em +page.svelte

## Fora de escopo
- Mudar drawer, tabela, card (só consome helper), SVAR columns, novas dependências

## Critérios de aceite (Done)
- [ ] Dado `/` aberto, quando olho o topo, então vejo marca, contadores com dots coloridos, busca, filtros e criar alinhados sem bullets nem controles claros
- [ ] Dado Tab pelo topo, quando foco, então anel de foco visível em cada controle
- [ ] Dado 360px de largura, quando abro, então nada estoura (painel empilha)
- [ ] Dado build, quando rodo gates, então tudo verde e sem CSS/TS duplicado (jscpd 0)

## Plano
1. board.ts: `cor` + `corStatus()`; TaskCard consome
2. +page.svelte: header + painel + empty-state + toggle movido
3. taskia.css: color-scheme, focus, chips, painel, responsivo
4. Gates + build + smoke

## Handoff para próxima IA
Cores oficiais em `.taskia/config.yaml` (colunas.*.cor). Não invente hex; use tokens. Knip implica tipos exportados com uso cruzado.

## Log
- 2026-09-06: criada refinada (score 88, feedback direto do humano).
- 2026-09-06 (ia-opencode): refinando → pronto (clarity 88, aceite testável, sem deps) → fazendo.
- 2026-09-06 (ia-opencode): implementado (BoardTopo.svelte extraído, cor/rotuloStatus no core da UI, color-scheme+focus, +page 222 linhas); gates verdes; fazendo → revisao.
- 2026-09-06 (humano, via "finalize agora"): aprovado em revisao (DoD ok); revisao → feito. Handoff: concluído.

## Qualidade (preenchido pela IA ao mover p/ revisao)
- [x] complexity: oxlint verde; BoardTopo/+page <300 linhas cada
- [x] coverage: core 100% mantido; web via svelte-check 0 errors
- [x] crap n/a, mutantes: 0 nas linhas tocadas (core intocado)
- [x] dead 0 (knip), redundant 0 (jscpd 0 clones), any/unknown 0
- [x] `review:slop` 100 · `vite build` exit 0 · sem hex fora de tokens, sem transition-all
