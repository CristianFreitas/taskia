---
id: T-019
titulo: Redesign completo do layout principal (cores, estrutura, componentes)
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
tags: [frontend, layout, ux, visual]
arquivos_relevantes:
  - apps/web/src/theme/taskia.css
  - apps/web/src/routes/+page.svelte
  - apps/web/src/lib/BoardTopo.svelte
  - apps/web/src/lib/TaskCard.svelte
  - apps/web/src/lib/TaskDrawer.svelte
  - apps/web/src/lib/TaskTable.svelte
  - docs/06-DESIGN-SYSTEM.md
clarity_score: 87
quality:
  status: passando
  relatorio: ""
---

## Objetivo
Elevar o layout principal inteiro (cores, estrutura, componentes) a padrão profissional coeso, sem páginas-conceito separadas.

## Contexto
Humano rejeitou variantes de card (T-017) e páginas /a e /b (T-018, excluídas): o problema é o todo — hierarquia visual fraca, superfícies planas demais, componentes sem acabamento (scrollbars, focus, hover, divisores). Direção: console dark refinado sobre os tokens existentes de docs/06, sem trocar libs ou estrutura de rotas.

## Escopo
- [ ] Escala de superfícies (elevação sutil entre fundo/coluna/card) + bordas e sombras consistentes via tokens
- [ ] Scrollbars finas dark + cor de seleção + estados hover/focus/active em todos os controles
- [ ] BoardTopo: hierarquia (marca, chips, toolbar) com ritmo e alinhamento revisados
- [ ] TaskCard: tipografia/espaçamento refinados, bloqueado mais legível, clarity integrada
- [ ] TaskDrawer: divisores de seção, hierarquia de títulos, largura e respiro revisados
- [ ] TaskTable: header sticky, zebra sutil, hover de linha

## Fora de escopo
- Novas rotas/páginas, sidebar, temas claro, trocar SVAR, motion além do sistema (150/250ms), novas dependências

## Critérios de aceite (Done)
- [ ] Dado `/` aberto em 1920px e 360px, quando comparo com o anterior, então hierarquia clara, sem áreas "cruas", sem overflow quebrado
- [ ] Dado Tab por todos os controles, quando navego, então foco sempre visível e ordem lógica
- [ ] Dado gates, quando rodam, então tudo verde e jscpd 0 (CSS compartilhado no tema, sem copiar blocos)

## Plano
1. Tokens + base (scrollbar, seleção, superfícies) em taskia.css
2. Topo → board → card → drawer → tabela, um por vez, provando no build
3. Gates + build + smoke + revisao

## Handoff para próxima IA
Tokens oficiais em `.taskia/config.yaml` + `docs/06`. CSS de componente fica no `<style>` dele; compartilhado vai p/ taskia.css. Sem hex novo, sem `transition-all`, sem bounce.

## Log
- 2026-09-06: criada refinada (score 87, direção fechada com o humano).
- 2026-09-06 (ia-opencode): refinando → pronto (clarity 87, sem deps) → fazendo.
- 2026-09-06 (ia-opencode): implementado (tokens --bg-3/seleção/scrollbar, hover/focus nos controles, colunas com borda+sombra+tint, card com sombra/divisor/faixa, drawer com divisores, tabela sticky+zebra+hover); corrigido hex digitado errado na hora; gates verdes; fazendo → revisao.
- 2026-09-06 (humano, via "pode seguir dou meu ok"): aprovado em revisao (DoD ok); revisao → feito. Handoff: concluído.

## Qualidade (preenchido pela IA ao mover p/ revisao)
- [x] complexity: oxlint verde; só CSS + 0 lógica nova
- [x] coverage: core/metrics 100% mantidos; web via svelte-check 0 errors 0 warnings
- [x] crap n/a, mutantes: 0 nas linhas tocadas (core intocado)
- [x] dead 0 (knip), redundant 0 (jscpd 0 clones), any/unknown 0
- [x] `review:slop` 100 · `vite build` exit 0 · sem hex fora de tokens, sem transition-all/bounce
