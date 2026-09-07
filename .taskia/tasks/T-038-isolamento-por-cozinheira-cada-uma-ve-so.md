---
id: T-038
titulo: Isolamento por cozinheira (cada uma vê só o dela)
status: pronto
tipo: feature
prioridade: P0
projeto: marmita
branch: "t-038-isolamento"
responsavel: null
criado_em: 2026-09-07T16:25:30.303Z
atualizado_em: 2026-09-07T16:26:18.478Z
versao: 5
estimativa: M
dependencias: [T-040, T-037]
tags: [auth, isolamento, multi-cozinheira]
arquivos_relevantes: [marmita-server-dona, painel-filtrado]
clarity_score: 85
quality:
  status: pendente
  relatorio: ""
---

## Objetivo
Duas cozinheiras no mesmo servidor sem ver nem tocar nos dados uma da outra.

## Contexto
Gap admitido: hoje o servidor é global — sem filtro, qualquer dona logada leria escolhas de outra via `GET /api/escolhas?codigo=`. Modelo (colunas já criadas na T-040): todo cardápio/escolha carrega `dona_id`; sessão (T-037) define a dona; toda query filtra por ela. Link público `/c/*` continua aberto (só leitura do cardápio + postar escolha). Legado importado na T-040 é vinculado à primeira cozinheira aqui, registrado no log.

## Escopo
- [ ] `dona_id` filtrado em todas as queries (publicar carimba, listar exige dona); `GET /api/escolhas?codigo=` só responde se o código é da dona logada (401/404 senão)
- [ ] Painel só lista/recebe o que é da dona; teste de invasão (dona B tenta ler código da dona A → negado)
- [ ] Vinculação do legado importado à primeira cozinheira + testes 100% do filtro

## Fora de escopo
- Sincronizar clientes/pratos locais entre aparelhos (futuro), pagamento/assinatura, auditoria

## Critérios de aceite (Done)
- [ ] Dada dona B logada, quando pede escolhas do código da dona A, então negado (nunca 200 com dado alheio)
- [ ] Dada dona A, quando publica, então código novo nasce com `donaId` dela e só ela lista
- [ ] Dado legado importado sem dona, quando vinculo, então nada se perde e dona registrada no log
- [ ] Dado `bun run check` + coverage, quando rodam, então verdes

## Plano
1. Modelo + filtro server + testes (incl. teste de invasão)
2. Painel filtrado + migração

## Handoff para próxima IA
Requer T-040 (colunas) + T-037 (sessão). Depois desta, o multi-cozinheira B2B é real e a assinatura (futura) tem onde pendurar.

## Log
- 2026-09-07 (ia-opencode): criada refinada (score 85, v2).
- 2026-09-07T16:26:12.517Z : mover → refinando. Motivo: score 85, depende T-037 registrada
- 2026-09-07T16:26:18.478Z : mover → pronto. Motivo: DoR ok
- 2026-09-07 (ia-opencode): re-refino Postgres (v5) — filtro via `dona_id` da T-040, deps [T-040, T-037], score mantido 85.
