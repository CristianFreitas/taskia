---
id: T-029
titulo: Painel cozinheira — montar e publicar cardápio do ciclo
status: revisao
tipo: feature
prioridade: P1
projeto: marmita
branch: "t-029-montar"
responsavel: null
criado_em: 2026-09-06T00:00:00Z
atualizado_em: 2026-09-07T03:19:25.638Z
versao: 4
estimativa: M
dependencias: []
tags: [painel, cardapio, pratos]
arquivos_relevantes: []
clarity_score: 83
quality:
  status: pendente
  relatorio: ""
---

## Objetivo
Cozinheira cadastra pratos (com ingredientes!) e publica o cardápio que os clientes vão ver.

## Contexto
Cardápio do ciclo = subconjunto dos pratos (ex: 12 opções p/ escolher 10). Publicar congela o que o cliente vê (T-025). Cadastrar ingrediente junto do prato é obrigatório conceitualmente — a trava formal é T-030, aqui o UX já empurra: prato sem ingredientes aparece marcado como incompleto antes de publicar.

## Escopo
- [ ] CRUD de pratos (nome, descrição, foto opcional, ingredientes com qtd+unidade)
- [ ] Montar cardápio do ciclo (escolher pratos, ordenar) + publicar/despublicar
- [ ] Alerta "prato sem ingredientes" na montagem (bloqueio real na T-030)
- [ ] Editar cardápio publicado gera nova versão (escolhas já feitas não quebram)

## Fora de escopo
- Escolha do cliente (T-025), trava de lista (T-030), precificação por prato

## Critérios de aceite (Done)
- [ ] Dado prato sem ingredientes, quando monto cardápio, então vejo selo "incompleto" antes de publicar
- [ ] Dado cardápio publicado com escolhas feitas, quando edito, então escolhas antigas apontam p/ versão antiga intacta
- [ ] Dada publicação, quando cliente abre (T-025), então vê exatamente o publicado

## Plano
1. CRUD pratos + ingredientes
2. Montagem + publicação versionada

## Handoff para próxima IA
Requer T-024. Foto: upload local primeiro (câmera do celular); hospedagem externa é T-futura.

## Log
- 2026-09-06 (ia-opencode): criada refinada (score 83).
- 2026-09-06 (ia-opencode): movida refinando → pronto (score 83 ≥ 70, aceite testável, sem deps).
- 2026-09-07T03:19:05.297Z : mover → fazendo. Motivo: inicio montar/publicar cardapio
- 2026-09-07T03:19:25.638Z : mover → revisao. Motivo: CRUD pratos + publicar versionado + selo incompleto, gates ok
