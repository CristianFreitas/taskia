# 02 — Arquitetura (.md → MCP → UI)

## Decisão mãe: Markdown é o banco de dados

Comparado e escolhido:

| Opção | Prós | Contras | Veredito |
|---|---|---|---|
| .md + frontmatter YAML | legível p/ IA e humano, diff no git, zero setup, funciona anexando no chat hoje | busca é grep, sem realtime | ✅ **Fase 0-1** |
| SQLite | query boa, local | IA não lê bem sem tool, binário no git | ⏳ Fase 2 (cache) |
| Postgres/Supabase | multi-user, realtime | overkill, precisa backend/auth agora | ❌ Fase 3 |

**Regra de ouro:** o `.md` nunca deixa de ser verdade. MCP e UI são leitores/escritores, não donos.

## Estrutura oficial `.taskia/`

```
.taskia/
├── config.yaml          # colunas, cores, WIP, tipos, prioridades (contrato)
├── board.md             # render humano do quadro (gerado pelo MCP/UI, editável à mão na Fase 0)
├── decisions.log.md     # append-only: data + decisão + motivo
└── tasks/
    └── T-003-titulo-em-kebab-case.md   # 1 arquivo = 1 tarefa, ID único
```

- ID: `T-` + 3 dígitos sequenciais (`T-001`). Nunca reutiliza.
- Filename: `{ID}-{slug}.md`. Slug não pode mudar após criar (link estável).
- `board.md` na Fase 0 é manual. Na Fase 1 é gerado por `resumir_quadro` (mas continua legível/editável).

## Camadas

```
[Qualquer IA] --tools--> [MCP Server: taskia-mcp] --fs--> [.taskia/*.md] <--fs-- [UI Web Kanban]
     |                           |                                              |
     +-- hoje: lê .md direto -----+----------- amanhã: via tools ----------------+
```

- **Fase 0 (hoje):** IA lê/escreve `.md` direto. Zero código.
- **Fase 1:** `taskia-mcp` (**Bun + TypeScript strict** + `@modelcontextprotocol/sdk`, ver `10-STACK.md`) expõe 10 tools, só faz CRUD validado nos `.md` + `verificar_qualidade`. Roda via `bunx` / stdio. Funciona em Claude Desktop, Opencode, Cursor, Continue.
- **Fase 2:** UI **SvelteKit 2 + Svelte 5 + shadcn-svelte** (ver `10-STACK.md`) lê os mesmos `.md` via `packages/core` compartilhado. Drag-and-drop = `mover_tarefa`. Sem divergência.
- **Fase 3:** sync opcional (git push = sync; depois Supabase p/ realtime multi-user).

## Regras de concorrência (simples e suficientes)

1. Uma tool por vez modifica um arquivo. Leitura é livre.
2. `updated_at` (ISO-8601) + `versao` incremental. Se IA tentar atualizar com `versao` antiga → erro `STALE_VERSION`, ela relê.
3. `mover_tarefa` valida transição permitida (ver `04-QUADRO-WORKFLOW.md`). Transição ilegal = erro explicativo, não silent.
4. Git é o audit log. Commit sugerido: `taskia(T-001): fazendo → revisao`.

## Segurança MCP

- Só opera dentro de `.taskia/` do workspace autorizado. Sem path traversal (`../` bloqueado).
- Sem acesso a rede, sem execução de shell. Só markdown.
- `resumir_quadro` nunca vaza conteúdo de `notas_internas` se marcado `privado: true` (futuro).
