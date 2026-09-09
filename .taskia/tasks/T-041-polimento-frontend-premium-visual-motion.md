---
id: T-041
titulo: Polimento frontend premium (visual + motion + estados)
status: revisao
tipo: feature
prioridade: P1
projeto: marmita
branch: "t-041-front"
responsavel: null
criado_em: 2026-09-09T01:48:19.066Z
atualizado_em: 2026-09-09T02:13:23.816Z
versao: 6
estimativa: M
dependencias: []
tags: [frontend, visual, ux]
arquivos_relevantes: [listacerta-rotas, theme, componentes-ui]
clarity_score: 84
quality:
  status: pendente
  relatorio: ""
---

## Objetivo
Sair do "honesto mas sem sal": app com cara de produto pago, sem quebrar nada funcional.

## Contexto
Repo `/home/zatty/marmita` (SvelteKit 2 + Svelte 5 runes + Tailwind v4, tag `v0.2.0`). Funcional completo e com gates verdes — mas visual básico: sem skeletons, transições mínimas, empty/error states crus, ícones PWA improvisados, dark com inputs forçados em light. Dev: `bun run dev --port 5199` (PATH com `$HOME/.bun/bin`). Rotas: `/` landing, `/cardapio`, `/lista`, `/entrar`, `/painel/*`, `/c/*`. Regras da casa: runes (`$state`/`$derived`, sem store p/ local), props com `interface`, sem `any`, arquivo <500 linhas, função <22, tokens via `src/app.css` (nada de hex solto), motion micro 150ms / transição 200-250ms `cubic-bezier(0.25,1,0.5,1)`, sem bounce.

## Escopo
- [ ] Hero da landing com hierarquia e respiro de produto pago (manter copy aprovada)
- [ ] Skeletons de carregamento (cardápio, lista, painel) + empty/error states desenhados
- [ ] Micro-interações (confirmar escolha, riscar não existe mais — celebrar lista pronta?) dentro do motion system
- [ ] Dark mode auditado tela a tela (inputs hoje forçados light via `color-scheme`)
- [ ] Ícones PWA de verdade (maskable + apple-touch) + theme-color por rota
- [ ] 360px sem scroll horizontal em todas as rotas + teste com TalkBack no fluxo escolher→lista

## Fora de escopo
- Novas features ou rotas, backend, mudar copy/posicionamento, trocar stack

## Critérios de aceite (Done)
- [ ] Dado antes/depois lado a lado, quando comparo, então cada tela está visivelmente premium sem perder identidade
- [ ] Dado throttling 3G, quando navego, então vejo skeletons (nunca branco nem "Carregando…" cru)
- [ ] Dado `bun run check` + coverage 100 + knip 0 + jscpd 0, quando rodam, então verdes
- [ ] Dado 360px + dark + TalkBack, quando percorro escolher→lista→enviar, então concluo sem ajuda visual

## Plano
1. Tokens/hero/skeletons
2. Estados + motion + dark
3. Ícones PWA + auditoria 360/TalkBack + gates

## Handoff para próxima IA
Branch `t-041-front` a partir da `main` (= `v0.2.0`). Commits por tela, merge com `--no-ff`. Neon dorme no idle (primeiro teste pode dar timeout — retry acorda). Não mexa em `src/lib/dominio` nem `src/lib/server` sem motivo.

## Log
- 2026-09-09 (ia-opencode): criada refinada p/ mimoV2.5 (score 84, v2).
- 2026-09-09T01:48:32.389Z : mover → refinando. Motivo: escopo de polimento definido p/ mimo
- 2026-09-09T01:48:34.791Z : mover → pronto. Motivo: DoR ok
- 2026-09-09T02:06:56.316Z : mover → fazendo. Motivo: disparo do worker frontend (mimo)
- 2026-09-09T02:13:23.816Z : mover → revisao. Motivo: mimo entregou 7 commits, gates verificados (100/0/0/0), merge main
