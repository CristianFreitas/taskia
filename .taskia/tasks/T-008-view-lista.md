---
id: T-008
titulo: View Lista com ordenação (alternativa ao Kanban)
status: feito
tipo: feature
prioridade: P2
responsavel: ia-opencode
criado_em: 2026-09-05T03:00:00Z
atualizado_em: 2026-09-06T00:00:00Z
versao: 5
estimativa: P
dependencias: [T-007]
tags: [frontend, lista]
arquivos_relevantes:
  - apps/web/src/routes/+page.svelte
  - apps/web/src/lib/board.ts
clarity_score: 83
quality:
  status: passando
  relatorio: ""
---

## Objetivo
Alternar Kanban/Lista: tabela acessível ordenada por prioridade e status, clique abre o drawer.

## Contexto
Kanban é ótimo p/ fluxo, ruim p/ escanear 50+ tarefas e p/ leitor de tela. Sem lib nova: `<table>` nativa com os mesmos dados filtrados.

## Escopo
- [ ] Toggle Kanban/Lista (segmented, estado local, padrão Kanban)
- [ ] Tabela: ID, Título, Status, Prioridade, Dono, Clarity; ordenada P0→P3, depois ordem das colunas
- [ ] Linha clicável (botão) abre o drawer via mesmo `abrir()`
- [ ] `ordenarParaLista()` pura em board.ts (testável, sem lógica no markup)

## Fora de escopo
- Paginação, edição inline, sv-table (futuro se doer), motion (T-009)

## Critérios de aceite (Done)
- [ ] Dado toggle em Lista, quando clico, então vejo tabela com P0 antes de P3
- [ ] Dada linha clicada, quando clico, então o drawer abre com a tarefa certa
- [ ] Dado leitor de tela, quando navego, então th/td com scope correto

## Plano
1. `ordenarParaLista` + ordem de prioridade em board.ts
2. Toggle + `<table>` em +page.svelte (reusa `cards` filtrados)
3. Linha como `<button>` estilizado ou tr clicável com teclado (Enter)

## Handoff para próxima IA
Reusa `filtradas`/`abrir` existentes. Cuidado: arquivo +page.svelte cresce — se passar de 300 linhas, extraia a tabela p/ `TaskTable.svelte`.

## Log
- 2026-09-05: criada refinada (score 83).
- 2026-09-06 (ia-opencode): refinando → pronto (clarity 83; dep T-007 em revisao com gates verdes — exceção de ordem documentada) → fazendo.
- 2026-09-06 (ia-opencode): implementado (TaskTable.svelte extraído, `ordenarParaLista` pura em board.ts, toggle Kanban/Lista, +page 274 linhas); ordenação verificada (P0→P1/inbox→P1/feito→P3); gates verdes; fazendo → revisao.
- 2026-09-06 (humano, via "finalize agora"): aprovado em revisao (DoD ok); revisao → feito. Handoff: concluído.

## Qualidade (preenchido pela IA ao mover p/ revisao)
- [x] complexity: oxlint verde; `ordenarParaLista` comparador simples; TaskTable <120 linhas
- [x] coverage: core 100% mantido; web via svelte-check 0 errors
- [x] crap n/a, mutantes: 0 nas linhas tocadas (core intocado)
- [x] dead 0 (knip), redundant 0 (jscpd 0), any/unknown 0 (props tipadas, sem cast)
- [x] `review:slop` 100 · `vite build` exit 0 · acessibilidade: th scope=col, linha abre via botão
