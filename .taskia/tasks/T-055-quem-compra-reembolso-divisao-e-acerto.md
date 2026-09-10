---
id: T-055
titulo: Quem compra + reembolso (divisão e acerto)
status: revisao
tipo: feature
prioridade: P1
projeto: marmita
branch: "t-055-reembolso"
responsavel: null
criado_em: 2026-09-09T13:26:00.075Z
atualizado_em: 2026-09-10T05:01:01.718Z
versao: 6
estimativa: P
dependencias: []
tags: [compras, reembolso, acerto]
arquivos_relevantes: [lista-divisao]
clarity_score: 83
quality:
  status: pendente
  relatorio: ""
---

## Objetivo
Fim da ambiguidade: definido quem compra o quê, e reembolso acertado sem conta de cabeça.

## Contexto
Regra do mercado: ingredientes em geral o cliente compra — mas ela às vezes adianta (tempero que faltou, emergência). Por lista/visita: marcar itens "cliente compra" vs "eu compro"; o que ela comprou vira "a reembolsar" com valor; acerto fecha a conta (soma − pagos) e gera texto p/ Zap. Sem foto de nota agora (futuro).

## Escopo
- [ ] Divisão por item da lista (cliente/eu, padrão: cliente) + total "a reembolsar"
- [ ] Lançar valor pago por ela por item + acerto (soma, abatimentos, saldo) + texto p/ Zap
- [ ] Marcar reembolsado com data; histórico por casa
- [ ] Testes 100% (divisão, soma, acerto zerado/positivo)

## Fora de escopo
- Foto/OCR de nota, pagamento dentro do app, integração com T-054 além do texto (futuro)

## Critérios de aceite (Done)
- [ ] Dada lista dividida, quando somo, então "a reembolsar" bate centavo a centavo
- [ ] Dado acerto feito, quando marco, então histórico guarda com data e texto gerado
- [ ] Dada divisão padrão, quando abro, então tudo começa como "cliente compra" (regra do mercado)
- [ ] Dado `bun run check` + coverage, quando rodam, então verdes

## Plano
1. Divisão + soma
2. Acerto + texto + histórico + testes

## Handoff para próxima IA
Repo /home/zatty/marmita, branch t-055-reembolso. Valores em centavos (nunca float).

## Log
- 2026-09-09 (ia-opencode): criada refinada do campo domicílio (score 83, v2).
- 2026-09-09T13:26:48.269Z : mover → refinando. Motivo: DoR ok
- 2026-09-09T13:27:02.501Z : mover → pronto. Motivo: DoR ok
- 2026-09-10T04:57:35.821Z : mover → fazendo. Motivo: inicio quem-compra + reembolso
- 2026-09-10T05:01:01.718Z : mover → revisao. Motivo: acerto com texto e historico, gates verdes, merge main
