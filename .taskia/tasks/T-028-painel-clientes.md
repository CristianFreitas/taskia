---
id: T-028
titulo: Painel cozinheira — clientes, planos e ciclo de 15 dias
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
tags: [painel, clientes, ciclo]
arquivos_relevantes: []
clarity_score: 82
quality:
  status: pendente
  relatorio: ""
---

## Objetivo
Cozinheira vê quem são seus clientes, qual plano/ciclo de cada um e quem já escolheu.

## Contexto
Operação real: plano R$400 = 10 pratos / ciclo de 15 dias. Ela precisa responder "quem falta escolher?" e "de quem vence o ciclo?". Painel simples, mobile-first (ela opera no celular), sem jargão. Dados do modelo T-024.

## Escopo
- [ ] CRUD mínimo de clientes (nome, whatsapp, plano, início do ciclo)
- [ ] CRUD de planos (nome, valor, qtd pratos, dias do ciclo)
- [ ] Visão por ciclo: dias restantes, status da escolha (pendente/enviada), atalho p/ lista do cliente (T-030)
- [ ] Virada de ciclo: encerrar atual e abrir próximo sem perder histórico

## Fora de escopo
- Cobrança/pagamento, montar cardápio (T-029), autenticação multi-usuário

## Critérios de aceite (Done)
- [ ] Dada cliente com ciclo iniciado há 13 dias, quando abro o painel, então vejo "vence em 2 dias" + status da escolha
- [ ] Dado ciclo encerrado, quando viro, então escolhas/listas antigas continuam consultáveis
- [ ] Dada usuária não-técnica, quando usa, então nenhuma ação destrutiva sem confirmação

## Plano
1. CRUD clientes + planos
2. Visão de ciclo + virada com histórico

## Handoff para próxima IA
Requer T-024. Um único perfil (ela) — sem login; proteção por obscuridade da URL + aviso de que auth real é T-futura se o app for multi-cozinheira.

## Log
- 2026-09-06 (ia-opencode): criada refinada (score 82).
- 2026-09-06 (ia-opencode): movida refinando → pronto (score 82 ≥ 70, aceite testável, sem deps).
