---
id: T-037
titulo: Login da cozinheira (cadastro, sessão, guards)
status: pronto
tipo: feature
prioridade: P0
projeto: marmita
branch: "t-037-login"
responsavel: null
criado_em: 2026-09-07T16:25:30.294Z
atualizado_em: 2026-09-07T16:26:15.871Z
versao: 4
estimativa: M
dependencias: []
tags: [auth, cozinheira, sessao]
arquivos_relevantes: [marmita-login, hooks-auth, api-auth]
clarity_score: 86
quality:
  status: pendente
  relatorio: ""
---

## Objetivo
Só a dona entra no painel: cadastro simples + login + sessão + logout, sem conta p/ cliente.

## Contexto
Decisão: cliente segue anônimo no link público (T-039 cuida do abuso); cozinheira tem conta (nome + whatsapp + senha). Sessão em cookie httpOnly + SameSite=Lax (30 dias, "lembrar de mim" implícito p/ não-técnica). Senha com scrypt (node:crypto, sem lib externa). Guards: `hooks.server.ts` barra `/painel/*` sem sessão e `POST /api/cardapios` exige dona; `/c/*` e `POST /api/escolhas` seguem abertos.

## Escopo
- [ ] Cadastro (nome, whatsapp único, senha ≥8) + login (whatsapp + senha) + logout + tela `/entrar`
- [ ] Sessão opaca em `data/` (token aleatório 32B → cozinheiraId + expira), cookie httpOnly
- [ ] Guard em hooks + 401 JSON nas APIs protegidas + redirect p/ `/entrar` no painel
- [ ] Testes 100% da lib de auth (hash, sessão, expiração); mostra "Olá, {nome}" no painel

## Fora de escopo
- Isolamento dos dados entre cozinheiras (T-038), OAuth/social, recuperação de senha (futuro), rate-limit de login (T-039 cobre padrão)

## Critérios de aceite (Done)
- [ ] Dada visitante sem sessão, quando abre `/painel`, então cai em `/entrar` (nunca vê dado)
- [ ] Dado `POST /api/cardapios` sem cookie, quando chama, então 401 (nunca publica)
- [ ] Dada senha cadastrada, quando olho o disco, então só hash scrypt (nunca texto puro)
- [ ] Dado `bun run check` + coverage, quando rodam, então verdes

## Plano
1. Lib auth + testes + telas entrar/cadastro
2. Hooks + guards + nome no painel

## Handoff para próxima IA
Repo /home/zatty/marmita, branch t-037-login. Sessões em `data/` (gitignored). T-038 vem logo depois e parte daqui.

## Log
- 2026-09-07 (ia-opencode): criada refinada (score 86, v2).
- 2026-09-07T16:26:10.535Z : mover → refinando. Motivo: score 86, aceite testavel, sem deps
- 2026-09-07T16:26:15.871Z : mover → pronto. Motivo: DoR ok
