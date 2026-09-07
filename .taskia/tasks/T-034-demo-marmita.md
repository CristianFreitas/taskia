---
id: T-034
titulo: Demo p/ apresentar às cozinheiras (pitch + vídeo Higgsfield)
status: pronto
tipo: feature
prioridade: P2
projeto: marmita
branch: ""
responsavel: null
criado_em: 2026-09-06T00:00:00Z
atualizado_em: 2026-09-06T00:00:00Z
versao: 2
estimativa: M
dependencias: []
tags: [demo, pitch, video, vendas]
arquivos_relevantes: []
clarity_score: 82
quality:
  status: pendente
  relatorio: ""
---

## Objetivo
Material de apresentação que vende a assinatura em 5 minutos, antes do app estar pronto.

## Contexto
Última tarefa do projeto de propósito: demo primeiro valida, código depois confirma. Público: cozinheiras do levantamento (T-032, `notes/marmita-leads-2026-09-06.md`) — não-técnicas, decidem pelo que VEEM. Dois formatos: pitch ao vivo com protótipo clicável + vídeo curto gerado no Higgsfield p/ mandar no WhatsApp. Roteiro vende a DOR (ingrediente esquecido), não features.

## Escopo
- [ ] Roteiro 5 min: dor (lista manual → esqueceu item) → cardápio publicado → cliente escolhe → lista sozinha → TRAVA impedindo envio incompleto → "e se fosse com você?"
- [ ] Protótipo clicável do fluxo feliz (T-025→T-026→T-027) com dados da cozinheira parceira
- [ ] Vídeo curto (≤90s) no Higgsfield: antes/depois + trava em ação + CTA "15 min comigo"
- [ ] Versão WhatsApp: vídeo + 3 frases + link da demo (assiste sozinha, sem call)

## Fora de escopo
- App funcional (demo pode ser protótipo), edição profissional, tráfego pago

## Critérios de aceite (Done)
- [ ] Dada cozinheira leiga, quando assiste, então repete de volta a proposta de valor (lista sozinha + zero esquecimento) sem ajuda
- [ ] Dado envio no WhatsApp, quando mando p/ 3 leads, então ≥1 responde querendo conversar
- [ ] Dado feedback, quando coleto, então objeções viram tarefas linkadas ou ajuste no roteiro

## Plano
1. Roteiro + protótipo com dados reais da parceira
2. Vídeo Higgsfield + kit WhatsApp
3. Disparar p/ 3 leads + colher reação

## Handoff para próxima IA
Só execute após T-025..T-030 (precisa do fluxo feliz visível) e T-032 (leads + linguagem real das conversas). Higgsfield: IA de vídeo — gere cenas curtas do "antes" (cozinha, papel amassado) e "depois" (lista pronta no celular); narração em PT-BR simples, sem jargão.

## Log
- 2026-09-06 (ia-opencode): criada refinada (score 82).
- 2026-09-06 (ia-opencode): movida refinando → pronto (score 82 ≥ 70, aceite testável, sem deps; executar por último).
