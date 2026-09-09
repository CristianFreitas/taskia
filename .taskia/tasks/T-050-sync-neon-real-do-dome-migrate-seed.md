---
id: T-050
titulo: Sync Neon real do Dome (migrate + seed)
status: inbox
tipo: chore
prioridade: P1
projeto: dome
branch: ""
responsavel: null
criado_em: 2026-09-09T02:40:00Z
atualizado_em: 2026-09-09T02:40:00Z
versao: 1
estimativa: PP
dependencias: []
tags: [neon, banco, ops]
arquivos_relevantes:
  - /home/zatty/dome/drizzle/0000_worried_madame_masque.sql
  - /home/zatty/dome/drizzle/seed.sql
clarity_score: 85
quality:
  status: isento
  relatorio: tarefa operacional sem código, só comandos + conferência
---

## Objetivo
Aplicar migration e seed do Dome no Neon real quando o humano entregar a DATABASE_URL.

## Contexto
T-043 validou tudo no PGlite local; o Neon do Dome ainda não existe. Humano cria o projeto na Neon (região sa-east-1 de preferência) e entrega a DATABASE_URL para /home/zatty/dome/.env (gitignored). Desbloqueia teste fim-a-fim real das T-044+.

## Escopo
- [ ] Salvar DATABASE_URL no /home/zatty/dome/.env (nunca commitar, conferir git status limpo de segredo)
- [ ] Rodar `bun run db:migrate` contra o Neon e conferir 7 tabelas
- [ ] Rodar `psql $DATABASE_URL -f drizzle/seed.sql` e conferir perfil demo
- [ ] Rodar `bun run coverage` com DATABASE_URL real (PGlite continua default dos testes)

## Fora de escopo
- Código novo (isso é T-044+), backup PITR (plano pago, futuro)

## Critérios de aceite (Done)
- [ ] Dado `select tablename from pg_tables`, quando consulto, então vejo as 7 tabelas do dome
- [ ] Dado perfil demo, quando consulto, então existe 1 linha em perfis + 1 em personalidades
- [ ] Dado `git status`, quando olho, então .env não aparece (gitignored)

## Plano (preenchido pela IA antes de codar)
1. Receber DATABASE_URL do humano
2. migrate + seed + conferência
3. Fechar com log do que foi aplicado

## Handoff para próxima IA
Bloqueada em humano (DATABASE_URL). Não invente URL nem reuse a do marmita.

## Log
- 2026-09-09 (ia-opencode): criada como follow-up da T-043 (ressalva do feito).
