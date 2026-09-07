---
id: T-026
titulo: Lista de ingredientes consolidada + check-off de mercado
status: pronto
tipo: feature
prioridade: P1
projeto: marmita
branch: ""
responsavel: null
criado_em: 2026-09-06T00:00:00Z
atualizado_em: 2026-09-06T00:00:00Z
versao: 2
estimativa: M
dependencias: []
tags: [cliente, lista, mercado]
arquivos_relevantes: []
clarity_score: 83
quality:
  status: pendente
  relatorio: ""
---

## Objetivo
Transformar os 10 pratos escolhidos na lista de mercado pronta, marcável item a item.

## Contexto
É o coração do valor: cliente confirma escolha → vê "arroz 2kg, frango 3kg..." somados (`consolidarIngredientes` T-024). Uso no mercado com uma mão: check-off grande, riscado persiste, agrupar por categoria (secos, carnes, hortifruti) se dado existir.

## Escopo
- [ ] Lista consolidada a partir da escolha confirmada (qtd somada por nome+unidade)
- [ ] Check-off persistente (marcar/desmarcar sobrevive a fechar o app)
- [ ] Indicar origem (tocar item mostra "em: strogonoff, escondidinho")
- [ ] Aviso visível se algum prato escolhido está sem ingredientes (link p/ T-030 trava do lado dela)

## Fora de escopo
- Envio WhatsApp (T-027), edição de ingredientes pelo cliente, conversão de unidades

## Critérios de aceite (Done)
- [ ] Dada escolha de 10 pratos, quando abro a lista, então cada ingrediente aparece 1x com qtd somada
- [ ] Dado item marcado, quando fecho e reabro o app, então continua marcado
- [ ] Dado prato sem ingredientes na escolha, quando abro, então vejo aviso explícito (nunca lista silenciosamente incompleta)

## Plano
1. Lista + consolidação + origens
2. Check-off persistente + aviso de prato sem ingredientes

## Handoff para próxima IA
Requer T-024. Persistência local primeiro (mesma estratégia do rascunho T-025).

## Log
- 2026-09-06 (ia-opencode): criada refinada (score 83).
- 2026-09-06 (ia-opencode): movida refinando → pronto (score 83 ≥ 70, aceite testável, sem deps).
