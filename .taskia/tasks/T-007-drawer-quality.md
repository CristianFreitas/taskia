---
id: T-007
titulo: Drawer v2 com quality e copiar contexto
status: feito
tipo: feature
prioridade: P1
responsavel: ia-opencode
criado_em: 2026-09-05T03:00:00Z
atualizado_em: 2026-09-06T00:00:00Z
versao: 5
estimativa: P
dependencias: [T-006]
tags: [frontend, drawer]
arquivos_relevantes:
  - apps/web/src/lib/TaskDrawer.svelte
  - apps/web/src/routes/+page.svelte
clarity_score: 84
quality:
  status: passando
  relatorio: ""
---

## Objetivo
Drawer exibe quality/slop da tarefa e copia o Context Pack pra colar em qualquer IA.

## Contexto
O drawer mostra o pack mas não o `quality.status`/`slop.score` do frontmatter, e não há ponte UI→chat (docs/07 é manual). Botão "Copiar contexto" fecha o loop: monta markdown `id+titulo+status+corpo` e copia.

## Escopo
- [ ] Seção "Qualidade": quality.status + slop.score (do frontmatter) com cor (verde/âmbar/cinza-isento)
- [ ] Botão "⧉ Copiar contexto" → clipboard com pack markdown; feedback "copiado ✓" 2s
- [ ] Fallback se clipboard indisponível: mostra erro no drawer (sem throw)

## Fora de escopo
- Editar a tarefa no drawer, lista (T-008), toasts globais (T-009)

## Critérios de aceite (Done)
- [ ] Dada T-001 aberta, quando olho a seção, então vejo quality + slop dela
- [ ] Dado clique em copiar, quando permito, então o clipboard contém `# T-001 …` e vejo "copiado ✓"
- [ ] Dado clipboard bloqueado, quando clico, então vejo erro amigável (sem exceção no console)

## Plano
1. Props ganham quality/slop (já vêm no frontmatter do detalhe)
2. Seção + botão com navigator.clipboard + try/catch + timeout de feedback
3. Smoke: abrir T-001, copiar, colar fora

## Handoff para próxima IA
frontmatter do detalhe já inclui quality/slop (verifique no GET /api/tarefa/T-001). Clipboard só existe no browser — drawer já é client-side.

## Log
- 2026-09-05: criada refinada (score 84).
- 2026-09-06 (ia-opencode): refinando → pronto (clarity 84; dep T-006 em revisao com gates verdes — exceção de ordem documentada) → fazendo.
- 2026-09-06 (ia-opencode): implementado (seção Qualidade com cores, copiar contexto p/ clipboard com fallback + timeout com cleanup); gates verdes; fazendo → revisao.
- 2026-09-06 (humano, via "finalize agora"): aprovado em revisao (DoD ok); revisao → feito. Handoff: concluído.

## Qualidade (preenchido pela IA ao mover p/ revisao)
- [x] complexity: oxlint verde; `classeQualidade`/`montarContexto`/`copiar` pequenas; drawer <200 linhas
- [x] coverage: core 100% mantido; web validado por svelte-check 0 errors
- [x] crap n/a, mutantes: 0 nas linhas tocadas (core intocado)
- [x] dead 0 (knip), redundant 0 (jscpd 0), any/unknown 0 (catch sem param, narrow em `frontmatter.slop`)
- [x] `review:slop` 100 · `vite build` exit 0
