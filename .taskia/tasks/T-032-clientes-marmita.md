---
id: T-032
titulo: Levantar cozinheiras clientes B2B (assinatura)
status: pronto
tipo: spike
prioridade: P1
projeto: marmita
branch: ""
responsavel: null
criado_em: 2026-09-06T00:00:00Z
atualizado_em: 2026-09-06T00:00:00Z
versao: 3
estimativa: P
dependencias: []
tags: [validacao, b2b, assinatura, discovery]
arquivos_relevantes: []
clarity_score: 83
quality:
  status: pendente
  relatorio: ""
---

## Objetivo
Validar o modelo B2B: cozinheiras pagando assinatura mensal pelo app, com 5 conversas reais.

## Contexto
Modelo corrigido: quem PAGA é a cozinheira (assinatura); os clientes finais dela usam grátis. Cliente zero/parceira de design: a cozinheira atual (dor real, confiança pronta). Alvo: cozinheiras que vendem marmita/planos (ex: R$400 = 10 pratos/ciclo) e sofrem com cardápio + lista manual no WhatsApp. Sem código — conversa + planilha. Faixa de preço da assinatura a descobrir (âncora: fração de um plano vendido).

## Escopo
- [ ] Mapear 10+ cozinheiras candidatas (região, vende plano/marmita, opera no WhatsApp hoje)
- [ ] Roteiro de 5 perguntas (como monta cardápio hoje, já esqueceu ingrediente, pagaria assinatura, quanto, o que a faria cancelar)
- [ ] 5 conversas + registro (planilha simples) + descoberta de faixa de preço
- [ ] Lista final: 2–3 parceiras de design nomeadas + objeções + preço-âncora encontrado

## Fora de escopo
- Código, contrato, cobrança recorrente, integração com Listou (futuro registrado, não agora)

## Critérios de aceite (Done)
- [ ] Dadas 5 conversas, quando consolido, então ≥3 confirmam a dor (cardápio/lista manual) + topam pagar assinatura em alguma faixa
- [ ] Dada a descoberta, quando termino, então entrego faixa de preço + 2–3 parceiras de design nomeadas
- [ ] Dadas objeções, quando registro, então cada uma tem resposta ou vira item de produto (nova tarefa linkada)

## Plano
1. Mapear candidatas + roteiro
2. Conversar + consolidar preço e parceiras

## Handoff para próxima IA
Se validação falhar (<3 dispostas a pagar), NÃO codar o resto — voltar com aprendizados e repriorizar. Faça esta antes da T-025. Cliente zero = cozinheira atual.

## Log
- 2026-09-06 (ia-opencode): criada refinada (score 82).
- 2026-09-06 (ia-opencode): movida refinando → pronto (score 82 ≥ 70, aceite testável, sem deps).
- 2026-09-06 (ia-opencode): pivô B2B (humano) — pagante é a cozinheira por assinatura, não o consumidor; cliente zero = atual; Listou = integração futura. Versão 3, score 83.
