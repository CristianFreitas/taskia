---
id: T-032
titulo: Levantar possíveis clientes (validação com quem já paga)
status: pronto
tipo: spike
prioridade: P1
projeto: marmita
branch: ""
responsavel: null
criado_em: 2026-09-06T00:00:00Z
atualizado_em: 2026-09-06T00:00:00Z
versao: 2
estimativa: P
dependencias: []
tags: [validacao, clientes, discovery]
arquivos_relevantes: []
clarity_score: 82
quality:
  status: pendente
  relatorio: ""
---

## Objetivo
Sair do achismo: listar quem compraria/usaria o app primeiro e validar com 5 conversas reais.

## Contexto
Cliente zero mais barato: quem JÁ paga os R$400 dela (confiança pronta, dor conhecida). Segundo anel: indicações dessas clientes (mães ocupadas, quem faz dieta, idosos que recebem marmita, pequenos escritórios). Sem código nesta tarefa — é conversa + planilha.

## Escopo
- [ ] Mapear base atual dela (quantas clientes ativas, perfil, quem reclama de escolha/lista hoje)
- [ ] Roteiro curto de 5 perguntas (dor da escolha, dor da lista, usaria app, pagaria a mais, indica quem)
- [ ] 5 conversas + registro das respostas (planilha simples)
- [ ] Lista final: early adopters (top 3–5 nomes) + 2 perfis de expansão + objeções ouvidas

## Fora de escopo
- Código, preço do app, contrato, marketing

## Critérios de aceite (Done)
- [ ] Dadas 5 conversas, quando consolido, então ≥3 confirmam que escolher pelo celular + receber lista seria melhor que hoje
- [ ] Dada a base, quando termino, então entrego lista de 3–5 early adopters nomeados + 2 perfis de expansão
- [ ] Dadas objeções, quando registro, então cada uma tem resposta ou vira item de produto (nova tarefa linkada)

## Plano
1. Mapear base + roteiro
2. Conversar + consolidar + listar adopters

## Handoff para próxima IA
Se validação falhar (<3 sim), NÃO codar o resto — voltar com os aprendizados e repriorizar. Faça esta tarefa antes da T-025.

## Log
- 2026-09-06 (ia-opencode): criada refinada (score 82).
- 2026-09-06 (ia-opencode): movida refinando → pronto (score 82 ≥ 70, aceite testável, sem deps).
