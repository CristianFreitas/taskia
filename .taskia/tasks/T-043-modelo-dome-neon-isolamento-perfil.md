---
id: T-043
titulo: Modelo de dados Dome + isolamento por perfil (Neon + drizzle)
status: feito
tipo: feature
prioridade: P0
projeto: dome
branch: "feat/T-043-modelo-dome"
responsavel: ia-opencode
criado_em: 2026-09-09T01:53:00Z
atualizado_em: 2026-09-09T02:40:00Z
versao: 4
estimativa: M
dependencias: [T-042]
tags: [banco, neon, postgres, drizzle, isolamento]
arquivos_relevantes:
  - /home/zatty/dome/src/lib/server/schema.ts
  - /home/zatty/dome/drizzle.config.ts
  - /home/zatty/dome/migrations/
clarity_score: 87
quality:
  status: passando
  relatorio: reports/T-043-quality.json
---

## Objetivo
Ser fonte da verdade dos perfis no Postgres Neon com isolamento total entre perfis via drizzle + migrations.

## Contexto
Cada perfil tem: identidade, personalidade, chaves de redes sociais, memórias, publicações e cronjobs. Vazamento entre perfis destrói a camuflagem anti-IA. Molde: T-040/T-038 do marmita (dona_id + guards). DATABASE_URL só em /home/zatty/dome/.env (gitignored). Surpresa: Postgres é espelho quente; conhecimento longo fica no ai-memory com scope por perfil (dome-<slug>), Postgres guarda só o necessário pra operar.

## Escopo
- [x] Tabelas drizzle: `perfis(id uuid pk, slug unique, nome, bio, avatar_url, ativo, criado_em)`, `personalidades(perfil_id fk->cascade pk, tom_voz, bio_longa, temas_foco text[], temas_proibidos text[], exemplos_posts jsonb, prompt_sistema text, versao int)`
- [x] `chaves_api(id uuid pk, perfil_id fk->cascade, provedor text, rotulo, valor_cripto text/base64, iv text, mascara text, criada_em, unique(perfil_id, provedor, rotulo))` — desvio: text no lugar de bytea (drizzle sem bytea)
- [x] `memorias(id uuid pk, perfil_id fk->cascade, tipo text, conteudo text, embedding_ref text, peso float, criada_em)` + índice perfil_id/tipo
- [x] `publicacoes(id uuid pk, perfil_id fk->cascade, rede text, texto text, midia_urls text[], status text, agendada_para timestamptz, publicada_em timestamptz, link_externo text, prompt_hash text, runner text)`
- [x] `cronjobs(id uuid pk, perfil_id fk->cascade, nome, cron_expr, runner text, modelo text, prompt_template text, janela_inicio time, janela_fim time, ativo bool)` + `execucoes(id uuid pk, cronjob_id fk->cascade, inicio, fim, status, saida_ref, erro)`
- [x] Migrations drizzle indo e voltando do zero + seed de 1 perfil fake + testes 100% (PGlite local)

## Fora de escopo
- CRUD UI e criptografia do vault em si (T-044), prompt-builder (T-045), dispatcher cron (T-048)
- Embedding pgvector agora (futuro, só deixa `embedding_ref`)

## Critérios de aceite (Done)
- [x] Dado banco vazio, quando rodo migrations, então todas as tabelas sobem sem erro e o downgrade limpa (migrate() PGlite no teste + drizzle/down.sql p/ Neon)
- [x] Dado 2 perfis A e B, quando listo memórias/publicações de A, então zero linha de B (teste de isolamento)
- [x] Dado `.env` sem DATABASE_URL, quando subo, então erro explícito, nunca falha silenciosa (conectar() + teste)
- [x] Dado `bun run check` + coverage, quando rodam, então verdes (check 0, coverage 100%, knip 0, jscpd 0)

## Qualidade (obrigatório p/ feature/bug/chore com código, ver 09-QUALIDADE.md)
- [x] complexity: ciclomatica 1 (<22), cognitiva 6 (<22), halstead <40 (<80), loc 140 (<500)
- [x] coverage: 100% (meta 100%), crap <25 (<25), mutantes sobreviventes n/a setup (meta 0, adaptadores triviais)
- [x] dead 0 (0), redundant 0 (0), any/unknown 0 (0)
- Relatório: `reports/T-043-quality.json`

## Plano (preenchido pela IA antes de codar)
1. Schema drizzle + migrations + adapter server
2. Seed + testes isolamento + import legado se houver
3. Docs de ER em /home/zatty/dome/docs/er.md

## Handoff para próxima IA
Concluído, em revisao. Commits c2ec9cd + d026ed4 (git local, sem remote). Neon real pendente: humano cria projeto Neon do Dome e entrega DATABASE_URL → `bun run db:migrate` + `psql -f drizzle/seed.sql`. Próxima: T-044 CRUD+vault.

## Log
- 2026-09-09 (ia-opencode): criada via grill-me round 2, score 87, após T-042.
- 2026-09-09T02:25:00Z : mover → refinando. Motivo: T-042 em feito, refino com desvio bytea→text(base64) pois drizzle-orm/pg-core não tem bytea.
- 2026-09-09T02:25:00Z : mover → pronto. Motivo: DoR ok (clarity 87>=70, critérios testáveis, dep T-042 em feito).
- 2026-09-09T02:25:00Z : mover → fazendo. Motivo: inicio modelo Neon, testes via PGlite local (sem DATABASE_URL do Dome ainda).
- 2026-09-09T02:32:06Z : mover → revisao. Motivo: 7 tabelas + migrate do zero no PGlite + isolamento e cascade testados, coverage 100%, commits d026ed4/c2ec9cd. Falta só Neon real (humano).
- 2026-09-09T02:40:00Z : mover → feito (com ressalva). Motivo: humano mandou seguir; modelo validado 100% no PGlite. Sync no Neon real vira T-050 (aguarda DATABASE_URL do humano).
