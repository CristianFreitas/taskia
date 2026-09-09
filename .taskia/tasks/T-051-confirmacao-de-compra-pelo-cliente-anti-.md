---
id: T-051
titulo: Confirmação de compra pelo cliente (anti-visita-perdida)
status: pronto
tipo: feature
prioridade: P0
projeto: marmita
branch: "t-051-confirma"
responsavel: null
criado_em: 2026-09-09T13:25:42.932Z
atualizado_em: 2026-09-09T13:26:50.564Z
versao: 4
estimativa: M
dependencias: []
tags: [visita, confirmacao, cliente]
arquivos_relevantes: [link-lista, painel-visita]
clarity_score: 86
quality:
  status: pendente
  relatorio: ""
---

## Objetivo
Cozinheira só sai de casa com a compra garantida: cliente confirma "comprei tudo" no link.

## Contexto
Maior dor do campo: chegar na casa e não ter ingrediente (viagem perdida). Mecânica: junto da lista no link público, botão "Já comprei tudo ✓" (com data/hora); painel mostra por cliente/casa: pendente / confirmado em X. Sem confirmação, painel alerta "não vá ainda". Sem login do cliente (1 toque, sem fricção); anti-flood reaproveita T-039.

## Escopo
- [ ] Botão de confirmação no `/c/[codigo]/lista` (nome já conhecido da escolha) + timestamp no servidor
- [ ] Status no painel (página da cliente/casa): pendente vs confirmado + quando
- [ ] Alerta "visita em risco" quando há visita marcada (T-053) sem confirmação
- [ ] Testes 100% (confirmar, reconfirmar atualiza, código inválido nega)

## Fora de escopo
- Login do cliente, foto do comprovante/nota (futuro), agenda em si (T-053)

## Critérios de aceite (Done)
- [ ] Dado cliente que confirmou, quando abro o painel, então vejo "confirmado em DD/MM HH:MM"
- [ ] Dada reconfirmação, quando confirma de novo, então atualiza o timestamp (nunca duplica)
- [ ] Dado link inválido, quando tenta confirmar, então negado
- [ ] Dado `bun run check` + coverage, quando rodam, então verdes

## Plano
1. Coluna/endpoint de confirmação + testes
2. Botão no link + status/alerta no painel

## Handoff para próxima IA
Repo /home/zatty/marmita, branch t-051-confirma. Coluna nova (migration drizzle) ou campo na escolha — o que doer menos, mas documente.

## Log
- 2026-09-09 (ia-opencode): criada refinada do campo domicílio (score 86, v2).
- 2026-09-09T13:26:39.343Z : mover → refinando. Motivo: DoR ok
- 2026-09-09T13:26:50.564Z : mover → pronto. Motivo: DoR ok
