# 11 — Pesquisa de Campo (antes do código, set/2026)

> O que existe, o que quebrou nossa hipótese, o que ajustamos. Sem achismo.

## 1. Concorrentes diretos

| Quem | Tamanho | O que faz | Falha que exploramos |
|---|---|---|---|
| `claude-task-master` (eyaltoledano) | 28k stars, 1.2k commits | PRD → `tasks.json` + MCP + CLI. Padrão do mercado | JSON ilegível, exige API keys (Anthropic/OpenAI), sem Kanban UI, sem quality gates. Nosso edge: `.md` legível + quadro + gates sem key extra |
| `claude-cockpit` (shmuelix) | 0 stars, 2 commits (fev/26) | Kanban + MCP + web UI + file-lock, colunas bank/todo/doing/testing/done | Valida nossa ideia, mas execução fraca (sem testes, sem design, sem gates). Oportunidade: fazer bem feito |
| `open-sunsama` | 27 stars, 579 commits | AI-native Sunsama: MCP 24 tools + REST + time-blocking + Bun + Postgres + React | Pesado (Postgres, S3, Docker). Nosso edge: local-first `.md`, zero backend, Svelte mais leve que React |

**Conclusão:** ninguém junta `.md versionável + Kanban bonito + gates de qualidade + Svelte`. Espaço aberto.

## 2. Kanban em Svelte — não construir do zero

- **SVAR Kanban (jun/2026, MIT core + PRO):** drag-drop, editor built-in, filtro/sort/group, virtualização p/ milhares de cards, TS nativo. PRO só p/ export PDF/Excel + loading dinâmico. → **Usar o core free como base do board.**
- **Flowbite-Svelte `KanbanBoard` (Svelte 5 + Tailwind v4):** alternativa menor, `bind:columns + onMove/onAddCard`. Bom fallback.
- **`@thisux/sveltednd` (Svelte 5):** dnd moderno se precisarmos de drag custom fora do SVAR.
- Decisão: SVAR Kanban free + card custom TaskIA (cores de `06`). Não reinventar dnd/virtualização.

## 3. Tooling de qualidade — 2 achados críticos

### ✅ Mantidos (fortes e vivos)
- **Knip:** padrão absoluto, removeu 300k linhas na Vercel, tem MCP, funciona com Svelte. `ts-prune` está em maintenance — **removido dos docs, fica só Knip.**
- **jscpd v5:** vivíssimo (6.1k stars, engine Rust 84ms, 224 linguagens, MCP server próprio, reporter `ai` -79% tokens, baseline p/ legado). Usado por OpenClaw e DeepSeek harness. → usar binário Rust + `--reporters ai` + `--baseline`.
- **StrykerJS + Vitest:** suporta Svelte/TS, `perTest + incremental` faz PR em 1-5min, full 30-60min no nightly. Correto.

### 🔴 Achado 1: `typhonjs-escomplex` está MORTO
Último publish há 7 anos, Snyk 53/100 Inactive, sem tipos TS. `escomplex` original parado desde 2016. **Não usar.**
Substituto (mantido, Rust/JS ativo):
- Ciclomática + cognitiva → `oxlint` (regras `complexity`) + `eslint-plugin-sonarjs` (`cognitive-complexity`, `no-duplicate-string`).
- Halstead → sem lib mantida confiável. Vira **gate secundário**: medir via script próprio em `packages/core` (conta operadores/operandos no AST via oxc) OU dropar e trocar por `maintainability index` do Sonar. Decisão: implementar contador próprio simples, threshold <80 mantido, mas sem depender de lib morta.

### 🔴 Achado 2: "0 mutantes + 100% coverage" é inalcançável literal
Evidência:
- FSE 2014 (800+ citações): ~23% dos mutantes são **equivalentes** (comportamento idêntico, impossíveis de matar).
- Google em prod: platô 70-80% mesmo com investimento pesado.
- Consenso 2026: 80%+ excelente, 90%+ raro e suspeito (teste acoplado à sintaxe, não comportamento).
**Ajuste aplicado em `09-QUALIDADE.md`:** modelo em 2 níveis —
- **PR (bloqueante):** coverage 100% nas linhas tocadas + `verificar_qualidade` zera mutantes **matáveis** nos arquivos tocados, equivalentes vão p/ `equivalent-allowlist`.
- **Nightly (tendência):** mutation score global ≥70% (ratchet: sobe 5% por mês até 80%), nunca gate de 100% global.
- `0` continua valendo como "0 sobreviventes **não-justificados**", não 0 absoluto matemático.

## 4. Bun + MCP — sem bloqueio
- SDK TS oficial é referência; roda sob Bun (precedentes: `mcp-bun` 29 stars, `Elysia-mcp` 21 stars, SSE + stdio ok).
- Manter fallback Node 22 no CI (1 job), oficial Bun.

## 5. Riscos e como mitigamos

| Risco | Probabilidade | Mitigação |
|---|---|---|
| Gates travam velocidade da IA | alta | 2 níveis (PR rápido, nightly completo), allowlist de equivalentes |
| SVAR Kanban PRO faltar recurso | média | core free cobre 90%; virtualização já inclusa; PRO só export |
| TaskMaster dominar mercado | média | diferenciar: md+kanban+gates+sem-key, não PRD→JSON |
| Halstead sem lib | baixa | contador próprio via oxc, gate secundário |

## 6. O que mudou nos docs por causa desta pesquisa
- `09-QUALIDADE.md`: troca escomplex → oxlint+sonarjs, mutação em 2 níveis, ts-prune removido, jscpd Rust + AI reporter.
- `10-STACK.md`: SVAR Kanban como base (não dnd próprio).
- Próximo: scaffold já nasce com `knip + jscpd + stryker incremental + oxlint` ligados.
