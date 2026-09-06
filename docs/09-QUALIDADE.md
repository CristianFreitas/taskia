# 09 — Quality Gates (lei para toda tarefa com código)

> Nenhum código vai pra `revisao` sem passar no PR-gate. Nenhum vai pra `feito` sem confirmação.
> A IA executa, mede, anexa o relatório na tarefa. Sem relatório = tarefa inválida.
> Pesquisa que sustenta cada escolha: `11-PESQUISA-CAMPO.md`.

## Os 10 mandamentos (thresholds oficiais)

| # | Métrica | Limite | O que é em 1 linha | Ferramenta que mede |
|---|---|---|---|---|
| 1 | Cyclomatic Complexity | `< 22` por função | nº de caminhos independentes (if/for/case). Acima = impossível testar | `oxlint` (`complexity`) — pegou `parseTask` com 26 no dogfood, quebramos em helpers |
| 2 | Cognitive Complexity | `< 22` por função | quanto um humano sua pra entender (aninhamento pesa mais) | ✅ `packages/metrics` (walker próprio via API do TS, subset Sonar documentado em `cognitiva.ts`) — `bun run check:cognitiva`, fiado no `check` raiz (T-004; oxlint não tem a regra, sonarjs/escomplex mortos — ver 11) |
| 3 | Halstead Difficulty | `< 80` por arquivo (secundário) | quão denso/operador-pesado o código é | contador próprio em `packages/core` via oxc (escomplex/typhonjs mortos — ver 11) |
| 4 | Lines of Code per File | `< 500` | arquivo grande = responsabilidade demais, quebre | CI check (`wc` / scc) |
| 5 | Test Coverage | `100%` lines+branches **nas linhas tocadas** | nada de "funciona na minha máquina" | `vitest --coverage` (v8) |
| 6 | CRAP | `< 25` por função | risco = complexidade × falta de teste. Alto = bomba | report `vitest --coverage` + complexidade |
| 7 | Surviving mutants | `0 não-justificados` nos arquivos tocados (PR) / score global ≥70% (nightly) | mutação que o teste não matou = teste fraco; ~23% são equivalentes e imatáveis (FSE 2014) | `StrykerJS` (`perTest` + `incremental`, ver workflow 2 níveis abaixo) |
| 8 | Dead code | `0` | export/função sem uso | `knip` (ts-prune descontinuado — não usar; imports `$types` do SvelteKit removidos do src porque o knip não resolve o módulo virtual em monorepo — svelte-check resolve sozinho) |
| 9 | Redundant code | `0` clones novos (baseline p/ legado) | duplicação / clone | `jscpd` binário Rust + `--reporters ai` + `--baseline` (configs de ferramenta por pacote — `vitest.config.ts`, `stryker.conf.json` — ignorados por decisão: declarativos e versionados de propósito, ver decisions.log) |
| 10 | `any` / `unknown` sem narrow | `0` | TypeScript estrito de verdade. `unknown` só com type-guard no mesmo arquivo | `tsc --strict + eslint @typescript-eslint/no-explicit-any` |

## Onde mora na tarefa

Frontmatter ganha:
```yaml
quality:
  status: pendente | passando | falhando   # padrão: pendente
  relatorio: reports/T-001-quality.json     # caminho do JSON gerado pelo CI/IA
```

Corpo ganha seção obrigatória (toda tarefa tipo `feature/bug/chore` com código):
```markdown
## Qualidade (preenchido pela IA ao mover p/ revisao)
- [ ] complexity: ciclomatica __ (<22), cognitiva __ (<22), halstead __ (<80), loc __ (<500)
- [ ] coverage: __% (meta 100%), comando: `bun run test:coverage T-001`
- [ ] crap: __ (<25), mutantes sobreviventes: __ (meta 0), comando: `bun run test:mutation T-001`
- [ ] dead: __ (meta 0) `bunx knip`, redundant: __ (meta 0) `bunx jscpd`, any/unknown: __ (meta 0) `bunx tsc --noEmit`
- Relatório: `reports/T-XXX-quality.json` anexado
```

Tarefa `spike/decisao` sem código: marca `quality.status: isento` + motivo no Log.

## Workflow de verificação (o que a IA faz) — 2 níveis

**Nível 1 — PR-gate (bloqueante, 1-5min, roda sempre):**
1. Codou → roda `bun run check:T-XXX` (oxlint + tsc + vitest coverage nos tocados + knip + jscpd `--baseline` + stryker `--since main` incremental).
2. Verde → preenche `## Qualidade`, move `fazendo → revisao` com `motivo` + hash do relatório.
3. Vermelho → NÃO move. Fica em `fazendo`, loga o que quebrou, quebra a função/arquivo e roda de novo.

**Nível 2 — Nightly (tendência, 30-60min, não bloqueia PR):**
4. `stryker run` full + mutation score global. Gate: ≥70% (ratchet +5%/mês até 80%). 90%+ não é meta global (vira teste frágil).
5. Mutantes equivalentes vão p/ allowlist com motivo — não contam como falha. "0" = 0 sobreviventes **não-justificados**, não 0 matemático. Concretamente em `packages/core/stryker.conf.json`: `mutator.excludedMutations: ["StringLiteral"]` (texto de mensagem de erro é dado, não comportamento; os CÓDIGOS de erro seguem cobertos por asserts `toContain`). Score medido no dogfood: **84.77** (55.99 → 71.07 → 76.86 → 85.39 → 84.77 após fix do Log único; segue ≥70).
6. Bun + Stryker: plugin vitest-resolver quebra no install isolado do Bun — fixado com path explícito `plugins: ["./node_modules/@stryker-mutator/vitest-runner/dist/src/index.js"]`.

Humano (ou 2ª IA) em `revisao` roda `verificar_qualidade` (tool 10 do MCP) que relê o JSON e confirma. Divergiu = volta pra `fazendo`.

## Por que esses números

- 22 (não 10): limite clássico McCabe 10 é dos anos 70 p/ C. Em TS moderno com early-return, 15-20 é saudável. 22 é o teto antes de virar legado — acima disso nem 100% coverage salva.
- Halstead <80: acima = arquivo precisa ser dividido mesmo com LOC ok (muita densidade operatória).
- LOC <500: força SRP. Kanban com arquivo de 2000 linhas trava review da IA (estoura contexto).
- Coverage 100% nas linhas tocadas (não no repo inteiro): pragmático e impede desculpa.
- CRAP <25 + 0 mutantes: coverage sozinho mente (teste sem assert passa). Mutação prova que o teste presta.
- 0 any/unknown: com Svelte 5 runes + TS strict, `any` esconde bug reativo. `unknown` só com narrow explícito.

## Comandos padrão (todo repo TaskIA tem)

```json
{
  "scripts": {
    "check": "tsc --noEmit && eslint . && oxlint",
    "test:coverage": "vitest run --coverage",
    "test:mutation:pr": "stryker run --since main",
    "test:mutation:full": "stryker run",
    "dead": "knip",
    "dup": "jscpd src --reporters ai --baseline .jscpd-baseline.json",
    "check:cognitiva": "bun packages/metrics/src/check-cli.ts packages apps",
    "check:T": "bun run check && bun run test:coverage"
  }
}
```
