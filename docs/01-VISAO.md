# 01 — Visão e Princípios

## O problema que sentimos na pele

- Prompts soltos no chat se perdem. Daqui 2 dias ninguém lembra o que a IA fez.
- Jira/Linear/Trello são feitos pra humano clicar. IA não clica — IA lê texto e chama tools.
- Cada IA (ChatGPT, Claude, Opencode, Cursor) tem um jeito. O quadro precisa ser universal.
- Tarefa vaga = IA alucina. Tarefa boa = IA entrega.

## A tese da TaskIA

> **Se o contexto mora na tarefa, e a tarefa mora num .md versionado, qualquer IA opera o quadro e qualquer humano audita.**

## 5 princípios inegociáveis (AI-First)

1. **Texto antes de banco.** Fonte da verdade é `.md` com frontmatter YAML. Legível por humano, IA e git. Nada de Postgres na Fase 0-1.
2. **MCP é interface primária, UI é secundária.** Primeiro a IA precisa operar 100% via tools. O Kanban web é só um espelho bonito do `.md`.
3. **Nenhuma tarefa sem Done.** Sem `criterios_de_aceite` não existe tarefa — existe ideia (vai pra `inbox`).
4. **Uma tarefa, um dono, um WIP.** Humano ou IA, nunca os dois executando junto. IA faz no máximo 1 `fazendo` por vez (evita context-switch e alucinação).
5. **Memória é arquivo, não lembrança.** Decisões vão pra `decisions.log.md`. Handoff vai na tarefa. Trocar de IA não pode perder história.

## O que NÃO é

- Não é mais um Todoist. É quadro de execução com contexto rico.
- Não é chat com IA. É estado persistente que a IA manipula.
- Não é SaaS preso. Fase 0-1 roda local, offline, no seu repo.

## Nome e identidade (proposta)

- **Nome:** TASKIA
- **Tagline:** "Dê contexto. A IA move."
- **Logo ideia:** quadrado kanban com 3 colunas + cursor de terminal `▊` na coluna do meio.
- **Tom de voz:** direto, técnico, sem burocracia. PT-BR por padrão.
