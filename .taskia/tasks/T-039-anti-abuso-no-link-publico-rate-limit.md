---
id: T-039
titulo: Anti-abuso no link público (rate-limit + flood)
status: pronto
tipo: feature
prioridade: P1
projeto: marmita
branch: "t-039-antiflood"
responsavel: null
criado_em: 2026-09-07T16:25:30.303Z
atualizado_em: 2026-09-07T16:26:20.466Z
versao: 4
estimativa: P
dependencias: []
tags: [abuso, rate-limit, link-publico]
arquivos_relevantes: [marmita-ratelimit, api-escolhas]
clarity_score: 83
quality:
  status: pendente
  relatorio: ""
---

## Objetivo
Link público aguenta gente chata: sem flood de escolhas falsas nem derrubar o servidor.

## Contexto
Cliente é anônimo por decisão (sem login = sem fricção), então a porta aberta precisa de porteiro: rate-limit por IP nas rotas públicas + trava de repetição (mesmo nome não confirma 2x em 1 min) + teto de escolhas por código/dia. Sem captcha agora (fricção p/ senhora no celular) — reavaliar se abuso real aparecer. Login (`POST /api/auth/*`) entra no mesmo limitador com teto mais baixo.

## Escopo
- [ ] Limitador em memória (IP + rota, janela deslizante; 429 com `Retry-After`) nas rotas públicas e de auth
- [ ] Idempotência curta: mesma (código+nome) 1 confirmação/min; teto/dia por código configurável
- [ ] Testes 100% do limitador (estoura, reseta após janela, IPs isolados)
- [ ] Log discreto de bloqueios (contagem, sem PII além de IP)

## Fora de escopo
- Captcha, WAF/CDN, bloqueio permanente/ban, DDoS real (infra futura)

## Critérios de aceite (Done)
- [ ] Dado IP estourando o teto, quando insiste, então 429 com `Retry-After` (nunca trava p/ os outros)
- [ ] Dado flood do mesmo nome, quando repete em <1min, então 2ª é rejeitada sem duplicar
- [ ] Dado uso normal (1 cliente escolhendo), quando confirma, então nunca bloqueado
- [ ] Dado `bun run check` + coverage, quando rodam, então verdes

## Plano
1. Limitador + testes
2. Plugar nas rotas + log de bloqueios

## Handoff para próxima IA
Repo /home/zatty/marmita, branch t-039-antiflood. Janela em memória zera no restart — documentado como limite aceito (persistir é T-futura).

## Log
- 2026-09-07 (ia-opencode): criada refinada (score 83, v2). ID corrigido (colisão na criação paralela).
- 2026-09-07T16:26:14.360Z : mover → refinando. Motivo: score 83, sem deps
- 2026-09-07T16:26:20.466Z : mover → pronto. Motivo: DoR ok
