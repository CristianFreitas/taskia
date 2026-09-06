# 08 — Roadmap (da pasta .md ao SaaS)

## Fase 0 — HOJE ✅ (esta pasta)
- [x] Contrato .md + workflow + cores + MCP API definidos
- [x] `.taskia/` funcional sem código
- [ ] Usar 1 semana real: criar 10+ tarefas, medir clarity médio, ajustar WIP
- Critério p/ avançar: você operou 1 projeto inteiro só com .md + IA.

## Fase 1 — MCP Server ✅ base pronta (medido 05/09)
- [x] `taskia-mcp` em **Bun + TypeScript strict**, core em `packages/core` (`aplicarMovimento` compartilhado).
- [x] 10 tools de `05-MCP-API.md` via API low-level `Server` (McpServer.tool() dava TS2589 — ver `10`).
- [x] `opencode.json` na raiz pluga sozinho; smoke stdio OK (criar→listar→mover→ilegal bloqueada).
- [ ] `board.md` gerado por `resumir_quadro` (hoje manual).
- Gates: coverage 100%, mutação 85.39, knip/jscpd/slop 0.

## Fase 2 — UI Kanban 🟡 base funcionando (05/09)
- [x] SvelteKit 2 + Svelte 5 + SVAR Kanban, lê `.taskia/` no `load`, `POST /api/mover` valida no core. Smoke: `GET /` 200, move ok 200, ilegal 422.
- [x] Card custom TaskIA (cores de `06`, barra de prioridade, selo ✨IA, clarity) + Drawer (Context Pack + botões de mover com `allowedFrom` do core, ESC fecha).
- [x] Filtros (busca `/`, dono IA/humano, prioridade) + criar tarefa pela UI (`POST /api/criar`, esqueleto compartilhado em `packages/core/nova.ts`).
- [ ] View Lista (`sv-table`), `sv-animations`, `sv-agentation`, landing (`sv-efferd`) — polimento futuro.
- [ ] Drawer de tarefa + filtros + clarity ring + selo ✨IA + badge Quality.
- [ ] Card custom TaskIA (cores de `06`), `sv-animations`, view Lista (`sv-table`), `sv-agentation`.

## Fase 3 — Multi + SaaS (quando doer)
- Só se doer: realtime (Supabase), auth, mobile, analytics de throughput.
- Migração: importa `.taskia/` — zero lock-in, export sempre .md.
- Ideias pagas: templates por stack, agente refinador automático, métricas de IA vs humano.

## O que NÃO fazer agora
- Auth, backend, realtime, mobile, billing. Tudo isso mata velocidade e não ajuda a IA a operar.
- Trocar .md por banco "pra ficar profissional". Profissional = IA opera sem fricção.

## Estimativa honesta
Fase 1 sozinha já entrega 80% do valor (IA operando com segurança). UI é conforto. Não inverta.
