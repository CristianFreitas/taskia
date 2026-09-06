# 03 — Formato da Tarefa (contrato sagrado)

> Se a IA só ler um doc, que seja este. Toda tarefa válida OBEDECE este schema.

## Arquivo: `.taskia/tasks/T-XXX-slug.md`

```markdown
---
id: T-001
titulo: Implementar login com magic link
status: fazendo            # inbox | refinando | pronto | fazendo | revisao | feito | arquivado
tipo: feature              # bug | feature | chore | spike | decisao
prioridade: P1             # P0-critico | P1-alta | P2-media | P3-baixa
responsavel: ia-opencode   # humano | ia-chatgpt | ia-claude | ia-opencode | ia-cursor | null
criado_em: 2026-09-05T10:00:00Z
atualizado_em: 2026-09-05T12:00:00Z
versao: 3
estimativa: M              # PP(<2h) | P(<1d) | M(1-3d) | G(>3d) | ?
dependencias: [T-002]      # bloqueia mover p/ pronto/fazendo se dep não está em feito
tags: [auth, backend]
arquivos_relevantes:
  - src/auth/login.ts
  - docs/02-ARQUITETURA.md
clarity_score: 85          # 0-100, preenchido pela IA que refina. <70 não pode ir p/ pronto
quality:
  status: pendente         # pendente | passando | falhando | isento (spike/decisao sem código)
  relatorio: reports/T-001-quality.json
---

## Objetivo
Uma frase. Verbo de ação. Ex: Permitir login sem senha via link por e-mail.

## Contexto
Por que existe? Qual dor? Links, prints, decisões anteriores. É o que evita a IA adivinhar.

## Escopo
- [ ] O que ENTRA (lista checkável)
- [ ] ...

## Fora de escopo
- O que NÃO entra (essencial p/ conter alucinação de escopo)

## Critérios de aceite (Done)
- [ ] Testável. Ex: `dado X, quando Y, então Z`.
- [ ] Sem isso a tarefa não vai pra `revisao`.

## Qualidade (obrigatório p/ feature/bug/chore com código, ver 09-QUALIDADE.md)
- [ ] complexity: ciclomatica __ (<22), cognitiva __ (<22), halstead __ (<80), loc __ (<500)
- [ ] coverage: __% (meta 100%), crap __ (<25), mutantes sobreviventes __ (meta 0)
- [ ] dead __ (0), redundant __ (0), any/unknown __ (0)
- Relatório: `reports/T-XXX-quality.json`

## Plano (preenchido pela IA antes de codar)
1. passo 1...
2. passo 2...

## Handoff para próxima IA
> Se outra IA pegar no meio, o que ela precisa saber em 30s? Último estado, o que tentou, o que falta.

## Log
- 2026-09-05 12:00 (ia-opencode): iniciei implementação, criando branch feat/T-001.
- 2026-09-05 13:00 (humano): validado fluxo, mover p/ revisao.
```

## Regras de validação (o MCP vai impor)

1. `id` = nome do arquivo. Divergiu → erro.
2. `status`, `tipo`, `prioridade` só aceitam valores do enum acima.
3. `pronto` exige: `clarity_score >= 70` + `criterios_de_aceite` não-vazio + `dependencias` todas em `feito`.
4. `fazendo` exige: `responsavel != null` + máximo 1 `fazendo` por `responsavel` (WIP=1 p/ IA).
5. `revisao` exige: `plano` preenchido + todos os checks de `escopo` marcados ou justificados no Log + `## Qualidade` preenchido + `quality.status: passando` (ou `isento` com motivo).
6. `feito` exige: link/commit ou descrição do que foi entregue no Log + `handoff` limpo ("concluído") + relatório de qualidade verde confirmado por `verificar_qualidade`.
7. Todo write incrementa `versao` e atualiza `atualizado_em`. Nunca edite `criado_em`.
8. Limites de código (ver `09-QUALIDADE.md`): ciclomática <22, cognitiva <22, halstead <80, LOC/arquivo <500, coverage 100%, CRAP <25, mutantes 0, dead 0, redundant 0, any/unknown 0.

## Clarity Score (a surpresa)

A IA que refina dá nota 0-100:

- +30 tem Objetivo em 1 frase?
- +25 tem Critérios testáveis?
- +20 tem Escopo + Fora de escopo?
- +15 tem Arquivos/Contexto?
- +10 tem Estimativa + dependências mapeadas?

<70 → fica em `refinando`, a IA deve fazer perguntas, não codar.

## Exemplo mínimo válido vs inválido

❌ Inválido (vago, IA vai alucinar): "titulo: melhorar auth, status: fazendo"
✅ Válido: ver `.taskia/tasks/T-001-exemplo-boa-tarefa.md`
