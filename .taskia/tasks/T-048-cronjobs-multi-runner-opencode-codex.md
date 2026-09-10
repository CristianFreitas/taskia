---
id: T-048
titulo: Cronjobs flexiveis multi-runner (opencode, codex, claude)
status: revisao
tipo: feature
prioridade: P1
projeto: dome
branch: "feat/T-048-cron-multi-runner"
responsavel: ia-opencode
criado_em: 2026-09-09T01:53:00Z
atualizado_em: 2026-09-10T04:12:23Z
versao: 3
estimativa: G
dependencias: [T-044, T-045]
tags: [cron, runner, opencode, codex, claude, automacao]
arquivos_relevantes:
  - /home/zatty/dome/src/lib/server/runners.ts
  - /home/zatty/dome/src/lib/server/dispatcher.ts
  - /home/zatty/dome/src/routes/perfis/[slug]/cron/
clarity_score: 85
quality:
  status: passando
  relatorio: reports/T-048-quality.json
---

## Objetivo
Permitir agendar tarefas por perfil que geram rascunhos via qualquer runner (opencode/codex/claude) com review humano.

## Contexto
Pedido chave: "configurar cronjobs que use opencode, codex, claude etc, bem flexível". Desenho: interface Runner única + adapters que chamam o CLI certo com prompt do prompt-builder (T-045) + vault injetando só o necessário. MVP nunca auto-posta: gera rascunho em publicacoes status=rascunho e notifica pra review. Com janela de horário + intervalo mínimo pra camuflagem (nada de rajada 3h da manhã todo dia igual robô).

## Escopo
- [x] CRUD cronjobs por perfil: nome, cron_expr (MVP: "* * * * *" e "M H * * *"), runner (opencode|codex|claude|mock), modelo, rede, prompt_template, janela, ativo
- [x] runners.ts: interface gerar + adapters CLI com timeout via stdin (prompt nunca no argv) + mock
- [x] dispatcher.ts: tick, trava por cronjob (sem overlap), janela + ativo + kill-switch, backoff puro, execuções com erro legível
- [x] Execução salva em execucoes + rascunho em publicacoes com prompt_hash + runner + duração
- [x] API cron (lista/cria/liga-desliga/previa/executar-agora); UI rica com Nemotron

## Fora de escopo
- Postagem automática sem review (futuro, exige decisão explícita + T-049), UI global multi-perfil (só por perfil no MVP)

## Critérios de aceite (Done)
- [x] Dado cron "*" com mock, quando tick roda, então 1 execução com 1 rascunho e trava impede overlap (teste com lock ocupado)
- [x] Dado perfil arquivado, quando executo, então throw kill-switch e tick pula sem executar
- [x] Dado runner desconhecido/falhando, quando roda, então linha em execucoes status=erro legível, sem vazar chave (teste cobre)
- [x] Dado `bun run check` + coverage, quando rodam, então verdes (check 0, coverage 100%, knip 0, jscpd 0)

## Qualidade (obrigatório p/ feature/bug/chore com código, ver 09-QUALIDADE.md)
- [x] complexity: ciclomatica 5 (<22), cognitiva 10 (<22), halstead <60 (<80), loc 185 (<500)
- [x] coverage: 100% (meta 100%), crap <25 (<25), mutantes sobreviventes n/a (meta 0)
- [x] dead 0 (0), redundant 0 (0), any/unknown 0 (0)
- Relatório: `reports/T-048-quality.json`

## Plano (preenchido pela IA antes de codar)
1. Interface Runner + mock + testes
2. Adapters opencode/codex/claude + dispatcher com trava
3. UI cron + dry-run + kill-switch

## Handoff para próxima IA
Concluído, em revisao. Commit f4d201c (git local, sem remote). Chave do runner no ENV, chave da rede no vault — nunca misturados. Tick liga com DOME_CRON=1. Próxima: T-049 spike Twitter.

## Log
- 2026-09-09 (ia-opencode): criada via grill-me round 2, score 85, diferencial flexível.
- 2026-09-09T14:40:00Z : mover → refinando. Motivo: deps T-044/T-045 em feito.
- 2026-09-09T14:40:00Z : mover → pronto. Motivo: DoR ok (clarity 85>=70).
- 2026-09-09T14:40:00Z : mover → fazendo. Motivo: inicio runners+dispatcher. cron_expr MVP: só "* * * * *" e "M H * * *" (parser cheio é futuro).
- 2026-09-10T04:12:23Z : mover → revisao. Motivo: runners mock/cli + dispatcher com trava/janela/kill-switch + tick, 82 testes 100%, commit f4d201c.
