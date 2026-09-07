---
id: T-017
titulo: 2 layouts alternativos do board (Denso + Zen) com switcher
status: feito
tipo: feature
prioridade: P1
projeto: taskia
responsavel: ia-opencode
criado_em: 2026-09-06T00:00:00Z
atualizado_em: 2026-09-06T00:00:00Z
versao: 5
estimativa: M
dependencias: []
tags: [frontend, layout, ux]
arquivos_relevantes:
  - apps/web/src/routes/+page.svelte
  - apps/web/src/lib/BoardTopo.svelte
  - apps/web/src/lib/TaskCard.svelte
  - apps/web/src/theme/taskia.css
  - docs/06-DESIGN-SYSTEM.md
clarity_score: 87
quality:
  status: passando
  relatorio: ""
---

## Objetivo
Oferecer 3 layouts do quadro (Padrão + Denso estilo Linear + Zen minimalista) com switcher persistido, sem duplicar lógica.

## Contexto
Pesquisa (Linear redesign 2026, uxpatterns.dev, card best practices): densidade + hierarquia reduzem carga cognitiva; cards precisam ser escaneáveis, focáveis por teclado e com estados não-felizes desenhados. Hoje só há 1 layout. Decisão: variantes 100% CSS sobre o mesmo TaskCard (zero duplicação de lógica), `data-layout` no `main`.

## Escopo
- [ ] Layout Denso: cards em linha única (id, título ellipsis, badge compacto, prio), footer/badges extras ocultos, faixa de bloqueio preservada
- [ ] Layout Zen: só essencial (título maior, status, dono), generoso, sem selo/clutter
- [ ] Switcher Padrão/Denso/Zen no topo + persistência em localStorage
- [ ] Cards focáveis por teclado (tabindex + Enter abre drawer, `role=button`, aria-label)

## Fora de escopo
- Mudar Kanban/Lista, drawer, dados, SVAR por dentro; 4º layout; temas claro

## Critérios de aceite (Done)
- [ ] Dado switch em Denso, quando olho, então linhas compactas com mesma info essencial e drag funcionando
- [ ] Dado switch em Zen, quando olho, então visual limpo sem perder id/título/status/dono
- [ ] Dado reload, quando volto, então meu layout foi mantido
- [ ] Dado Tab até um card + Enter, quando aperto, então o drawer abre

## Plano
1. CSS das 2 variantes em taskia.css (`main[data-layout] …`, sem `transition-all`, sem hex novo)
2. `layout` state + persist + switcher no BoardTopo + `data-layout` no main
3. Card focável (tabindex/Enter/role) + gates + build + smoke

## Handoff para próxima IA
`cardContent` do SVAR só recebe `{card, cardShape}` — por isso variante é CSS, não props. jscpd escaneia CSS: não copie blocos, use seletores por layout.

## Log
- 2026-09-06: criada refinada com pesquisa (score 87).
- 2026-09-06 (ia-opencode): refinando → pronto (clarity 87, sem deps) → fazendo.
- 2026-09-06 (ia-opencode): implementado (variantes 100% CSS via `data-layout`, switcher + localStorage, card focável com Enter, `article`→`div` p/ a11y); bundle verificado (seletores + switcher presentes); gates verdes; fazendo → revisao.
- 2026-09-06 (humano, via "pode seguir dou meu ok"): aprovado em revisao (DoD ok); revisao → feito. Handoff: concluído.
- 2026-09-06 (humano, via "pode seguir dou meu ok"): aprovado em revisao (DoD ok); revisao → feito. Handoff: concluído.

## Qualidade (preenchido pela IA ao mover p/ revisao)
- [x] complexity: oxlint verde; 0 lógica nova (CSS + 2 fns pequenas de persist)
- [x] coverage: core 100% mantido; web via svelte-check 0 errors 0 warnings
- [x] crap n/a, mutantes: 0 nas linhas tocadas (core intocado)
- [x] dead 0 (knip), redundant 0 (jscpd 0 clones), any/unknown 0
- [x] `review:slop` 100 · `vite build` exit 0 · pesquisa registrada (Linear, uxpatterns, cards)
