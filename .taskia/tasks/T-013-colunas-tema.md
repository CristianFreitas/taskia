---
id: T-013
titulo: Colunas com tema dark próprio (WillowDark + tokens TaskIA + accent por status)
status: feito
tipo: feature
prioridade: P0
responsavel: ia-opencode
criado_em: 2026-09-06T00:00:00Z
atualizado_em: 2026-09-06T00:00:00Z
versao: 5
estimativa: P
dependencias: []
tags: [frontend, ux, kanban]
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
Colunas do Kanban com visual dark profissional: tema base + tokens TaskIA + accent na cor do status + WIP visível.

## Contexto
Humano avaliou: "colunas de cada status não estão legais". Causa: Kanban SVAR sem tema (variáveis default claras/genéricas), headers sem hierarquia, colunas sem identidade de status, sem raio/espaçamento no nosso padrão.

## Escopo
- [ ] Envolver Kanban em `<WillowDark fonts={false}>` e mapear `--wx-*` p/ tokens TaskIA via `:global`
- [ ] Classe por coluna (`css: tk-col-{id}`) com `border-top` na cor do status (cores de config.yaml)
- [ ] Headers: uppercase 12px muted, contador em pill, collapse preservado
- [ ] WIP estourado com tint vermelha (`--wx-kanban-column-over-limit-bg`) + gap/padding e radius nas colunas + scrollbar sutil

## Fora de escopo
- Trocar de lib de Kanban, card custom (já ok), drawer, tabela, drag behavior

## Critérios de aceite (Done)
- [ ] Dado `/` aberto, quando olho as colunas, então fundo dark consistente, cada coluna com accent na cor do status e header legível
- [ ] Dada coluna acima do WIP, quando estoura, então destaque vermelho visível
- [ ] Dado build, quando rodo gates, então tudo verde (svelte-check cobre tipos do tema)

## Plano
1. Ler `WillowDark.svelte` + classes `.wx-*` (feito no spike: `column.css` vira classe, header `.wx-column-header`, over-limit `.wx-over-limit`)
2. Wrapper + vars + classes por coluna em taskia.css
3. Gates + build + smoke visual

## Handoff para próxima IA
`WillowDark` exportado em `@svar-ui/svelte-kanban`; uso como wrapper `<WillowDark fonts={false}><Kanban/></WillowDark>`. Não use `transition-all`; hexes só os oficiais de config.yaml.

## Log
- 2026-09-06: criada refinada (score 87, feedback direto do humano).
- 2026-09-06 (ia-opencode): refinando → pronto (clarity 87, aceite testável, sem deps) → fazendo.
- 2026-09-06 (ia-opencode): implementado (WillowDark fonts=false, vars --wx-* mapeadas, `css: tk-col-*` por coluna, headers uppercase); bundle verificado (tema+accents presentes); gates verdes; fazendo → revisao.
- 2026-09-06 (humano): aprovado em revisao (DoD ok); revisao → feito. Handoff: concluído.

## Qualidade (preenchido pela IA ao mover p/ revisao)
- [x] complexity: oxlint verde; só wrapper + CSS, sem lógica nova
- [x] coverage: core 100% mantido; web via svelte-check 0 errors
- [x] crap n/a, mutantes: 0 nas linhas tocadas (core intocado)
- [x] dead 0 (knip), redundant 0 (jscpd 0 clones), any/unknown 0
- [x] `review:slop` 100 · `vite build` exit 0 · hexes só oficiais de config.yaml
