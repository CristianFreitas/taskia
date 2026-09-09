---
id: T-048
titulo: Cronjobs flexiveis multi-runner (opencode, codex, claude)
status: inbox
tipo: feature
prioridade: P1
projeto: dome
branch: ""
responsavel: null
criado_em: 2026-09-09T01:53:00Z
atualizado_em: 2026-09-09T01:53:00Z
versao: 1
estimativa: G
dependencias: [T-044, T-045]
tags: [cron, runner, opencode, codex, claude, automacao]
arquivos_relevantes:
  - /home/zatty/dome/src/lib/server/runners.ts
  - /home/zatty/dome/src/lib/server/dispatcher.ts
  - /home/zatty/dome/src/routes/perfis/[slug]/cron/
clarity_score: 85
quality:
  status: pendente
  relatorio: ""
---

## Objetivo
Permitir agendar tarefas por perfil que geram rascunhos via qualquer runner (opencode/codex/claude) com review humano.

## Contexto
Pedido chave: "configurar cronjobs que use opencode, codex, claude etc, bem flexível". Desenho: interface Runner única + adapters que chamam o CLI certo com prompt do prompt-builder (T-045) + vault injetando só o necessário. MVP nunca auto-posta: gera rascunho em publicacoes status=rascunho e notifica pra review. Com janela de horário + intervalo mínimo pra camuflagem (nada de rajada 3h da manhã todo dia igual robô).

## Escopo
- [ ] CRUD cronjobs por perfil: nome, cron_expr, runner (opencode|codex|claude-code|mock), modelo, prompt_template, janela_horario, ativo
- [ ] runners.ts: interface gerar(prompt): Promise<string> + adapters CLI com timeout, sem vazar chave em argv/log
- [ ] dispatcher.ts: tick Bun, trava por cronjob (sem overlap), respeita janela + ativo + kill-switch por perfil, backoff em erro, idempotência
- [ ] Execução salva em execucoes + rascunho em publicacoes com prompt_hash + runner + custo/tempo
- [ ] UI cron por perfil: lista, ligar/desligar, rodar agora (dry-run), ver últimas execuções e erro legível

## Fora de escopo
- Postagem automática sem review (futuro, exige decisão explícita + T-049), UI global multi-perfil (só por perfil no MVP)

## Critérios de aceite (Done)
- [ ] Dado cron a cada 5min com runner=mock, quando espero 15min, então 3 execuções com 3 rascunhos e zero overlap
- [ ] Dado perfil desativado (kill-switch), quando tick roda, então zero execução e loga skipped
- [ ] Dado runner falhando, quando roda 3x, então backoff + erro legível na UI, sem vazar chave
- [ ] Dado `bun run check` + coverage, quando rodam, então verdes

## Qualidade (obrigatório p/ feature/bug/chore com código, ver 09-QUALIDADE.md)
- [ ] complexity: ciclomatica __ (<22), cognitiva __ (<22), halstead __ (<80), loc __ (<500)
- [ ] coverage: __% (meta 100%), crap __ (<25), mutantes sobreviventes __ (meta 0)
- [ ] dead __ (0), redundant __ (0), any/unknown __ (0)
- Relatório: `reports/T-048-quality.json`

## Plano (preenchido pela IA antes de codar)
1. Interface Runner + mock + testes
2. Adapters opencode/codex/claude + dispatcher com trava
3. UI cron + dry-run + kill-switch

## Handoff para próxima IA
Branch sugerida feat/T-048-cron-multi-runner. Depende de T-044+T-045. Chave de API do runner fica no ENV do servidor, chave da rede social fica no vault do perfil — nunca misturar.

## Log
- 2026-09-09 (ia-opencode): criada via grill-me round 2, score 85, diferencial flexível.
