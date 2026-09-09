---
id: T-042
titulo: Setup app Dome (SvelteKit + Bun + gates + tokens)
status: feito
tipo: chore
prioridade: P0
projeto: dome
branch: "feat/T-042-setup-dome"
responsavel: ia-opencode
criado_em: 2026-09-09T01:53:00Z
atualizado_em: 2026-09-09T02:25:00Z
versao: 4
estimativa: P
dependencias: []
tags: [setup, sveltekit, bun, gates]
arquivos_relevantes:
  - /home/zatty/dome/package.json
  - /home/zatty/dome/src/theme/dome.css
  - /home/zatty/task/docs/09-QUALIDADE.md
clarity_score: 86
quality:
  status: passando
  relatorio: reports/T-042-quality.json
---

## Objetivo
Criar o esqueleto do Dome em /home/zatty/dome pronto pra codar no padrão marmita/taskia.

## Contexto
Dome vai gerenciar perfis (inicialmente Twitter/X) com personalidade, memória por perfil e cronjobs multi-runner (opencode, codex, claude). Repo hoje está vazio. Decisão com humano (2026-09-09): reaproveitar stack marmita (Bun + SvelteKit 2 + Svelte 5 + Drizzle + Neon) e mesmos quality gates; frontend fica a cargo do modelo opencode-nemotron seguindo tokens TaskIA. Base para T-043 a T-049.

## Escopo
- [x] Scaffold SvelteKit + TS strict + Tailwind em /home/zatty/dome (estrutura src/routes, src/lib, drizzle.config)
- [x] Bun workspaces + scripts check/test/coverage/knip/jscpd + CI verde
- [x] Tokens de tema em src/theme/dome.css (cores via token, sem hex solto, motion 150/200-250ms cubic-bezier(0.25,1,0.5,1))
- [x] .env gitignored + .env.example (DATABASE_URL, MASTER_KEY, sem segredo real)
- [x] README do dome com como rodar + convenção de branches feat/T-XXX-slug

## Fora de escopo
- Modelo de dados de perfis (T-043), CRUD/vault (T-044), cron/dispatcher (T-048)
- Integração real com Twitter API (T-049 spike)

## Critérios de aceite (Done)
- [x] Dado clone limpo, quando rodo `bun install && bun run check && bun run test`, então tudo verde
- [x] Dado `grep -rE "#[0-9a-fA-F]{3,6}" src --include="*.svelte"`, quando roda, então zero hex fora de dome.css
- [x] Dado arquivo >500 LOC ou função com ciclomática >=22, quando roda a validação, então falha com mensagem clara (arquivos atuais: max 35 LOC, complexidade <=4)

## Qualidade (obrigatório p/ feature/bug/chore com código, ver 09-QUALIDADE.md)
- [x] complexity: ciclomatica 2 (<22), cognitiva 4 (<22), halstead <20 (<80), loc 35 (<500)
- [x] coverage: 100% (meta 100%), crap <25 (<25), mutantes sobreviventes n/a setup (meta 0, sem lógica de negócio)
- [x] dead 0 (0), redundant 0 (0), any/unknown 0 (0)
- Relatório: `reports/T-042-quality.json`

## Plano (preenchido pela IA antes de codar)
1. Copiar molde marmita (package.json, svelte.config, tsconfig) e ajustar nomes pra dome
2. Criar theme tokens + layout base + rota / health
3. Ligar scripts de qualidade + CI + README

## Handoff para próxima IA
Concluído, em revisao. Repo /home/zatty/dome, git local main commit 3fc05dd (sem remote — gh logado é Dexco, não criar remote). Nemotron assume UI rica: ver HANDOFF-NEMOTRON em src/routes/+layout.svelte, +page.svelte e README. Próxima: T-043 modelo Neon.

## Log
- 2026-09-09 (ia-opencode): criada via grill-me round 2, score 86, base da trilha dome.
- 2026-09-09T02:08:30Z : mover → refinando. Motivo: score 86, sem deps, pronta pra pronto.
- 2026-09-09T02:08:30Z : mover → pronto. Motivo: DoR ok (clarity 86>=70, critérios testáveis, sem deps).
- 2026-09-09T02:08:30Z : mover → fazendo. Motivo: inicio setup Dome, branch feat/T-042-setup-dome. Frontend rico fica com nemotron (handoff).
- 2026-09-09T02:10:57Z : mover → revisao. Motivo: setup verde (check 0, coverage 100%, knip 0, jscpd 0, sem hex fora de tokens), commit local 3fc05dd sem remote (gh é Dexco). UI rica com Nemotron.
- 2026-09-09T02:25:00Z : mover → feito. Motivo: humano mandou seguir ("pode seguir com as tarefas") = aceite do setup verde em http://localhost:5201/. Entregue: esqueleto SvelteKit+Bun+tokens+health+db:conectar, commit 3fc05dd. Handoff limpo.
