---
id: T-021
titulo: Branch obrigatória por tarefa, merge exigido no feito
status: revisao
tipo: feature
prioridade: P0
projeto: taskia
branch: feat/T-021-branch-por-tarefa
responsavel: ia-opencode
criado_em: 2026-09-06T00:00:00Z
atualizado_em: 2026-09-06T00:00:00Z
versao: 4
estimativa: M
dependencias: []
tags: [core, mcp, workflow, git]
arquivos_relevantes:
  - packages/core/src/types.ts
  - packages/core/src/parse-task.ts
  - packages/core/src/mover.ts
  - packages/core/src/nova.ts
  - apps/mcp/src/index.ts
  - docs/03-FORMATO-TASK.md
  - docs/04-QUADRO-WORKFLOW.md
  - docs/09-QUALIDADE.md
clarity_score: 88
quality:
  status: passando
  relatorio: ""
---

## Objetivo
Toda tarefa com código roda em branch própria (`tipo/T-XXX-slug`), campo `branch` sempre preenchido a partir de `fazendo`, e `feito` exige merge na `main`.

## Contexto
Regra anterior (commit+push por tarefa, T-020 era era push-direto-na-main) não isola trabalho nem garante `main` verde. Branch por tarefa dá isso. Risco mapeado: arquivos compartilhados (`board.md`, `decisions.log.md`, `config.yaml`) conflitam no merge — mitigação: 1 linha por tarefa cada (auto-merge na maioria) + regra de rebase com keep-both documentada. Sem PR obrigatório no solo; merge com `--no-ff` p/ rastreabilidade.

## Escopo
- [ ] Core: `branch: string` no frontmatter (default `""`); `fazendo`/`revisao` exigem não-vazio; formato `^(feat|fix|chore|docs|spike)/T-\d+-.+$`
- [ ] Core: `NovaTarefa`/esqueleto incluem `branch: ""`; `dividir`/`criar` propagam
- [ ] MCP: `criar_tarefa` aceita `branch` opcional; `mover_tarefa` p/ `fazendo` exige branch (sugere nome no erro); `atualizar_tarefa` permite trocar branch antes de `fazendo`
- [ ] Verificação de merge como script documentado (`git merge-base --is-ancestor`), NÃO enforcement no MCP (sem shell/git no server; decisão explícita)
- [ ] Backfill: `feito` → `branch: main`; `arquivado`/exemplos → `branch: ""` + cláusula de grandfather nos docs
- [ ] Docs 03 (campo+regras), 04 (nomenclatura, ciclo de vida da branch, conflitos em arquivos compartilhados), 09 (gate)

## Fora de escopo
- PRs/obrigatoriedade de review (solo), CI remoto, `git worktree`, enforcement de merge dentro do MCP, mudar formato de `board.md`

## Critérios de aceite (Done)
- [ ] Dada tarefa sem `branch` indo p/ `fazendo` via MCP, quando move, então erro `VALIDATION` sugerindo o nome da branch
- [ ] Dado `branch: "main-errada"`, quando valida, então erro de formato com o padrão esperado
- [ ] Dado `esqueletoNovaTarefa`, quando gera, então contém `branch: ""`
- [ ] Dadas 20 tarefas antigas, quando parseadas, então `feito`→`main`, resto `""`, sem quebrar nada

## Plano
1. Core (tipos, parse, validação, esqueleto + testes 100%)
2. MCP (schemas + handlers + smoke em board temporário)
3. Backfill + docs 03/04/09 + gates + stryker

## Handoff para próxima IA
`mover.ts`/`transitions.ts` têm as gates de `fazendo` — leia antes. `atualizar_tarefa` faz replace textual de campos; siga o padrão existente. Knip implica tipos exportados com uso cruzado.

## Log
- 2026-09-06: criada refinada (score 88, proposta do humano + condição de merge simples).
- 2026-09-06 (ia-opencode): refinando → pronto (clarity 88, sem deps) → fazendo.
- 2026-09-06 (ia-opencode): implementado (branch.ts + gate em aplicarMovimento, MCP criar/atualizar, backfill 21 tarefas, docs 03/04/09); smoke achou bug real em atualizar (replace com valor vazio corrompia — fix com regex de linha) + race pré-existente registrada em T-022; stryker 84.89; fazendo → revisao.

## Qualidade (preenchido pela IA ao mover p/ revisao)
- [x] complexity: oxlint verde; branch.ts fns pequenas
- [x] coverage: core 100% (inclui validarBranch/sugerirBranch/fronteiras) · stryker 84.89 ≥ 70
- [x] dead 0 (knip), redundant 0 (jscpd 0), any/unknown 0 (tsc+eslint verdes; corrigido no-unnecessary-condition e no-confusing-void-expression no caminho)
- [x] `review:slop` 100 · MCP smoke sequencial 5/5 cenários
