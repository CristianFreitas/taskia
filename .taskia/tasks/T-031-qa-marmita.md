---
id: T-031
titulo: Gates + PWA offline + a11y + 360px no app Marmita
status: pronto
tipo: chore
prioridade: P2
projeto: marmita
branch: ""
responsavel: null
criado_em: 2026-09-06T00:00:00Z
atualizado_em: 2026-09-06T00:00:00Z
versao: 2
estimativa: M
dependencias: []
tags: [qualidade, pwa, a11y]
arquivos_relevantes: []
clarity_score: 81
quality:
  status: pendente
  relatorio: ""
---

## Objetivo
App inteiro no padrão de qualidade TaskIA, usável offline no mercado e por leitor de tela.

## Contexto
Cliente usa a lista DENTRO do mercado (sinal ruim) e a cozinheira opera o dia todo no celular. Offline não é luxo: lista e escolhas têm que abrir sem rede. Herdar `docs/09-QUALIDADE.md` integralmente evita segunda cultura de qualidade.

## Escopo
- [ ] Gates verdes (check, coverage 100% tocado, knip, jscpd, mutação core, slop ≥80)
- [ ] Offline: cardápio/escolha/lista visitados abrem sem rede; ações enfileiram e sincronizam (se houver backend; se local-first, tudo funciona)
- [ ] A11y: navegação por teclado + leitor de tela nas 5 telas (T-025..T-030), contraste AA, alvos 44px
- [ ] 360px sem scroll horizontal em todas as telas + teste em Android real

## Fora de escopo
- Novas features, backend/sync real-time, iOS nativo

## Critérios de aceite (Done)
- [ ] Dado modo avião no mercado, quando abro minha lista, então vejo tudo + marco itens normalmente
- [ ] Dado `bun run check` + coverage + knip + jscpd, quando rodam, então verdes
- [ ] Dado TalkBack ativo, quando completo o fluxo escolher→lista→enviar, então concluo sem ajuda visual

## Plano
1. Gates desde T-023 (não deixe acumular)
2. Estratégia offline + fila
3. Pass a11y + device lab 360px

## Handoff para próxima IA
Rode os gates a cada tarefa do projeto, não só aqui — esta tarefa é a certificação final.

## Log
- 2026-09-06 (ia-opencode): criada refinada (score 81).
- 2026-09-06 (ia-opencode): movida refinando → pronto (score 81 ≥ 70, aceite testável, sem deps).
