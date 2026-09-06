# TASKIA — Quadro Kanban AI-First

> **Markdown como banco. MCP como braço. UI como rosto.**
> Qualquer IA cria e move tarefas. Qualquer humano enxerga tudo num quadro.

Você percebeu o ponto central: **IA rende com tarefa bem definida porque o contexto está na tarefa.**
A TaskIA transforma isso em ferramenta: nada de Jira pesado, nada de prompt perdido no chat.
Toda tarefa = contexto completo + estado claro + dono claro (humano ou IA).

---

## Como funciona (em 20 segundos)

```
Você / IA  →  cria .md em .taskia/tasks/  →  move no board.md  →  git versiona
     ↑                                                              ↓
     └──────── MCP Server lê os .md e expõe como tools ─────────────┘
                                                                        ↓
                                                              UI Kanban lê os mesmos .md
```

**Hoje:** `.md` + MCP Server (10 tools via stdio) + UI web Kanban no ar — tudo lendo os mesmos arquivos.
**Ecossistema:** memória durável no ai-memory local (decisões/docs/13) — TaskIA dona do estado, ai-memory dono do conhecimento.

Nada quebra. O formato não muda.

## Estrutura criada

```
/
├── README.md                  ← você está aqui
├── AGENTS.md                  ← receita da IA (leia antes de codar)
├── opencode.json              ← MCP taskia plugado sozinho
├── package.json               ← monorepo Bun (packages/*, apps/*)
├── docs/                      ← 01..13, tudo definido
├── packages/core/             ← validação .md + gates (coverage 100%, mutação 84.77)
├── packages/metrics/          ← complexidade cognitiva via API do TS (mutação 87.88)
├── apps/mcp/                  ← taskia-mcp, 10 tools via stdio (smoke OK)
└── apps/web/                  ← SvelteKit + SVAR Kanban (Topo, Card, Drawer, Tabela, Toast + api/criar/mover/tarefa)
```

## Teste agora (30 segundos, sem instalar nada)

1. Abra `.taskia/board.md` — é seu quadro.
2. Abra qualquer IA (ChatGPT, Claude, Opencode) e cole isso:

> Leia `.taskia/config.yaml`, `.taskia/board.md` e todos os arquivos em `.taskia/tasks/`. Resuma o quadro e sugira a próxima tarefa.

3. Para criar tarefa, diga:

> Crie a tarefa T-016 seguindo `docs/03-FORMATO-TASK.md`. Título: [sua ideia]. Status inicial: inbox.

Funciona. Sem MCP, sem backend. É esse o poder do formato.

## A surpresa: 3 ideias que Jira/Linear não têm

1. **Clarity Score (0-100):** IA avalia se a tarefa está boa o suficiente antes de começar. <70 = ela deve refinar, não executar. Acaba com "achei que era isso".
2. **Handoff entre IAs:** campo `handoff_para_proxima_ia` em toda tarefa. Você começa no ChatGPT, termina no Opencode, sem perder contexto.
3. **Context Pack:** toda tarefa carrega `contexto`, `arquivos_relevantes`, `fora_de_escopo`. A IA não precisa adivinhar nem ler o repo inteiro (economiza tokens).

Tudo já definido nos docs e implementado: MCP em `apps/mcp` (`docs/05-MCP-API.md`), UI em `apps/web` — rode com `bun apps/web/build/index.js` e abra http://localhost:4173.

## Stack + Qualidade (decidido)

- **Stack:** Bun + TypeScript strict + SvelteKit 2 + Svelte 5 + shadcn-svelte. Detalhe + benchmarks em `docs/10-STACK.md`.
- **UI via SV:** SVAR Kanban como base + card/drawer/tabela/toast próprios; `sv-*` demais (animations, agentation, efferd) no futuro se doer.
- **Quality Gates (lei):** ciclomática <22, cognitiva <22 (`packages/metrics`), halstead <80, LOC <500, coverage 100%, CRAP <25, mutantes 0, dead 0, redundant 0, any/unknown 0. Detalhe em `docs/09-QUALIDADE.md`. Sem verde não vai pra `revisao`.
- **Ecossistema:** ai-memory local p/ memória durável (`docs/13-ECOSSISTEMA-MEMORIA.md`).

**Próximo passo:** abra `.taskia/board.md` — aprove o que está em `revisao` e puxe o que está em `pronto`.
