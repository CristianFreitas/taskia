# 04 — Quadro e Workflow

## Colunas (ordem fixa, cores fixas)

| # | Coluna (id) | Nome exibido | Cor | WIP | Quem usa |
|---|---|---|---|---|---|
| 0 | `inbox` | 📥 Inbox | cinza `#8A8F98` | ∞ | qualquer um joga ideia aqui, sem julgamento |
| 1 | `refinando` | 🔍 Refinando | amarelo `#EAB308` | 5 | IA transforma ideia em tarefa válida + clarity_score |
| 2 | `pronto` | ✅ Pronto | azul `#3B82F6` | 10 | fila puxada. Só entra com clarity ≥70 |
| 3 | `fazendo` | ⚡ Fazendo | âmbar `#F59E0B` | 3 total, 1 por dono | execução. IA ou humano |
| 4 | `revisao` | 👀 Revisão | roxo `#8B5CF6` | 5 | humano valida (ou 2ª IA revisa) |
| 5 | `feito` | 🎉 Feito | verde `#10B981` | ∞ | entregue. Vira memória |
| 6 | `arquivado` | 📦 Arquivado | cinza escuro `#52525B` | ∞ | descartado/duplicado. Nunca deleta |

Bloqueio não é coluna — é flag `bloqueado: true` (borda vermelha `#EF4444` + 🔴 no card).

## Transições permitidas (máquina de estados)

```
inbox → refinando / arquivado
refinando → pronto / inbox (voltou, faltou info) / arquivado
pronto → fazendo / refinando
fazendo → revisao / pronto (desistiu/devolveu) / refinando
revisao → feito / fazendo (ajuste solicitado)
feito → arquivado (limpeza mensal)
qualquer → arquivado (com motivo no Log)
```

⛔ Proibido: `inbox → fazendo` (pula refinamento), `fazendo → feito` (pula revisão), `feito → fazendo` (reabrir cria nova tarefa linkada).

## Regras de operação

1. **Puxar, não empurrar.** Ninguém joga tarefa em `fazendo` pros outros. Cada dono puxa de `pronto`.
2. **Definition of Ready (p/ ir pra pronto):** clarity ≥70 + aceite testável + sem dependência pendente.
3. **Definition of Done (p/ ir pra feito):** aceite 100% + log do que foi entregue + sem TODO escondido + humano deu OK em `revisao` + **Quality Gates verdes (ver `09-QUALIDADE.md`): ciclomática <22, cognitiva <22, halstead <80, LOC <500, coverage 100%, CRAP <25, mutantes 0, dead 0, redundant 0, any/unknown 0**.
4. **Daily da IA:** `resumir_quadro` toda manhã: o que travou, o que está em `fazendo` há >2 dias, próxima sugestão.
5. **Branch por tarefa (obrigatória):** prefixo por tipo (`feat|fix|chore|docs|spike`, ex: `feat/T-021-branch-por-tarefa`, `docs/` p/ `decisao`). Cria ao puxar p/ `fazendo`, registra no campo `branch`. Commit cita ID. `feito` exige merge na `main` (`git merge-base --is-ancestor <branch> main`); sem PR obrigatório no solo, merge com `--no-ff`.
6. **Conflito em arquivos compartilhados** (`board.md`, `decisions.log.md`, `config.yaml`): 1 linha por tarefa cada → auto-merge na maioria. Se conflitar: rebase na `main` e mantenha os dois lados (nunca apague linha alheia).

## Prioridades (cor da borda esquerda do card)

- `P0-crítico` — vermelho `#EF4444` — quebrou prod / trava tudo. Fura fila.
- `P1-alta` — laranja `#F97316`
- `P2-média` — azul `#3B82F6` (padrão)
- `P3-baixa` — cinza `#A1A1AA`

## Tipos (ícone do card)

- `feature` ✨ · `bug` 🐛 · `chore` 🧹 · `spike` 🔬 (timebox, termina em decisão) · `decisao` 🧠
