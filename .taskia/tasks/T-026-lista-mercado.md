---
id: T-026
titulo: Lista de ingredientes consolidada + check-off de mercado
status: revisao
tipo: feature
prioridade: P1
projeto: marmita
branch: "t-026-lista"
responsavel: null
criado_em: 2026-09-06T00:00:00Z
atualizado_em: 2026-09-07T18:19:43.144Z
versao: 6
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
- [x] Lista consolidada a partir da escolha confirmada (qtd somada por nome+unidade)
- [x] Origem visível ("em: strogonoff, escondidinho")
- [x] Aviso visível se algum prato escolhido está sem ingredientes
- [x] Compartilhar inline (EnvioLista: wa.me + copiar) — check-off REMOVIDO por decisão do humano (lista é leitura)

## Fora de escopo
- Edição de ingredientes pelo cliente, conversão de unidades

## Critérios de aceite (Done)
- [x] Dada escolha de 10 pratos, quando abro a lista, então cada ingrediente aparece 1x com qtd somada
- [x] Dado prato sem ingredientes na escolha, quando abro, então vejo aviso explícito (nunca lista silenciosamente incompleta)
- [x] Dado que quero mandar, quando estou na lista, então compartilho sem sair dela

## Plano
1. Lista + consolidação + origens
2. Check-off persistente + aviso de prato sem ingredientes

## Handoff para próxima IA
Requer T-024. Persistência local primeiro (mesma estratégia do rascunho T-025).

## Log
- 2026-09-06 (ia-opencode): criada refinada (score 83).
- 2026-09-06 (ia-opencode): movida refinando → pronto (score 83 ≥ 70, aceite testável, sem deps).
- 2026-09-07T03:18:04.016Z : mover → fazendo. Motivo: inicio lista consolidada + check-off
- 2026-09-07T03:18:25.077Z : mover → revisao. Motivo: lista consolidada + check-off + aviso incompleta, gates ok
- 2026-09-07T18:16:42.981Z : mover → fazendo. Motivo: retrabalho: lista vira leitura + compartilhar (sem check-off)
- 2026-09-07T18:19:43.144Z : mover → revisao. Motivo: lista leitura + compartilhar inline, gates verdes, merge main
- 2026-09-07 (ia-opencode): retrabalho humano — check-off removido (lista é leitura + compartilhar); `checks`/`chaveLista` excluídos; /enviar vira redirect; stepper 2 passos. Branch t-026b mergeada, t-026-lista apagada.
