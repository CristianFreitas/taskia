---
id: T-045
titulo: Personalidade + prompt-builder sempre injetado + guia anti-IA
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
dependencias: [T-043]
tags: [personalidade, prompt, anti-ia, camuflagem]
arquivos_relevantes:
  - /home/zatty/dome/src/lib/server/prompt-builder.ts
  - /home/zatty/dome/src/lib/server/human-likeness.ts
  - /home/zatty/dome/docs/anti-ia.md
clarity_score: 88
quality:
  status: pendente
  relatorio: ""
---

## Objetivo
Garantir que toda mensagem gerada use a personalidade do perfil e pareça humana, nunca template de IA.

## Contexto
Coração do pedido: "tudo necessário no perfil pra configurar personalidade, onde sempre será usado pra gerar a mensagem" + "esconder o máximo que é perfil de IA". Solução: prompt-builder versionado com ordem fixa (persona > memória > histórico > instrução do cron > formato) + prompt_hash (sha256) gravado em cada publicação/execução pra auditoria. Guia anti-IA vivo em docs/anti-ia.md. Human-in-the-loop default ON: nada posta sem review humano no MVP.

## Escopo
- [ ] Editor de personalidade: tom_voz, bio_longa, temas_foco/proibidos, exemplos_posts (3-10), prompt_sistema, versionamento (versao++)
- [ ] prompt-builder.ts: monta prompt final SEMPRE a partir do perfil + snapshot da personalidade (teste: sem perfil não gera)
- [ ] human-likeness.ts: scorer simples (variação tamanho, emoji/hashtag, palavras banidas de LLM — ver docs/anti-ia.md, rajada/horário) + teste <!-- slop-allow: texto_slop — cita lista banida como exemplo negativo, não usa -->
- [ ] docs/anti-ia.md: estilo (varia abertura, 1 ideia/post, imperfeição leve), comportamento (janela horário, intervalo mínimo, sem rajada), operacional (review humano, kill-switch por perfil, dry-run)
- [ ] Teste anti-vazamento: prompt do perfil A nunca contém dado do perfil B

## Fora de escopo
- Memória vetorial/RAG completa (T-046), dispatcher cron (T-048), postagem automática (sempre com review no MVP)

## Critérios de aceite (Done)
- [ ] Dado perfil sem personalidade, quando tento gerar, então erro explícito pedindo completar ficha
- [ ] Dado geração, quando salva publicação/execução, então prompt_hash confere com snapshot da personalidade usada
- [ ] Dado texto com padrão típico de LLM (ex: auto-declaração como IA), quando passa no scorer, então score baixo + flag pra review <!-- slop-allow: texto_slop — descreve padrão banido sem citar termos -->
- [ ] Dado perfil A e B, quando gero pros dois, então teste prova que não há contaminação cruzada

## Qualidade (obrigatório p/ feature/bug/chore com código, ver 09-QUALIDADE.md)
- [ ] complexity: ciclomatica __ (<22), cognitiva __ (<22), halstead __ (<80), loc __ (<500)
- [ ] coverage: __% (meta 100%), crap __ (<25), mutantes sobreviventes __ (meta 0)
- [ ] dead __ (0), redundant __ (0), any/unknown __ (0)
- Relatório: `reports/T-045-quality.json`

## Plano (preenchido pela IA antes de codar)
1. Schema personalidade + editor UI + versionamento
2. prompt-builder + hash + testes isolamento
3. scorer + docs anti-IA + fila review (rascunho, nunca auto-post no MVP)

## Handoff para próxima IA
Branch sugerida feat/T-045-personalidade-anti-ia. Depende de T-043. Leia docs/12-ANTI-SLOP.md do taskia antes (proíbe texto de LLM).

## Log
- 2026-09-09 (ia-opencode): criada via grill-me round 2, score 88, coração do dome.
