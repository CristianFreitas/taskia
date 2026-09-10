---
id: T-049
titulo: Spike Twitter API v2 por perfil (leitura, limites, risco)
status: revisao
tipo: spike
prioridade: P1
projeto: dome
branch: "spike/T-049-twitter-api"
responsavel: ia-opencode
criado_em: 2026-09-09T01:53:00Z
atualizado_em: 2026-09-10T04:35:00Z
versao: 3
estimativa: P
dependencias: [T-044]
tags: [spike, twitter, api, oauth, risco]
arquivos_relevantes:
  - /home/zatty/dome/docs/spike-twitter.md
  - /home/zatty/dome/src/lib/server/twitter.ts
clarity_score: 82
quality:
  status: isento
  relatorio: spike sem código produtivo, só docs + protótipo descartável
---

## Objetivo
Decidir como o Dome lê (e um dia posta) no Twitter/X por perfil sem tomar ban nem estourar custo.

## Contexto
Dome guarda 1 chave por perfil (T-044) mas ainda não sabemos: OAuth 1.0a vs 2.0, escopos, limites free/basic/pro, o que dá pra ler sem pagar, e o que dispara detecção. Spike timeboxado: protótipo descartável + doc de decisão. Regra: leitura primeiro, escrita manual com review; nada de scrape/browser no MVP por risco.

## Escopo
- [x] Mapear tiers API v2: pay-per-use p/ novos (fev/2026) — $0,005/read, $0,015/post, $0,20 com URL, teto 2M reads
- [x] Protótipo descartável: 2 GETs sem credencial (401 + 403 user-context), executado e DELETADO, sem segredo
- [x] Doc spike-twitter.md: OAuth2 PKCE por perfil, vault, rate-limit/backoff, o que logar sem vazar
- [x] Matriz risco: rajada, horário, texto, device, DM, scrape + mitigações T-045/T-048
- [x] Recomendação: leitura API + escrita manual (custo centavos, risco manda)

## Fora de escopo
- Postagem automática, DM, sync total, scrape/browser, código produtivo (isso vai pra task futura linkada)

## Critérios de aceite (Done)
- [x] Dado doc spike-twitter.md, quando leio, então sei custo/limite/fluxo OAuth e decisão leitura-vs-escrita
- [x] Dado protótipo sem credencial, quando roda, então mapeia 401/403 sem vazar nada (timeline real exige token — T-057)
- [x] Dado rate-limit 429, quando acontecer, então contrato documentado (Retry-After + backoff T-048, 401 re-auth, 403 nunca retry)
- [x] Veredito CONTINUA com motivo + task filha T-057 linkada

## Plano (preenchido pela IA antes de codar)
1. Ler docs oficiais X API v2 + tabela tiers
2. Protótipo OAuth + 2 GETs + 429 handling
3. Doc + veredito + task filha se CONTINUA

## Handoff para próxima IA
Concluído, em revisao (spike: revisão = ler o doc). Commit 3a36961 no dome (só docs). Filha T-057 (leitor X) bloqueada em app X + Client ID no ENV (humano).

## Log
- 2026-09-09 (ia-opencode): criada via grill-me round 2, score 82, isenta de gates por ser spike.
- 2026-09-10T04:20:00Z : mover → refinando → pronto → fazendo. Motivo: dep T-044 em feito, timebox 1 dia.
- 2026-09-10T04:35:00Z : mover → revisao. Motivo: tiers mapeados + 401/403 provados + doc + veredito CONTINUA + filha T-057. Protótipo deletado.
