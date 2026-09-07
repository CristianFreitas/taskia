---
id: T-018
titulo: 2 layouts completos alternativos (/a Linear com sidebar, /b Bento)
status: feito
tipo: feature
prioridade: P0
projeto: taskia
responsavel: ia-opencode
criado_em: 2026-09-06T00:00:00Z
atualizado_em: 2026-09-06T00:00:00Z
versao: 5
estimativa: M
dependencias: []
tags: [frontend, layout, rotas]
arquivos_relevantes:
  - apps/web/src/lib/usarQuadro.svelte.ts
  - apps/web/src/routes/a/+page.svelte
  - apps/web/src/routes/b/+page.svelte
  - apps/web/src/lib/server/taskia.ts
  - docs/06-DESIGN-SYSTEM.md
clarity_score: 86
quality:
  status: passando
  relatorio: ""
---

## Objetivo
Dois layouts completos e acessíveis por URL (`/a` e `/b`) com identidades distintas, sem duplicar lógica.

## Contexto
Humano: "é o layout completo; se achar melhor separar em app pode ser". Decisão: separar em ROTAS (não apps) — mesmo build, mesmos componentes, URLs distintas. Lógica de quadro extraída p/ factory `usarQuadro` (Svelte 5 runes) usada pelas 3 páginas; loader compartilhado `carregarBoard()`.

## Escopo
- [ ] `usarQuadro.svelte.ts`: filtros, cards, drawer, toast, mover/criar/abrir, atalhos — usado por `/`, `/a`, `/b` (refatora `/` junto)
- [ ] `/a` Linear: sidebar (nav + contadores) + topbar (busca, criar) + Kanban denso
- [ ] `/b` Bento: header com stat cards (total, em aberto, bloqueadas, clarity média) + Kanban zen
- [ ] Loader `carregarBoard()` em `lib/server/taskia.ts`; `+page.server.ts` de 2 linhas por rota

## Fora de escopo
- 4º layout, temas claro, mudar drawer/tabela/card, dnd próprio, novo backend

## Critérios de aceite (Done)
- [ ] Dado `/a`, quando abro, então vejo sidebar + topbar + quadro funcional (mover/criar/drawer ok)
- [ ] Dado `/b`, quando abro, então vejo stat cards corretos + quadro funcional
- [ ] Dado `jscpd`, quando roda, então 0 clones (lógica compartilhada, não copiada)
- [ ] Dado `/` original, quando abro, então continua igual e funcionando (refator sem regressão)

## Plano
1. Factory `usarQuadro` + loader compartilhado; refatora `/`
2. Rotas `/a` e `/b` com chrome próprio
3. Gates + build + smoke nas 3 URLs

## Handoff para próxima IA
`cardContent` do SVAR só recebe `{card, cardShape}` — card continua o mesmo TaskCard. `+page.server.ts` por rota é obrigatório no SvelteKit: mantenha com 2 linhas via `carregarBoard`.

## Log
- 2026-09-06: criada refinada (score 86, pedido direto do humano).
- 2026-09-06 (ia-opencode): refinando → pronto (clarity 86, sem deps) → fazendo.
- 2026-09-06 (ia-opencode): implementado (factory Quadro em classe runes, `carregarBoard` em +layout.server, rotas /a e /b, BoardShell compartilhado, ConceitoPage); corrigidos 2 lint (void-arrow, união sem id) + 3 clones (CSS unificado, wrappers finos); / /a /b com 200 + HTML completo; gates verdes; fazendo → revisao.
- 2026-09-06 (humano): direção rejeitada — não eram páginas-conceito e sim o layout principal como um todo. Rotas /a e /b + ConceitoPage EXCLUÍDOS; mantidos factory, BoardShell, loader e `observarMoves` (refator real, em uso no `/`). Seguir em T-019.
- 2026-09-06 (humano, via "pode seguir dou meu ok"): aprovado em revisao (DoD ok); revisao → feito. Handoff: concluído.

## Qualidade (preenchido pela IA ao mover p/ revisao)
- [x] complexity: oxlint verde; factory e páginas pequenas, sem lógica duplicada
- [x] coverage: core/metrics 100% mantidos; web via svelte-check 0 errors 0 warnings
- [x] crap n/a, mutantes: 0 nas linhas tocadas (core intocado)
- [x] dead 0 (knip), redundant 0 (jscpd 0 clones), any/unknown 0 (fronteira `as` documentada + narrow total)
- [x] `review:slop` 100 · `vite build` exit 0 · pesquisa registrada (Linear, uxpatterns, cards)
