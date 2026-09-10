---
id: T-054
titulo: Cobrança (pacote, Pix, recibo, lembrete)
status: revisao
tipo: feature
prioridade: P1
projeto: marmita
branch: "t-054-cobranca"
responsavel: null
criado_em: 2026-09-09T13:25:58.070Z
atualizado_em: 2026-09-10T04:33:57.688Z
versao: 6
estimativa: P
dependencias: []
tags: [cobranca, pix, pagamento]
arquivos_relevantes: [painel-cobranca]
clarity_score: 82
quality:
  status: pendente
  relatorio: ""
---

## Objetivo
Receber sem constrangimento: pacote claro, Pix fácil, recibo e lembrete educado.

## Contexto
Ela cobra diária ou pacote e corre atrás no Zap. Cobrança = registrar o combinado por casa (diária/pacote, valor), gerar texto Pix (chave + valor, copia-e-cola), recibo simples (texto p/ mandar no Zap) e lembrete de vencido (texto pronto, ela envia — sem disparo automático). Sem gateway de pagamento (futuro da assinatura é outro produto).

## Escopo
- [ ] Combinado por casa (tipo diária/pacote + valor + dia de vencimento)
- [ ] Texto Pix pronto (chave dela + valor) + recibo em texto p/ Zap
- [ ] Visão "a receber / recebido / vencido" + marcar recebido com data
- [ ] Lembrete em texto pronto (tom educado, com nome e valor); testes 100%

## Fora de escopo
- Gateway/pagamento online, disparo automático, nota fiscal, assinatura do app

## Critérios de aceite (Done)
- [ ] Dada casa com pacote vencido, quando abro, então vejo "vencido há X dias" + texto de lembrete pronto
- [ ] Dado recebimento, quando marco, então sai de "a receber" com data registrada
- [ ] Dado texto Pix, quando copio, então chave + valor corretos
- [ ] Dado `bun run check` + coverage, quando rodam, então verdes

## Plano
1. Combinado + visão de status
2. Textos Pix/recibo/lembrete + testes

## Handoff para próxima IA
Repo /home/zatty/marmita, branch t-054-cobranca. Tom dos textos: firme e gentil, PT-BR simples.

## Log
- 2026-09-09 (ia-opencode): criada refinada do campo domicílio (score 82, v2).
- 2026-09-09T13:26:46.234Z : mover → refinando. Motivo: DoR ok
- 2026-09-09T13:26:57.243Z : mover → pronto. Motivo: DoR ok
- 2026-09-10T04:29:19.490Z : mover → fazendo. Motivo: inicio cobranca
- 2026-09-10T04:33:57.688Z : mover → revisao. Motivo: cobranca com textos, gates verdes, merge main
