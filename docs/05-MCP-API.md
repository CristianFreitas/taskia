# 05 — MCP API (contrato fechado p/ desenvolver)

> 10 tools. Nada mais. Se implementar isso, qualquer IA opera o quadro com qualidade.

Servidor: `taskia-mcp` · runtime: **Bun + TypeScript strict** (ver `10-STACK.md`) · transporte: `stdio` (local) + `SSE` (remoto futuro) · raiz: `.taskia/` do workspace. Core compartilhado com a UI em `packages/core`.

## Tools

### 1. `criar_tarefa`
Cria `.taskia/tasks/T-XXX-slug.md` com status `inbox`.
```json
{ "titulo": "string (obrigatório)", "tipo": "bug|feature|chore|spike|decisao", "prioridade": "P0|P1|P2|P3", "projeto": "id|null (default projeto_padrao)", "objetivo": "string", "contexto": "string", "tags": ["string"] }
```
Retorna: `{ "id": "T-004", "arquivo": ".taskia/tasks/T-004-slug.md", "clarity_score_inicial": 20 }`
Erro `VALIDATION` se `projeto` não existe no config.

### 2. `listar_tarefas`
```json
{ "status": "fazendo|null", "responsavel": "ia-opencode|null", "prioridade": "P0|null", "projeto": "taskia|null", "busca": "texto|null" }
```
Retorna lista resumida (id, titulo, status, projeto, prioridade, responsavel, clarity). Sem corpo — economiza tokens.

### 3. `obter_tarefa` (Context Pack)
Retorna frontmatter + corpo COMPLETO + tarefas dependentes resumidas. É o que a IA chama antes de executar.
```json
{ "id": "T-001" }
```

### 4. `atualizar_tarefa`
Patch validado. Incrementa `versao`.
```json
{ "id": "T-001", "versao_esperada": 3, "campos": { "objetivo": "...", "escopo": "..." }, "entrada_log": "refinei critérios" }
```
Erro `STALE_VERSION` se versão divergir. Erro `VALIDATION` com motivo legível.

### 5. `mover_tarefa` (coração)
```json
{ "id": "T-001", "para": "revisao", "motivo": "implementação pronta", "responsavel": "ia-opencode" }
```
Valida máquina de estados + DoR/DoD + WIP + dependências. Erro explica: ex. `BLOQUEADO: depende de T-002 (pronto, não feito)`.
Escritas (`criar/mover/atualizar/comentar/dividir`) passam por lockfile único do board (`.board.lock`, stale >5s assumido, timeout 5s vira erro — nunca hang), então chamadas concorrentes não perdem update.

### 6. `comentar_log`
Append no `## Log` sem mexer no resto. Barato e seguro p/ progresso.
```json
{ "id": "T-001", "autor": "ia-opencode", "texto": "testes passando, abrindo PR #12" }
```

### 7. `dividir_tarefa`
Quebra tarefa grande em 2+. Original vai pra `arquivado` com link, filhas nascem em `refinando` com `dependencias` ligadas e **herdam o `projeto`** da original.
```json
{ "id": "T-001", "subtarefas": [{ "titulo": "..." }, { "titulo": "..." }] }
```

### 8. `resumir_quadro`
Visão p/ daily. Conta por coluna, travadas (>2d em fazendo), bloqueadas, top-3 próximas por prioridade+dependência. Agrupa por projeto.
```json
{ "projeto": "taskia|null (filtra um projeto; omitido = todos)" }
```
Retorna markdown pronto p/ colar no chat + JSON.

### 9. `avaliar_clareza`
Calcula clarity_score (0-100) + lista o que falta. Chamada antes de `mover p/ pronto`.
```json
{ "id": "T-001" }
```
Retorna: `{ "score": 65, "faltando": ["sem fora_de_escopo", "aceite não testável"], "pode_ir_para_pronto": false }`

### 10. `verificar_qualidade` (Quality Gates, ver 09-QUALIDADE.md)
Lê `reports/T-XXX-quality.json` + roda checks rápidos (tsc, knip, jscpd) e valida os 10 limites. Bloqueia `fazendo → revisao` e `revisao → feito` se vermelho.
```json
{ "id": "T-001" }
```
Retorna: `{ "passando": false, "falhas": ["ciclomatica 27 em src/auth/login.ts:process (>22)", "coverage 82% (<100%)"], "relatorio": "reports/T-001-quality.json" }`

## Erros padrão

```json
{ "code": "TRANSICAO_INVALIDA|VALIDATION|STALE_VERSION|WIP_LOTADO|DEPENDENCIA_PENDENTE|QUALIDADE_REPROVADA|NAO_ENCONTRADO", "message": "humano-legível + como corrigir", "detalhes": {} }
```

## Exemplo de sessão (Opencode/Claude)

```
IA: obter_tarefa(T-001) → lê Context Pack
IA: avaliar_clareza(T-001) → 85, ok
IA: mover_tarefa(T-001 → fazendo, responsavel=ia-opencode)
IA: ... codifica ...
IA: verificar_qualidade(T-001) → passando (10/10 verdes)
IA: comentar_log(T-001, "pronto, testes ok")
IA: mover_tarefa(T-001 → revisao, motivo="aguardando humano")
Humano: move no Kanban → feito (ou MCP faz)
```

Implementação Fase 1: ~400 linhas Bun+TS. Core = `validar(frontmatter) + ler/escrever .md + verificar_qualidade`. Sem banco. Core em `packages/core` reused pela UI SvelteKit.
