---
id: T-027
titulo: Enviar lista via WhatsApp (wa.me + compartilhar/copiar fallback)
status: revisao
tipo: feature
prioridade: P1
projeto: marmita
branch: "t-027-envio"
responsavel: null
criado_em: 2026-09-06T00:00:00Z
atualizado_em: 2026-09-07T03:18:42.176Z
versao: 4
estimativa: P
dependencias: []
tags: [whatsapp, share]
arquivos_relevantes: []
clarity_score: 85
quality:
  status: pendente
  relatorio: ""
---

## Objetivo
Cliente manda a lista pronta p/ o próprio WhatsApp (ou família/mercado) em 1 toque, sem conta e sem custo.

## Contexto
Pesquisado: `wa.me/<numero>?text=<lista>` abre conversa com mensagem pronta — zero backend, zero API, zero custo, funciona BR. Cloud API só se volume justificar (fora). Número de destino: campo editável (o dela ou de quem vai ao mercado) + `navigator.share` quando disponível + copiar texto como fallback. Recomendado: número comercial dedicado (não o pessoal).

## Escopo
- [ ] Montar texto da lista (cabeçalho ciclo/cliente + itens com qtd + rodapé)
- [ ] Campo número destino com memória + validação BR (DDI+DDD, só dígitos no link)
- [ ] Botão "Enviar no WhatsApp" (`wa.me`), botão compartilhar nativo (se disponível), botão copiar
- [ ] `encodeURIComponent` correto incl. quebras de linha e acentos

## Fora de escopo
- WhatsApp Cloud/Business API, envio automático, confirmação de leitura, pagamento

## Critérios de aceite (Done)
- [ ] Dada lista com acentos ("à parmegiana"), quando gero o link, então texto chega intacto no WhatsApp
- [ ] Dado número "(11) 98765-4321", quando envio, então link usa `5511987654321`
- [ ] Dado navegador sem `navigator.share`, quando abro, então vejo copiar como alternativa (nunca botão morto)

## Plano
1. Formatador de texto + validador de número + testes
2. Botões wa.me/share/copiar + memória do número

## Handoff para próxima IA
Requer lista da T-026. Teste o link em Android e iPhone reais com WhatsApp instalado.

## Log
- 2026-09-06 (ia-opencode): criada refinada (score 85).
- 2026-09-06 (ia-opencode): movida refinando → pronto (score 85 ≥ 70, aceite testável, sem deps).
- 2026-09-07T03:18:29.996Z : mover → fazendo. Motivo: inicio envio WhatsApp
- 2026-09-07T03:18:42.176Z : mover → revisao. Motivo: wa.me validado + share + copiar + previa, gates ok
