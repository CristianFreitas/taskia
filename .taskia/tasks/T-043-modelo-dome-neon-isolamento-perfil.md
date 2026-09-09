---
id: T-043
titulo: Modelo de dados Dome + isolamento por perfil (Neon + drizzle)
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
dependencias: [T-042]
tags: [banco, neon, postgres, drizzle, isolamento]
arquivos_relevantes:
  - /home/zatty/dome/src/lib/server/schema.ts
  - /home/zatty/dome/drizzle.config.ts
  - /home/zatty/dome/migrations/
clarity_score: 87
quality:
  status: pendente
  relatorio: ""
---

## Objetivo
Ser fonte da verdade dos perfis no Postgres Neon com isolamento total entre perfis via drizzle + migrations.

## Contexto
Cada perfil tem: identidade, personalidade, chaves de redes sociais, memórias, publicações e cronjobs. Vazamento entre perfis destrói a camuflagem anti-IA. Molde: T-040/T-038 do marmita (dona_id + guards). DATABASE_URL só em /home/zatty/dome/.env (gitignored). Surpresa: Postgres é espelho quente; conhecimento longo fica no ai-memory com scope por perfil (dome-<slug>), Postgres guarda só o necessário pra operar.

## Escopo
- [ ] Tabelas drizzle: `perfis(id uuid pk, slug unique, nome, bio, avatar_url, ativo, criado_em)`, `personalidades(perfil_id fk->cascade pk, tom_voz, bio_longa, temas_foco text[], temas_proibidos text[], exemplos_posts jsonb, prompt_sistema text, versao int)`
- [ ] `chaves_api(id uuid pk, perfil_id fk->cascade, provedor text, rotulo, valor_cripto bytea, iv bytea, mascara text, criada_em, unique(perfil_id, provedor, rotulo))`
- [ ] `memorias(id uuid pk, perfil_id fk->cascade, tipo text, conteudo text, embedding_ref text, peso float, criada_em)` + índice perfil_id/tipo
- [ ] `publicacoes(id uuid pk, perfil_id fk->cascade, rede text, texto text, midia_urls text[], status text, agendada_para timestamptz, publicada_em timestamptz, link_externo text, prompt_hash text, runner text)`
- [ ] `cronjobs(id uuid pk, perfil_id fk->cascade, nome, cron_expr, runner text, modelo text, prompt_template text, janela_inicio time, janela_fim time, ativo bool)` + `execucoes(id uuid pk, cronjob_id fk->cascade, inicio, fim, status, saida_ref, erro)`
- [ ] Migrations drizzle indo e voltando do zero + seed de 1 perfil fake + testes 100% (PGlite local ou banco de teste Neon)

## Fora de escopo
- CRUD UI e criptografia do vault em si (T-044), prompt-builder (T-045), dispatcher cron (T-048)
- Embedding pgvector agora (futuro, só deixa `embedding_ref`)

## Critérios de aceite (Done)
- [ ] Dado banco vazio, quando rodo migrations, então 7 tabelas sobem e downgrade limpa sem erro
- [ ] Dado 2 perfis A e B, quando listo memórias/publicações de A, então zero linha de B (teste de isolamento)
- [ ] Dado `.env` sem DATABASE_URL, quando subo, então erro explícito, nunca falha silenciosa
- [ ] Dado `bun run check` + coverage, quando rodam, então verdes

## Qualidade (obrigatório p/ feature/bug/chore com código, ver 09-QUALIDADE.md)
- [ ] complexity: ciclomatica __ (<22), cognitiva __ (<22), halstead __ (<80), loc __ (<500)
- [ ] coverage: __% (meta 100%), crap __ (<25), mutantes sobreviventes __ (meta 0)
- [ ] dead __ (0), redundant __ (0), any/unknown __ (0)
- Relatório: `reports/T-043-quality.json`

## Plano (preenchido pela IA antes de codar)
1. Schema drizzle + migrations + adapter server
2. Seed + testes isolamento + import legado se houver
3. Docs de ER em /home/zatty/dome/docs/er.md

## Handoff para próxima IA
Branch sugerida feat/T-043-modelo-dome. Depende de T-042 pronta. Molde: /home/zatty/marmita branch t-040-neon (adapter banco-server.ts).

## Log
- 2026-09-09 (ia-opencode): criada via grill-me round 2, score 87, após T-042.
