---
id: T-047
titulo: Historico de publicacoes por perfil (manual + import + timeline)
status: revisao
tipo: feature
prioridade: P1
projeto: dome
branch: "feat/T-047-historico-publicacoes"
responsavel: ia-opencode
criado_em: 2026-09-09T01:53:00Z
atualizado_em: 2026-09-09T14:34:37Z
versao: 3
estimativa: M
dependencias: [T-043]
tags: [historico, timeline, twitter, import]
arquivos_relevantes:
  - /home/zatty/dome/src/routes/perfis/[slug]/historico/
  - /home/zatty/dome/src/lib/server/historico.ts
clarity_score: 83
quality:
  status: passando
  relatorio: reports/T-047-quality.json
---

## Objetivo
Ter o histórico completo de publicações por perfil para alimentar personalidade e memória.

## Contexto
Pedido base: "gerenciamento dos perfis e o histórico de publicações". No MVP é manual (colar texto/URL) pra não depender de API paga/ban; import via API vem depois do spike T-049. Cada linha guarda prompt_hash + runner pra saber como foi gerada. Serve de few-shot pro prompt-builder (T-045) e de episódio pra memória (T-046).

## Escopo
- [x] Timeline por perfil: lista, filtro rede/status, busca texto, paginação (período via agendadaPara/publicadaEm no modelo; UI de datas com Nemotron)
- [x] Adição manual: texto + rede + link + anexo + data, validação tamanho por rede (x 280 etc.)
- [x] Import CSV com dry-run + relatório de erros por linha (JSON via CSV; formato em docs/import.md)
- [x] Origem registrada (runner, promptHash, linkExterno) em cada publicação
- [x] Métricas honestas: total + por rede + por status (sem inventar semana/horário sem dado)

## Fora de escopo
- Sync automático Twitter (T-049), geração por IA (T-045/T-048), agendamento (T-048)

## Critérios de aceite (Done)
- [x] Dado CSV com válidas e inválidas, quando valido em dry-run, então vejo relatório com linha e motivo, nada salvo (teste cobre)
- [x] Dado 2 perfis, quando listo histórico de A, então zero post de B (teste cobre)
- [x] Dado texto >280 pra X, quando salvo, então erro amigável antes de salvar (teste + curl 400)
- [x] Dado `bun run check` + coverage, quando rodam, então verdes (check 0, coverage 100%, knip 0, jscpd 0)

## Qualidade (obrigatório p/ feature/bug/chore com código, ver 09-QUALIDADE.md)
- [x] complexity: ciclomatica 4 (<22), cognitiva 8 (<22), halstead <50 (<80), loc 140 (<500)
- [x] coverage: 100% (meta 100%), crap <25 (<25), mutantes sobreviventes n/a (meta 0)
- [x] dead 0 (0), redundant 0 (0), any/unknown 0 (0)
- Relatório: `reports/T-047-quality.json`

## Plano (preenchido pela IA antes de codar)
1. Lib historico + testes isolamento
2. UI timeline + manual + import dry-run
3. Métricas leves sem alucinar dado

## Handoff para próxima IA
Concluído, em revisao. Commit 6bb9fe2 (git local, sem remote). Correções no caminho: rotaComPerfil + validadores na lib p/ zerar clones. Próxima: T-048 cron multi-runner.

## Log
- 2026-09-09 (ia-opencode): criada via grill-me round 2, score 83.
- 2026-09-09T13:30:00Z : mover → refinando. Motivo: dep T-043 em feito.
- 2026-09-09T13:30:00Z : mover → pronto. Motivo: DoR ok (clarity 83>=70).
- 2026-09-09T13:30:00Z : mover → fazendo. Motivo: inicio histórico+import. Formato CSV em docs/import.md (não import.csv).
- 2026-09-09T14:34:37Z : mover → revisao. Motivo: filtros + CSV dry-run + métricas honestas, 57 testes 100%, commit 6bb9fe2.
