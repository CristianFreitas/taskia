---
id: T-053
titulo: Agenda de visitas (data, endereço, status, confirmação)
status: pronto
tipo: feature
prioridade: P1
projeto: marmita
branch: "t-053-agenda"
responsavel: null
criado_em: 2026-09-09T13:25:55.566Z
atualizado_em: 2026-09-09T13:26:55.360Z
versao: 4
estimativa: M
dependencias: [T-052]
tags: [agenda, visita, deslocamento]
arquivos_relevantes: [painel-agenda]
clarity_score: 84
quality:
  status: pendente
  relatorio: ""
---

## Objetivo
Semana organizada: quais casas, quando, e se pode ir (compra confirmada).

## Contexto
Ela roda várias casas/semana. Agenda = visitas com data, casa (T-052), endereço p/ rota, status (marcada → confirmada → feita/cancelada). Regra de ouro: visita só fica "pronta p/ ir" com compra confirmada (T-051); sem isso, alerta "visita em risco". Sem mapa/rota otimizada agora (só endereço + link p/ app de mapa).

## Escopo
- [ ] CRUD de visitas (data, casa, endereço, observações) + status com transição válida
- [ ] Visão semana (lista por dia) + "pronta p/ ir" vs "em risco" (cruza T-051)
- [ ] Botão "como chegar" (link externo p/ mapa) + cancelar com motivo
- [ ] Testes 100% das transições e do cruzamento

## Fora de escopo
- Mapa embutido/otimização de rota, notificações push, recorrência automática (futuro)

## Critérios de aceite (Done)
- [ ] Dada visita marcada sem confirmação de compra, quando abro a semana, então vejo "em risco"
- [ ] Dada confirmação chegando (T-051), quando atualizo, então a visita vira "pronta p/ ir" sem ação manual
- [ ] Dado cancelamento, quando cancelo, então motivo registrado e casa avisada? não — só registrado (sem envio)
- [ ] Dado `bun run check` + coverage, quando rodam, então verdes

## Plano
1. Modelo + CRUD + semana
2. Cruzamento T-051 + como-chegar + testes

## Handoff para próxima IA
Requer T-052 (casa). Repo /home/zatty/marmita, branch t-053-agenda.

## Log
- 2026-09-09 (ia-opencode): criada refinada do campo domicílio (score 84, v2).
- 2026-09-09T13:26:44.357Z : mover → refinando. Motivo: DoR ok
- 2026-09-09T13:26:55.360Z : mover → pronto. Motivo: DoR ok
