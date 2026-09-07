---
id: T-012
titulo: Board ocupa a tela toda e rola por dentro (layout full-screen responsivo)
status: feito
tipo: feature
prioridade: P0
projeto: taskia
responsavel: ia-opencode
criado_em: 2026-09-06T00:00:00Z
atualizado_em: 2026-09-06T00:00:00Z
versao: 5
estimativa: P
dependencias: []
tags: [frontend, layout, responsivo]
arquivos_relevantes:
  - apps/web/src/routes/+page.svelte
  - apps/web/src/theme/taskia.css
  - docs/06-DESIGN-SYSTEM.md
clarity_score: 87
quality:
  status: passando
  relatorio: ""
---

## Objetivo
Board preenche 100% da viewport em qualquer tela, com rolagem interna das colunas e horizontal do quadro.

## Contexto
Humano avaliou: "não ocupa a tela toda, não está responsivo". Causas: `main` com `max-width: 1560px` centralizado (goteiras laterais em ultrawide) e `min-height: 100vh` sem travar altura (Kanban SVAR só estica se o pai tiver altura definida; hoje cresce com o conteúdo).

## Escopo
- [ ] `main`: largura total, `height: 100dvh` (fallback 100vh), flex column, sem scroll da página
- [ ] Wrapper do Kanban com `flex: 1; min-height: 0` + `.wx-kanban { height: 100% }` via `:global`
- [ ] View Lista no mesmo wrapper com scroll próprio
- [ ] Mobile <720px: colunas com largura mínima e scroll horizontal preservado, painel já empilha

## Fora de escopo
- Mudar drawer, card, tabela, SVAR por dentro; sidebar; novos breakpoints além de 720px

## Critérios de aceite (Done)
- [ ] Dado viewport 1920px, quando abro `/`, então não há goteira lateral (fundo ocupa tudo) e colunas esticam até o fim da tela
- [ ] Dada coluna com muitos cards, quando rolo, então só a coluna rola (página parada)
- [ ] Dado 360px, quando abro, então quadro rola na horizontal sem quebrar o topo

## Plano
1. `main` flex 100dvh + wrapper `.boardwrap` + `:global(.wx-kanban)` 100%
2. Mesma área p/ Lista com overflow auto
3. Gates + build + smoke visual (verificar HTML/CSS no build)

## Handoff para próxima IA
SVAR usa `.wx-kanban > .wx-board > .wx-scroll` com overflow próprio; só dê altura ao pai. Não use `transition-all`; não mexa em `height` do SVAR por JS.

## Log
- 2026-09-06: criada refinada (score 87, feedback direto do humano).
- 2026-09-06 (ia-opencode): refinando → pronto (clarity 87, aceite testável, sem deps) → fazendo.
- 2026-09-06 (ia-opencode): implementado (main flex 100dvh sem max-width, body margin 0, wrapper flex+`:global(.wx-kanban)` 100%, lista com scroll); bundle verificado (100dvh presente, 1560px ausente); gates verdes; fazendo → revisao.
- 2026-09-06 (humano): aprovado em revisao (DoD ok); revisao → feito. Handoff: concluído.

## Qualidade (preenchido pela IA ao mover p/ revisao)
- [x] complexity: oxlint verde; só CSS + wrapper, sem lógica nova
- [x] coverage: core 100% mantido; web via svelte-check 0 errors
- [x] crap n/a, mutantes: 0 nas linhas tocadas (core intocado)
- [x] dead 0 (knip), redundant 0 (jscpd 0 clones), any/unknown 0
- [x] `review:slop` 100 · `vite build` exit 0 · sem hex novo, sem transition-all
