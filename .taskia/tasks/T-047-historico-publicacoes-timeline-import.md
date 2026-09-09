---
id: T-047
titulo: Historico de publicacoes por perfil (manual + import + timeline)
status: fazendo
tipo: feature
prioridade: P1
projeto: dome
branch: "feat/T-047-historico-publicacoes"
responsavel: ia-opencode
criado_em: 2026-09-09T01:53:00Z
atualizado_em: 2026-09-09T13:30:00Z
versao: 2
estimativa: M
dependencias: [T-043]
tags: [historico, timeline, twitter, import]
arquivos_relevantes:
  - /home/zatty/dome/src/routes/perfis/[slug]/historico/
  - /home/zatty/dome/src/lib/server/historico.ts
clarity_score: 83
quality:
  status: pendente
  relatorio: ""
---

## Objetivo
Ter o histórico completo de publicações por perfil para alimentar personalidade e memória.

## Contexto
Pedido base: "gerenciamento dos perfis e o histórico de publicações". No MVP é manual (colar texto/URL) pra não depender de API paga/ban; import via API vem depois do spike T-049. Cada linha guarda prompt_hash + runner pra saber como foi gerada. Serve de few-shot pro prompt-builder (T-045) e de episódio pra memória (T-046).

## Escopo
- [ ] Timeline por perfil: lista, filtro por rede/status/período, busca texto, paginação
- [ ] Adição manual: texto + rede + data + link externo + anexo ref, com validação tamanho por rede (ex 280 X)
- [ ] Import CSV/JSON (texto, data, link) com dry-run + relatório de erros por linha
- [ ] Detalhe com origem (manual/import/gerada, runner, prompt_hash linkado)
- [ ] Métricas leves: qtd/semana, melhor horário (só conta o que tem dado, sem inventar)

## Fora de escopo
- Sync automático Twitter (T-049), geração por IA (T-045/T-048), agendamento (T-048)

## Critérios de aceite (Done)
- [ ] Dado CSV com 100 linhas sendo 3 inválidas, quando importo em dry-run, então vejo 97 ok + 3 erros com linha e motivo, nada salvo
- [ ] Dado perfil A com 50 posts, quando filtro perfil B, então zero post de A aparece
- [ ] Dado texto >280 pra X, quando salvo, então erro amigável antes de salvar
- [ ] Dado `bun run check` + coverage, quando rodam, então verdes

## Qualidade (obrigatório p/ feature/bug/chore com código, ver 09-QUALIDADE.md)
- [ ] complexity: ciclomatica __ (<22), cognitiva __ (<22), halstead __ (<80), loc __ (<500)
- [ ] coverage: __% (meta 100%), crap __ (<25), mutantes sobreviventes __ (meta 0)
- [ ] dead __ (0), redundant __ (0), any/unknown __ (0)
- Relatório: `reports/T-047-quality.json`

## Plano (preenchido pela IA antes de codar)
1. Lib historico + testes isolamento
2. UI timeline + manual + import dry-run
3. Métricas leves sem alucinar dado

## Handoff para próxima IA
Branch sugerida feat/T-047-historico-publicacoes. Depende de T-043. Formato CSV documentado em docs/import.csv.

## Log
- 2026-09-09 (ia-opencode): criada via grill-me round 2, score 83.
- 2026-09-09T13:30:00Z : mover → refinando. Motivo: dep T-043 em feito.
- 2026-09-09T13:30:00Z : mover → pronto. Motivo: DoR ok (clarity 83>=70).
- 2026-09-09T13:30:00Z : mover → fazendo. Motivo: inicio histórico+import. Formato CSV em docs/import.md (não import.csv).
