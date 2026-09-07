---
id: T-030
titulo: Lista por cliente + TRAVA anti-esquecimento (killer feature)
status: pronto
tipo: feature
prioridade: P0
projeto: marmita
branch: ""
responsavel: null
criado_em: 2026-09-06T00:00:00Z
atualizado_em: 2026-09-06T00:00:00Z
versao: 2
estimativa: M
dependencias: []
tags: [painel, lista, trava, dor-principal]
arquivos_relevantes: []
clarity_score: 87
quality:
  status: pendente
  relatorio: ""
---

## Objetivo
Eliminar a dor que originou o produto: ingrediente esquecido por falha de mensagem manual.

## Contexto
Hoje ela monta a lista de cabeça/mensagem e esquece item → prato comprometido. A trava: a lista consolidada por cliente SÓ fecha 100% se todo prato escolhido tem ingredientes cadastrados (`pratosSemIngredientes` T-024). Com pendência, a lista sai marcada "INCOMPLETA — falta mapear: X" e o envio é bloqueado com caminho de correção em 1 toque. Espelha nossa filosofia de gates: nada passa incompleto.

## Escopo
- [ ] Visão por cliente: pratos escolhidos + lista consolidada + status (completa/incompleta)
- [ ] Trava: lista incompleta não gera texto de envio; banner mostra exatamente quais pratos faltam mapear
- [ ] Atalho "mapear agora" leva ao prato (T-029) e volta com lista atualizada
- [ ] Selo de confiança na lista completa ("verificada — todos os pratos mapeados")

## Fora de escopo
- Envio pelo lado dela (cliente envia — T-027), previsão de custo, estoque

## Critérios de aceite (Done)
- [ ] Dada escolha com 1 prato sem ingredientes, quando gero a lista, então status=incompleta + nome do prato + envio bloqueado
- [ ] Dado mapeamento corrigido, quando volto, então lista fica completa sem re-escolha do cliente
- [ ] Dada lista completa, quando exibo, então selo "verificada" visível

## Plano
1. Visão por cliente + status via `pratosSemIngredientes`
2. Bloqueio de envio + atalho de correção + selo

## Handoff para próxima IA
Requer T-024 (regra), T-029 (correção), T-026 (consolidação). Esta é a feature que vende o app — capriche no banner: nome do prato + botão, nunca erro genérico.

## Log
- 2026-09-06 (ia-opencode): criada refinada (score 87).
- 2026-09-06 (ia-opencode): movida refinando → pronto (score 87 ≥ 70, aceite testável, sem deps).
