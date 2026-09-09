---
id: T-049
titulo: Spike Twitter API v2 por perfil (leitura, limites, risco)
status: inbox
tipo: spike
prioridade: P1
projeto: dome
branch: ""
responsavel: null
criado_em: 2026-09-09T01:53:00Z
atualizado_em: 2026-09-09T01:53:00Z
versao: 1
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
- [ ] Mapear tiers API v2 (free/basic/pro): custo, limite leitura/escrita, o que quebra no free
- [ ] Protótipo descartável: OAuth por perfil + GET timeline própria + GET 1 tweet, usando chave de teste, sem commitar segredo
- [ ] Doc spike-twitter.md: fluxo OAuth, onde guardar token/refresh no vault, rate-limit + backoff, o que logar sem vazar
- [ ] Matriz risco: o que causa shadowban (rajada, horário fixo, device fixo, texto repetido) + mitigação já coberta em T-045/T-048
- [ ] Recomendação: ler via API + postar manual no MVP? justifica com custo/risco

## Fora de escopo
- Postagem automática, DM, sync total, scrape/browser, código produtivo (isso vai pra task futura linkada)

## Critérios de aceite (Done)
- [ ] Dado doc spike-twitter.md, quando leio, então sei custo/limite/fluxo OAuth e decisão leitura-vs-escrita
- [ ] Dado protótipo, quando roda com chave teste, então lê timeline sem vazar segredo em log ou git
- [ ] Dado rate-limit 429, quando acontece, então protótipo faz backoff e loga sem crash
- [ ] Veredito CONTINUA ou NÃO com motivo + próxima task linkada

## Plano (preenchido pela IA antes de codar)
1. Ler docs oficiais X API v2 + tabela tiers
2. Protótipo OAuth + 2 GETs + 429 handling
3. Doc + veredito + task filha se CONTINUA

## Handoff para próxima IA
Branch sugerida spike/T-049-twitter-api. Depende de T-044 (vault). Timebox 1 dia, se travar em OAuth trava spike e documenta.

## Log
- 2026-09-09 (ia-opencode): criada via grill-me round 2, score 82, isenta de gates por ser spike.
