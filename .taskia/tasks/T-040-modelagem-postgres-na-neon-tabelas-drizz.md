---
id: T-040
titulo: Modelagem Postgres na Neon (tabelas + drizzle + migrations)
status: revisao
tipo: feature
prioridade: P0
projeto: marmita
branch: "t-040-neon"
responsavel: null
criado_em: 2026-09-07T17:15:43.747Z
atualizado_em: 2026-09-07T17:29:25.668Z
versao: 6
estimativa: M
dependencias: []
tags: [banco, neon, postgres, drizzle]
arquivos_relevantes: [marmita-schema, drizzle-config, migrations]
clarity_score: 86
quality:
  status: pendente
  relatorio: ""
---

## Objetivo
Sair do JSON em disco: Postgres gratuito na Neon como fonte da verdade do servidor, com migrations versionadas.

## Contexto
Decisão (humano): Neon free tier. Projeto: `ep-orange-violet-ac8vphem` · região `sa-east-1` · banco `neondb` · usuário `neondb_owner` (pooler). URL completa com senha SÓ em `/home/zatty/marmita/.env` (gitignored) — nunca em arquivo commitado. Acesso via driver serverless (`@neondatabase/serverless`, HTTP — sem pool TCP, funciona em qualquer hospedagem) + `drizzle-orm` (tipado, leve, SQL visível). Catálogo local (pratos/clientes no aparelho) continua local por ora — servidor passa a ser dono de: contas, sessões, publicados e escolhas.

## Escopo
- [ ] Projeto + banco na Neon (free), `DATABASE_URL` no `.env`, `data/*.json` aposentado (script importa o legado 1x, se existir)
- [ ] Schema drizzle: `cozinheiras(id uuid pk, nome, whatsapp unique, senha_hash, criada_em)`, `sessoes(token_hash pk, cozinheira_id fk → cascade, expira_em)`, `cardapios(codigo text pk 6 letras, dona_id fk, ciclo, cozinheira_nome, qtd_pratos, publicado_em)`, `pratos_cardapio(id uuid pk, cardapio_codigo fk → cascade, prato_id, nome, descricao, ingredientes jsonb)`, `escolhas(id uuid pk, cardapio_codigo fk → cascade, cliente_nome, prato_ids text[], confirmada_em, unique(cardapio_codigo, cliente_nome))` + índices em fk/expira
- [ ] Migrations `drizzle-kit` indo e voltando do zero num banco limpo; adapter da lib server (`banco-server.ts`) lendo/escrevendo via drizzle sem mudar sua API pública
- [ ] Testes 100% contra banco de teste (segundo banco Neon ou `PGlite` local — o que doer menos)

## Fora de escopo
- Auth em si (T-037), isolamento lógico (T-038), sync de catálogo local (futuro), backup PITR (plano pago, futuro)

## Critérios de aceite (Done)
- [ ] Dado banco Neon vazio, quando rodo as migrations, então todas as tabelas sobem sem erro e o downgrade limpa
- [ ] Dado `POST /api/cardapios` + escolha, quando consulto o banco, então linhas nas tabelas certas com `dona_id` e unique respeitado
- [ ] Dado `.env` sem `DATABASE_URL`, quando subo, então erro explícito na cara (nunca falha silenciosa)
- [ ] Dado `bun run check` + coverage, quando rodam, então verdes

## Plano
1. Neon + drizzle + schema + migrations
2. Adapter da lib + importação do legado + testes

## Handoff para próxima IA
Repo /home/zatty/marmita, branch t-040-neon. Humano cria o projeto na Neon e entrega a `DATABASE_URL`. Base das T-037/038/039 — faça esta primeiro.

## Log
- 2026-09-07 (ia-opencode): criada refinada (score 86, v2).
- 2026-09-07 (ia-opencode): humano entregou DATABASE_URL — salva em marmita/.env (gitignored); tarefa documenta só host/banco/usuário. Inicio execução.
- 2026-09-07T17:16:49.180Z : mover → refinando. Motivo: score 86, base sem deps
- 2026-09-07T17:16:53.496Z : mover → pronto. Motivo: DoR ok, base da trilha auth
- 2026-09-07T17:24:16.434Z : mover → fazendo. Motivo: inicio modelagem Neon
- 2026-09-07T17:29:25.668Z : mover → revisao. Motivo: Neon no ar: 5 tabelas, adapter drizzle, testes 100%, e2e ok, merge main
