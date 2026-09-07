---
id: T-024
titulo: Modelo de dados Marmita + seed (clientes, planos, pratos, escolhas)
status: revisao
tipo: feature
prioridade: P0
projeto: marmita
branch: "t-024-modelo"
responsavel: null
criado_em: 2026-09-06T00:00:00Z
atualizado_em: 2026-09-07T03:17:18.051Z
versao: 4
estimativa: P
dependencias: []
tags: [modelo, dados]
arquivos_relevantes: []
clarity_score: 86
quality:
  status: pendente
  relatorio: ""
---

## Objetivo
Entidades e dados de exemplo que sustentam cardápio, escolha, lista e painel.

## Contexto
Domínio real: cliente tem plano (ex: R$400 = 10 pratos por ciclo de 15 dias); cozinheira publica cardápio do ciclo; cliente escolhe 10; ingredientes dos escolhidos viram lista de mercado. Sem pagamento (fora de escopo do produto).

## Escopo
- [ ] Tipos TS: `Cliente(nome, whatsapp, planoId, cicloInicio)`, `Plano(nome, valor, qtdPratos, diasCiclo)`, `Prato(nome, descricao, ingredientes[{nome, qtd, unidade}])`, `Cardapio(ciclo, pratoIds, publicado)`, `Escolha(clienteId, cardapioId, pratoIds[10])`
- [ ] Seed: 1 plano (400/10/15d), 12 pratos com ingredientes, 1 cliente demo, 1 cardápio publicado
- [ ] Regras puras testáveis: `podeEscolher` (10 exatos, só do cardápio), `consolidarIngredientes` (soma qtd por nome+unidade), `pratosSemIngredientes` (base da trava T-030)

## Fora de escopo
- Persistência real (localStorage primeiro; backend depois se doer), telas, WhatsApp

## Critérios de aceite (Done)
- [ ] Dada escolha com 9 ou 11 pratos, quando valido, então rejeita com motivo
- [ ] Dados 2 pratos com "arroz 1kg" e "arroz 500g", quando consolido, então somo por unidade (não misturo kg com g sem conversão explícita)
- [ ] Dado prato sem ingredientes, quando listo, então aparece em `pratosSemIngredientes`

## Plano
1. Tipos + funções puras + testes 100%
2. Seed demo consistente com as regras

## Handoff para próxima IA
Unidades: some só igual (`kg`+`kg`); unidades diferentes listam separado (conversão é T-futura). `pratosSemIngredientes` alimenta a trava da T-030.

## Log
- 2026-09-06 (ia-opencode): criada refinada (score 86).
- 2026-09-06 (ia-opencode): movida refinando → pronto (score 86 ≥ 70, aceite testável, sem deps).
- 2026-09-07T03:15:36.983Z : mover → fazendo. Motivo: inicio modelo de dados + regras
- 2026-09-07T03:17:18.051Z : mover → revisao. Motivo: regras puras + seed + store, coverage 100%, check 0/0
