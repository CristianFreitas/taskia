---
id: T-044
titulo: CRUD perfis + vault de chaves API por perfil
status: inbox
tipo: feature
prioridade: P0
projeto: dome
branch: ""
responsavel: null
criado_em: 2026-09-09T01:53:00Z
atualizado_em: 2026-09-09T01:53:00Z
versao: 1
estimativa: M
dependencias: [T-043]
tags: [crud, vault, crypto, auth, perfis]
arquivos_relevantes:
  - /home/zatty/dome/src/routes/perfis/
  - /home/zatty/dome/src/lib/server/vault.ts
  - /home/zatty/dome/src/lib/server/guards.ts
clarity_score: 85
quality:
  status: pendente
  relatorio: ""
---

## Objetivo
Permitir criar/editar/arquivar perfis e salvar chaves Twitter/redes com criptografia e isolamento.

## Contexto
Humano pediu: cada perfil tem suas chaves do Twitter/redes sociais. Segredo nunca aparece em log, nunca commita, UI mostra só máscara (••••1234). Criptografia AES-256-GCM com MASTER_KEY só no .env. Guards: toda query filtra por perfil_id da sessão. Molde: T-037/T-038 marmita (login + isolamento por cozinheira).

## Escopo
- [ ] CRUD perfis (nome, slug, bio, avatar, ativo/arquivar, nunca hard-delete se tem publicações)
- [ ] Vault: adicionar/girar/revogar chave por (perfil_id, provedor, rotulo) com AES-GCM + iv aleatório + teste de roundtrip
- [ ] Mascaramento na leitura (só últimos 4) + descriptografia só no server em runtime, nunca no client
- [ ] Guards server-side: helper requirePerfil(session, perfil_id) + testes de cross-access negado
- [ ] UI lista + detalhe + formulário chaves com confirmação de revogar

## Fora de escopo
- Personalidade/prompt-builder (T-045), cronjobs (T-048), postagem real no Twitter (T-049)

## Critérios de aceite (Done)
- [ ] Dado perfil A logado, quando tento ler chave do perfil B via API, então 403 e nada no corpo
- [ ] Dado chave salva, quando olho banco/log/UI, então só vejo bytea + máscara, nunca plaintext
- [ ] Dado MASTER_KEY ausente, quando subo, então erro explícito na cara
- [ ] Dado `bun run check` + coverage, quando rodam, então verdes

## Qualidade (obrigatório p/ feature/bug/chore com código, ver 09-QUALIDADE.md)
- [ ] complexity: ciclomatica __ (<22), cognitiva __ (<22), halstead __ (<80), loc __ (<500)
- [ ] coverage: __% (meta 100%), crap __ (<25), mutantes sobreviventes __ (meta 0)
- [ ] dead __ (0), redundant __ (0), any/unknown __ (0)
- Relatório: `reports/T-044-quality.json`

## Plano (preenchido pela IA antes de codar)
1. vault.ts (encrypt/decrypt) + testes sem segredo real
2. Rotas CRUD + guards + testes isolamento
3. UI perfis + chaves com máscara

## Handoff para próxima IA
Branch sugerida feat/T-044-crud-vault. Depende de T-043. Nunca logue valor descriptografado, nem em teste.

## Log
- 2026-09-09 (ia-opencode): criada via grill-me round 2, score 85.
