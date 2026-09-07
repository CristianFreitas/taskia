---
id: T-001
titulo: Implementar login com magic link
status: arquivado
tipo: feature
prioridade: P1
projeto: taskia
responsavel: null
criado_em: 2026-09-05T10:00:00Z
atualizado_em: 2026-09-06T00:00:00Z
versao: 4
estimativa: M
dependencias: []
tags: [auth, backend]
arquivos_relevantes:
  - src/auth/login.ts
  - docs/02-ARQUITETURA.md
clarity_score: 85
quality:
  status: pendente
  relatorio: reports/T-001-quality.json
---

## Objetivo
Permitir login sem senha via link enviado por e-mail.

## Contexto
Usuários esquecem senha e o reset atual tem fricção. Magic link reduz suporte. Decisão em decisions.log (2026-09-04): usar token JWT de 15min, não sessão longa.

## Escopo
- [x] Gerar token + enviar e-mail
- [ ] Validar token + criar sessão
- [ ] Testes do fluxo feliz + expirado

## Fora de escopo
- Login social (Google/GitHub) — fica pra T-futura
- Rate-limit avançado (só básico agora)

## Critérios de aceite (Done)
- [ ] Dado e-mail válido, quando solicito link, então recebo e-mail em <60s
- [ ] Dado link válido, quando clico, então estou logado
- [ ] Dado link expirado (>15min), quando clico, então vejo erro amigável

## Plano (preenchido pela IA antes de codar)
1. Criar tabela magic_tokens + gerar JWT
2. Endpoint POST /auth/magic + GET /auth/callback
3. Testes com e-mail fake

## Qualidade (preenchido pela IA ao mover p/ revisao)
- [ ] complexity: ciclomatica __ (<22), cognitiva __ (<22), halstead __ (<80), loc __ (<500)
- [ ] coverage: __% (meta 100%), crap __ (<25), mutantes sobreviventes __ (meta 0)
- [ ] dead __ (0), redundant __ (0), any/unknown __ (0)
- Relatório: `reports/T-001-quality.json`

## Handoff para próxima IA
Estou no passo 1, branch feat/T-001-magic-link. Falta validar token. Se pegar agora, rode testes em src/auth/ e continue do callback.

## Log
- 2026-09-05 10:00 (humano): criada em inbox, refinada pra pronto (score 85).
- 2026-09-05 12:00 (ia-opencode): puxei pra fazendo, iniciei implementação.
- 2026-09-06 (humano, via "finalize"): exemplo do scaffold aposentado — `src/auth/login.ts` nunca existiu, era fixture de formato. Arquivo preservado como referência (docs/03 o cita). fazendo → arquivado.
