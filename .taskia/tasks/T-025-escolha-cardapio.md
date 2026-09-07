---
id: T-025
titulo: Cardápio do ciclo + cliente escolhe 10 pratos (contador, acessível)
status: pronto
tipo: feature
prioridade: P1
projeto: marmita
branch: ""
responsavel: null
criado_em: 2026-09-06T00:00:00Z
atualizado_em: 2026-09-06T00:00:00Z
versao: 2
estimativa: M
dependencias: []
tags: [cliente, cardapio, a11y]
arquivos_relevantes: []
clarity_score: 84
quality:
  status: pendente
  relatorio: ""
---

## Objetivo
Cliente abre o cardápio do ciclo no celular e marca seus 10 pratos sem erro e sem ajuda.

## Contexto
Usuária não-técnica, tela pequena, 12+ pratos por ciclo. Contador visível "7 de 10" + confirmar só habilita com 10 exatos (regra `podeEscolher` da T-024). Cards grandes, foto/nome/descrição, toque = marca/desmarca. shadcn checkbox/switch com a11y pronta.

## Escopo
- [ ] Lista de pratos do cardápio publicado (nome, descrição curta, estado marcado)
- [ ] Contador "X de 10" fixo + botão confirmar desabilitado até 10 exatos
- [ ] Persistir escolha (rascunho editável até confirmar; re-editar depois)
- [ ] Empty state (cardápio ainda não publicado) e estado "escolha enviada ✓"

## Fora de escopo
- Lista de ingredientes (T-026), envio WhatsApp (T-027), login/conta

## Critérios de aceite (Done)
- [ ] Dado cardápio com 12 pratos, quando marco 10, então confirmar habilita; com 9 ou 11, desabilitado com motivo visível
- [ ] Dado leitor de tela, quando navego, então cada prato anuncia nome + marcado/não-marcado
- [ ] Dado 360px, quando abro, então sem scroll horizontal e alvos ≥44px

## Plano
1. Tela + contador + persistência de rascunho
2. Empty/enviado + a11y pass

## Handoff para próxima IA
Requer tipos/regras da T-024. Teste com TalkBack/VoiceOver real, não só axe.

## Log
- 2026-09-06 (ia-opencode): criada refinada (score 84).
- 2026-09-06 (ia-opencode): movida refinando → pronto (score 84 ≥ 70, aceite testável, sem deps).
