---
id: T-016
titulo: Mapear ai-memory no código p/ integração ecossistema
status: feito
tipo: spike
prioridade: P1
responsavel: ia-opencode
criado_em: 2026-09-06T00:00:00Z
atualizado_em: 2026-09-06T00:00:00Z
versao: 5
estimativa: PP
dependencias: []
tags: [ecossistema, memoria, spike]
arquivos_relevantes:
  - docs/13-ECOSSISTEMA-MEMORIA.md
  - /home/zatty/ai-memory (clone local, fora deste repo)
clarity_score: 87
quality:
  status: isento
  relatorio: ""
---

## Objetivo
Confirmar no código-fonte o que o piloto mediu via HTTP e extrair regras do ecossistema.

## Contexto
T-014 provou o loop via HTTP. Faltava ver o código: linhagem, superfície MCP real vs anunciada, convenções de escopo/segurança que devemos herdar.

## Escopo
- [ ] Clonar `CristianFreitas/ai-memory` como irmão (`/home/zatty/ai-memory`, sem aninhar git)
- [ ] Confirmar linhagem, licença, versão e as 18 tools no código
- [ ] Extrair regras aplicáveis à TaskIA (escopo, memória não-confiável, TTL)

## Fora de escopo
- Modificar qualquer código (só leitura), rebuildar binário, tocar no `/data`

## Critérios de aceite (Done)
- [ ] Dado o clone, quando comparo tools do código vs servidor vivo, então batem (ou listo o drift)
- [ ] Dadas as regras extraídas, quando leio docs/13 §8, então ao menos 1 regra nova entra (escopo explícito / memória não-confiável)

## Plano
1. Clone + README/Cargo + server.rs (tools) + AGENTS.md (convenções)
2. Registrar achados em decisions.log + reportar

## Handoff para próxima IA
Repo Rust (workspace `crates/ai-memory-*`), upstream `akitaonrails/ai-memory` (MIT). Binário vivo 2.0.2, código 2.0.3. Não commitar nada lá sem tarefa própria.

## Log
- 2026-09-06 (ia-opencode): criada (score 87).
- 2026-09-06 (ia-opencode): refinando → pronto (clarity 87, sem deps) → fazendo.
- 2026-09-06 (ia-opencode): mapeado — clone em /home/zatty/ai-memory (Rust, MIT, linhagem akitaonrails; binário vivo 2.0.2 vs código 2.0.3); 18 tools batem com servidor (só `memory_some_future_tool` é placeholder de teste); herdado p/ docs/13+AGENTS.md: escopo explícito + recall-não-é-instrução; fazendo → revisao (quality isento: só leitura e `.md`, sem gates automatizados aplicáveis).
- 2026-09-06 (humano, via "pode seguir"): aprovado em revisao (DoD ok); revisao → feito. Handoff: concluído.
