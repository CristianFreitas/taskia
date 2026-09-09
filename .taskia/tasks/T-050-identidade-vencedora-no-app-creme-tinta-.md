---
id: T-050
titulo: Identidade vencedora no app (creme+tinta+terracota, backend intacto)
status: revisao
tipo: feature
prioridade: P0
projeto: marmita
branch: "t-050-identidade"
responsavel: null
criado_em: 2026-09-09T02:35:17.720Z
atualizado_em: 2026-09-09T02:41:53.066Z
versao: 6
estimativa: M
dependencias: []
tags: [frontend, identidade, tema]
arquivos_relevantes: [listacerta-theme, home-nova, componentes]
clarity_score: 87
quality:
  status: pendente
  relatorio: ""
---

## Objetivo
App inteiro com a cara vencedora (Fraunces + creme/tinta/terracota), mesmo backend Neon, tag `v0.3.0`.

## Contexto
Concurso entre os 6 modelos free: venceu o muse-spark-1.2 (creme `#FFFBF3`, tinta `#1A1A17`, terracota `#E84C18`, verde `#1B3A2E`, marker amarelo, pills, header blur) com acento do mimo. Mock em `static/preview/`. "Migração do backend" = o backend NÃO muda (mesmas APIs, auth, Neon) — o frontend novo consome tudo igual. Decisão editorial: prova social falsa do mock ("847 cozinheiras") NÃO embarca; trust row honesta (Grátis/Sem cartão/3 min).

## Escopo
- [ ] Tokens no `@theme` (creme, tinta, linha, terracota, verde) + Fraunces/Inter no `app.html` (fallback serif/sans) + utilitários (display, marker, eyebrow)
- [ ] Componentes no padrão: Botao pill c/ sombra, Cartao branco r22, PratoCheck estilo dish (check redondo), Progresso fino, Passos, `.campo`, header sticky blur
- [ ] Home portada: hero + mock visual (pratos reais do seed) + passos + seção trava + CTA final terracota + footer
- [ ] Tema aplicado nas rotas (painel, cardápio, lista, entrar, `/c/*`); dark mínimo tasteful; theme-color terracota
- [ ] Gates verdes + tag `v0.3.0`

## Fora de escopo
- Mudar APIs, schema, auth, copy aprovada, novas rotas/features

## Critérios de aceite (Done)
- [ ] Dada qualquer rota, quando abro, então vejo a identidade (nunca laranja antigo nem card quadrado)
- [ ] Dada home lado a lado com o mock, quando comparo, então mesma hierarquia e ritmo
- [ ] Dado `bun run check` + coverage 100 + knip 0 + jscpd 0, quando rodam, então verdes
- [ ] Dada tag `v0.3.0`, quando listo, então existe com notas

## Plano
1. Tokens + fontes + componentes
2. Home + rotas + dark mínimo
3. Gates + tag v0.3.0

## Handoff para próxima IA
Repo /home/zatty/marmita, branch t-050-identidade. Mock: `static/preview/listacerta-home-muse-spark-1-2-contributor.html`. Zero mudança em `lib/dominio`, `lib/server`, `routes/api`.

## Log
- 2026-09-09 (ia-opencode): criada refinada (score 87, v2).
- 2026-09-09T02:35:33.250Z : mover → refinando. Motivo: escopo identidade definido
- 2026-09-09T02:35:35.795Z : mover → pronto. Motivo: DoR ok
- 2026-09-09T02:35:38.044Z : mover → fazendo. Motivo: inicio identidade vencedora
- 2026-09-09T02:41:53.066Z : mover → revisao. Motivo: identidade em todo o app, gates verdes, tag v0.3.0
