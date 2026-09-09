---
id: T-035
titulo: Revisão UI/UX do layout (passos, progresso, voltar, dark)
status: revisao
tipo: feature
prioridade: P1
projeto: marmita
branch: "t-035-uix"
responsavel: null
criado_em: 2026-09-07T12:47:05.223Z
atualizado_em: 2026-09-09T01:44:24.251Z
versao: 8
estimativa: P
dependencias: []
tags: [ux, a11y, layout]
arquivos_relevantes: [apps-marmita-layout, cardapio, lista, enviar, painel]
clarity_score: 84
quality:
  status: pendente
  relatorio: ""
---

## Objetivo
Usuária nunca se perde nem trava: sabe onde está, quanto falta e como voltar, no claro e no escuro.

## Contexto
Auditoria no app funcional (/home/zatty/marmita): sem indicador de passos (cliente não sabe que depois da escolha vem lista e envio), sem barra de progresso visual, sem "voltar" nas telas, painel sem atalho p/ montar cardápio, botões lado a lado estouram (w-full em flex), inputs brancos fixos quebram o dark, escolha salva não pré-carrega ao reeditar.

## Escopo
- [ ] Stepper `Passos` (1 Cardápio → 2 Lista → 3 Enviar, `aria-current`) nas 3 telas de cliente
- [ ] Barra de progresso (`role=progressbar`) no cardápio (X/10) e na lista (riscados/total)
- [ ] Links "← voltar" em lista, enviar, painel/cardapio, painel/cliente
- [ ] Atalho "Montar cardápio" no painel + reedição pré-carrega escolha salva
- [ ] Fix: botões lado a lado em grid (painel, form prato) + inputs com `color-scheme: light`

## Fora de escopo
- Mudar identidade/tokens, novas features, teste em device real

## Critérios de aceite (Done)
- [ ] Dada qualquer tela de cliente, quando abro, então vejo em qual passo estou (1/2/3)
- [ ] Dado dark mode, quando abro forms, então inputs legíveis sem bloco branco estourado
- [ ] Dada escolha salva, quando volto ao cardápio, então meus 10 já vêm marcados
- [ ] Dado `bun run check` + coverage, quando rodam, então verdes

## Plano
1. Passos + progressos + voltar
2. Fixes layout/dark + pré-carregar
3. Gates verdes

## Handoff para próxima IA
Repo em /home/zatty/marmita, branch t-035-uix. Dev em http://localhost:5199/.

## Log
- 2026-09-07 (ia-opencode): criada refinada (score 84, v2).
- 2026-09-07T12:47:22.430Z : mover → refinando. Motivo: escopo de auditoria definido
- 2026-09-07T12:47:24.614Z : mover → pronto. Motivo: score 84, aceite testavel, sem deps
- 2026-09-07T12:47:30.010Z : mover → fazendo. Motivo: inicio refinamento UI/UX
- 2026-09-07T12:49:47.021Z : mover → revisao. Motivo: stepper+progresso+voltar+fixes, gates verdes, merge main
- 2026-09-09T01:40:48.928Z : mover → fazendo. Motivo: retrabalho: home vira landing da cozinheira + renomeio ListaCerta
- 2026-09-09T01:44:24.251Z : mover → revisao. Motivo: home landing + renomeio, gates verdes, merge main
- 2026-09-09 (ia-opencode): retrabalho humano — home vira landing de venda p/ cozinheira (sem "sou cliente"); nome proposto ListaCerta (título, marca, manifest, package); login no header; /cardapio local mantido p/ teste da cozinheira.
