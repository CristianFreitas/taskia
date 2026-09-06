# 07 — Uso com Qualquer IA (sem MCP, hoje)

> O formato é o protocolo. Cole o prompt, anexe os .md, funciona em todas.

## Prompt mestre (cole + anexe `.taskia/` + `docs/03-FORMATO-TASK.md`)

```
Você é meu operador TaskIA. Leia .taskia/config.yaml, .taskia/board.md e todas as tasks em .taskia/tasks/.
Regras: 1) Nunca pule refinando→pronto se clarity<70. 2) Nunca mova inbox→fazendo. 3) Sempre escreva Log + Handoff. 4) Max 1 fazendo por responsável.
Primeiro: resuma o quadro em 5 linhas e sugira a próxima ação.
```

## Por IA

- **Opencode / Cursor / Continue (com repo):** abra a pasta do projeto. Elas leem `.taskia/` direto. Diga "opere a T-001 seguindo docs/03 e 04". Elas editam os .md como código.
- **ChatGPT / Claude Web (sem repo):** arraste `board.md` + 1-2 tasks + `03-FORMATO-TASK.md`. Funciona igual — depois você cola o .md gerado de volta em `.taskia/tasks/`.
- **Claude Desktop (com MCP):** enxerga as 10 tools. Mesmos comandos, sem copiar/colar.

## Conectar o MCP (pronto, testado via smoke)

**Opencode (este repo já vem plugado):** `opencode.json` na raiz registra o `taskia` (cwd = raiz, `.taskia/` achado sozinho). Abra o repo no Opencode e as 10 tools aparecem. Smoke: `criar_tarefa → listar → mover → transição ilegal bloqueada` OK.

**Claude Desktop / Cursor (`mcp.json`):**
```json
{
  "mcpServers": {
    "taskia": {
      "command": "bun",
      "args": ["run", "/home/zatty/task/apps/mcp/src/index.ts"],
      "env": { "TASKIA_ROOT": "/home/zatty/task/.taskia" }
    }
  }
}
```

**Web local:** `bun --filter @taskia/web dev` (ou `build` + `node build`). `TASKIA_ROOT` aponta p/ outro quadro se quiser isolar. Smoke: `GET /` 200, `POST /api/mover` move com validação, ilegal volta 422.

## 5 comandos que você vai usar todo dia

1. `Crie a T-XXX: [título]. Tipo [feature], P[1]. Objetivo: ...` → IA cria em inbox.
2. `Refine a T-XXX e dê clarity_score` → IA move inbox→refinando→pronto (ou devolve perguntas).
3. `Assuma a T-XXX e execute` → IA puxa pra fazendo, preenche Plano, codifica, move pra revisao com Log+Handoff.
4. `Revise a T-XXX: [aprovado | ajustes: ...]` → você ou 2ª IA valida.
5. `Resuma o quadro e divida a T-XXX se for G` → daily + quebra.

## Troca de IA no meio (handoff — o diferencial)

Diga pra IA atual: `Preencha o Handoff da T-XXX para a próxima IA.`
Diga pra próxima IA: `Assuma a T-XXX. Leia o Handoff e o Log e continue de onde parou. Não recomece.`

## Anti-padrões (avise a IA)

- ❌ "Faz tudo aí" sem tarefa → sempre crie/refina primeiro.
- ❌ 2 IAs na mesma T em fazendo → divide ou sequencia.
- ❌ Mover pra feito sem humano olhar revisao → proibido (ver workflow).
