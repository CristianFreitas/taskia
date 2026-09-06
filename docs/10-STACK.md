# 10 — Stack Decidida (performance + bem feito)

> Decisão fechada após pesquisa (set/2026). Não reabrir sem benchmark novo.

## Veredito em 1 linha

**Bun + TypeScript strict + SvelteKit 2 + Svelte 5 + shadcn-svelte + Tailwind.**
MCP e UI na mesma linguagem, mesmo core, mesma validação.

## Por que não as outras

| Opção | Desempenho real (ago/2026, medido) | Por que perdeu |
|---|---|---|
| **SvelteKit 2.63 (escolhido)** | bundle contador ~27 KB gzip, TTI 0.8s, 1200 RPS em VPS $6, build 4.7s | — |
| Next.js 16.3 | bundle ~128 KB gzip (5x maior), TTI 2.4s, 850 RPS, build 22.7s | runtime React + V-DOM diffing. Bom ecossistema, péssimo p/ Kanban 60fps com drag |
| Python (MCP) | startup stdio ~300ms, throughput menor, 2 linguagens no repo | dividiria validação .md em 2 implementações, mais drift |
| Go/Rust (MCP) | mais rápido em RPS puro | overkill p/ CRUD de .md, SDK MCP TS-first, sem compartilhar código com UI |

Fontes: benchmarks SvelteKit vs Next 16 (devMorph/markaiCode, ago/2026): 27 vs 128 KB gzip, 0.8 vs 2.4s TTI, 1200 vs 850 RPS (+41%).

## Runtime: Bun (não Node)

- 3-4x startup mais rápido que Node — crítico p/ MCP via stdio (cada tool call é cold start).
- `bun run`, `bun test`, `bunx` nativos. Vitest roda sob Bun sem atrito.
- TS out-of-the-box, sem ts-node. `tsc --noEmit` continua valendo p/ typecheck estrito.
- Fallback: Node 22 funciona (`packageManager` detecta), mas CI oficial é Bun.

## MCP: API low-level `Server`, NÃO `McpServer.tool()` (medido)

- SDK 1.30: UM `server.tool()` com schema zod inline = ~30s de tsc + `TS2589: Type instantiation is excessively deep`. Com 6 calls o typecheck nunca termina.
- Reescrito com `Server` + `setRequestHandler(ListTools/CallTool)` + `schema.parse()` manual + `zod-to-json-schema` p/ `inputSchema`: typecheck em ~10s, mesma validação runtime, 10 tools.
- Custo: `// eslint-disable no-deprecated` pontual com motivo (o `Server` é marcado deprecated em favor do `McpServer`). Reavaliar quando SDK corrigir a inferência.

## Frontend: SvelteKit + Svelte 5 Runes

- Sem V-DOM: compila pra DOM direto. Drag-and-drop do Kanban não trava com 200 cards.
- Runes (`$state`, `$derived`) > hooks: sem `useEffect`/`useMemo`, menos bug reativo, menos `any`.
- Adapter-based: mesmo build deploya em Vercel/Node/static/Cloudflare. Sem lock-in Vercel.
- **Board: SVAR Kanban core free (MIT, jun/2026) como base** — drag-drop, editor, filtro/sort, virtualização. Nós customizamos só o card TaskIA (cores de `06`) + validação de transição via `packages/core`. Não construir dnd do zero. Fallback: Flowbite-Svelte `KanbanBoard`.

## Ecossistema SV (tudo do mesmo autor, tudo MIT, tudo Svelte 5 + Tailwind — por isso você mandou bem)

Todos de SikandarJODD / Bhide — já testados juntos, CLI via `jsrepo`/`shadcn-svelte`:

| Site | O que é | Onde usamos na TaskIA |
|---|---|---|
| `sv-animations` | 50+ componentes animados (Motion SV) | card entrando, coluna `fazendo` com pulso, drawer, toast de `mover_tarefa` |
| `sv-table` | TanStack Table v9 p/ Svelte + filtros | visão Lista/Relatórios (throughput, clarity médio, aging) — não é o Kanban, é a 2ª view |
| `sv-blocks` | 150+ blocos shadcn (hero, dashboard, auth) | App Shell do Kanban + landing + auth futura. Base do layout |
| `sv-efferd` | 60 blocos marketing shadcn-svelte | landing page pública da TaskIA |
| `sv-matrix` | 50+ loaders dot-matrix | skeletons do quadro + loading de `resumir_quadro` |
| `sv-particles` (QBlocks) | blocos shadcn Svelte 5 + data-table | data-table de tarefas + blocos utilitários |
| `sv-agentation` | anota UI → gera contexto p/ IA (Claude/Cursor) | **diferencial:** usuário clica num card bugado, aperta `i`, escreve nota → cola na IA → IA abre tarefa com Context Pack pronto. Fecha o loop UI→tarefa |

Regra: nada de copiar código na mão. Instalar via CLI (`shadcn-svelte`, `jsrepo`) pra receber update. O que customizar (cores TaskIA) vai em `src/theme/taskia.css` com os tokens de `06-DESIGN-SYSTEM.md`.

## Estrutura do monorepo (1 linguagem, 2 apps, 2 packages)

```
taskia/
├── packages/core/       # validação .md + quality gates + máquina estados (Bun+TS, zero dep UI)
│   └── usado por MCP e pela UI — mesma regra, zero drift
├── packages/metrics/    # cognitive complexity via API do TS (CI-only; fora do bundle web de propósito)
├── apps/mcp/            # taskia-mcp (stdio). Importa @modelcontextprotocol/sdk + core
├── apps/web/            # SvelteKit 2 + Svelte 5 + shadcn-svelte + Tailwind + sv-*
└── .taskia/             # o próprio quadro (dogfooding desde o dia 1)
```

`tsconfig`: `strict: true, noImplicitAny: true, noUncheckedIndexedAccess: true, exactOptionalPropertyTypes: true`.
ESLint: `no-explicit-any: error`. É assim que garantimos o gate `any/unknown = 0`.

## Decisão registrada

Bun + TS strict + SvelteKit por performance medida (bundle 5x menor, +41% RPS) + unificação MCP/UI + ecossistema SV pronto. Revisitar só se benchmark 2027 inverter.
