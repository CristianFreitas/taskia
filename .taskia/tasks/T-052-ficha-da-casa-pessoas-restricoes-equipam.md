---
id: T-052
titulo: Ficha da casa (pessoas, restrições, equipamentos, despensa)
status: revisao
tipo: feature
prioridade: P0
projeto: marmita
branch: "t-052-ficha"
responsavel: null
criado_em: 2026-09-09T13:25:48.232Z
atualizado_em: 2026-09-09T14:26:00.350Z
versao: 6
estimativa: M
dependencias: []
tags: [casa, perfil, restricoes]
arquivos_relevantes: [painel-casas, ficha]
clarity_score: 85
quality:
  status: pendente
  relatorio: ""
---

## Objetivo
Chegar em cozinha alheia sem improviso: 1 ficha por casa com tudo que importa.

## Contexto
Cada casa é um universo: nº de pessoas, restrições/alergias, equipamentos (forno? micro? freezer cabe quanto?), despensa (o que já tem lá). Hoje isso mora na cabeça dela. Ficha vira a "cola" antes de montar cardápio e lista — e alimenta a T-053 (visita) e a lista (desconta o que já tem).

## Escopo
- [ ] CRUD de casas (apelido ex: "Família Souza", endereço, pessoas, observações)
- [ ] Restrições por casa (tags: vegetariano, sem glúten, sem lactose, criança + texto livre) com alerta no cardápio
- [ ] Equipamentos (checklist: forno, micro-ondas, freezer, batedeira, panela pressão...) + despensa (texto/lista simples)
- [ ] Vincular casa ↔ cliente(s) existentes; testes 100% das regras

## Fora de escopo
- Desconto automático da despensa na lista (futuro), fotos da cozinha (futuro), sync (futuro)

## Critérios de aceite (Done)
- [ ] Dada casa com "sem glúten", quando monto cardápio p/ ela, então vejo o alerta antes de publicar
- [ ] Dada casa cadastrada, quando abro a ficha, então vejo pessoas + restrições + equipamentos + despensa numa tela
- [ ] Dado cliente sem casa, quando vinculo, então passa a ter ficha (nunca órfão escondido)
- [ ] Dado `bun run check` + coverage, quando rodam, então verdes

## Plano
1. Modelo + CRUD + vínculo
2. Alertas no cardápio + testes

## Handoff para próxima IA
Repo /home/zatty/marmita, branch t-052-ficha. Local-first (mesmo padrão clientes/pratos) salvo decisão contrária documentada. Base da T-053.

## Log
- 2026-09-09 (ia-opencode): criada refinada do campo domicílio (score 85, v2).
- 2026-09-09T13:26:41.883Z : mover → refinando. Motivo: DoR ok
- 2026-09-09T13:26:53.538Z : mover → pronto. Motivo: DoR ok
- 2026-09-09T14:24:35.139Z : mover → fazendo. Motivo: inicio ficha da casa
- 2026-09-09T14:26:00.350Z : mover → revisao. Motivo: ficha CRUD + alerta + vinculo, gates verdes, merge main
