---
id: T-057
titulo: Leitor X por perfil (OAuth2 PKCE + timeline p/ histórico)
status: inbox
tipo: feature
prioridade: P2
projeto: dome
branch: ""
responsavel: null
criado_em: 2026-09-10T04:30:00Z
atualizado_em: 2026-09-10T04:30:00Z
versao: 1
estimativa: M
dependencias: [T-044, T-047]
tags: [twitter, oauth, leitura, vault]
arquivos_relevantes:
  - /home/zatty/dome/docs/spike-twitter.md
  - /home/zatty/dome/src/lib/server/chaves.ts
clarity_score: 83
quality:
  status: pendente
  relatorio: ""
---

## Objetivo
Puxar a timeline de cada perfil via API oficial e importar para o histórico sem postar nada.

## Contexto
Spike T-049 (veredito CONTINUA, doc em dome/docs/spike-twitter.md): leitura pay-per-use barata no nosso volume; escrita segue manual. OAuth 2.0 PKCE user-context por perfil; token no vault (provedor x). Pay-per-use: ~$0,005/read — timeline 1x/dia por perfil dá centavos/mês.

## Escopo
- [ ] Fluxo OAuth2 PKCE por perfil (1 app X, authorize por perfil, salva access+refresh no vault)
- [ ] GET /2/users/by/username + GET /2/users/:id/tweets com paginação mínima
- [ ] Import para publicacoes via importarPublicacoes (T-047) marcando origem import + link
- [ ] 429 respeita Retry-After + backoff (proximoBackoff T-048); 401 marca re-auth; 403 nunca retry

## Fora de escopo
- Escrita/postagem automática (proibida até decisão explícita), DM, scrape/browser

## Critérios de aceite (Done)
- [ ] Dado perfil com token válido, quando rodo leitura, então posts entram no histórico com link e sem duplicar
- [ ] Dado 429, quando acontece, então espera Retry-After e continua sem erro fatal
- [ ] Dado token expirado, quando falha 401, então chave marcada p/ re-auth (nunca retry cego)
- [ ] Dado `bun run check` + coverage, quando rodam, então verdes

## Plano (preenchido pela IA antes de codar)
1. OAuth PKCE + vault
2. Leitor timeline + import
3. Erros 429/401/403 + testes com mock HTTP

## Handoff para próxima IA
Filha da T-049. Bloqueada em: app X criado + Client ID no ENV (humano). Sem segredo real em teste.

## Log
- 2026-09-10 (ia-opencode): criada como filha da T-049 (veredito CONTINUA).
