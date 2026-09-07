---
id: T-023
titulo: Setup app Marmita (SvelteKit PWA + shadcn-svelte + tokens clean)
status: revisao
tipo: chore
prioridade: P0
projeto: marmita
branch: "t-023-setup"
responsavel: null
criado_em: 2026-09-06T00:00:00Z
atualizado_em: 2026-09-07T03:15:32.562Z
versao: 4
estimativa: P
dependencias: []
tags: [setup, pwa, frontend]
arquivos_relevantes: []
clarity_score: 85
quality:
  status: pendente
  relatorio: ""
---

## Objetivo
App instalável no celular com design system clean próprio, pronto p/ telas de cliente e painel.

## Contexto
Decisão pesquisada: mesma stack TaskIA (SvelteKit 2 + Svelte 5 + TS strict) + shadcn-svelte (a11y pronta, dono do código) + PWA (`@vite-pwa/sveltekit`, offline, sem app store). Rejeitados: Skeleton (opinativo demais), DaisyUI (a11y manual), React Native/Flutter (segunda stack p/ time de 1). Cozinheira e clientes são não-técnicos no celular — PWA instalável vence.

## Escopo
- [ ] Scaffold SvelteKit + Tailwind + shadcn-svelte init + PWA (manifest, ícones, offline básico)
- [ ] Tokens clean comida-caseira (fundo quente claro + dark, laranja `#F97316` como acento, Inter)
- [ ] Layout base mobile-first (max-width conteúdo, bottom-nav cliente / sidebar painel)
- [ ] Gates do TaskIA ligados (check, coverage, knip, jscpd, slop)

## Fora de escopo
- Qualquer tela de negócio (T-025..T-030), backend/conta/login, publicar em loja

## Critérios de aceite (Done)
- [ ] Dado celular, quando abro a URL, então oferece "instalar" e abre em fullscreen sem browser
- [ ] Dado offline, quando abro, então shell + páginas visitadas carregam
- [ ] Dado `bun run check`, quando roda, então verde (gates herdados)

## Plano
1. Scaffold + shadcn init + PWA plugin
2. Tokens + layout base + página `/health`
3. Gates verdes

## Handoff para próxima IA
Repo novo (fora de `/home/zatty/task`). Traga `AGENTS.md` adaptado (runes, sem `any`, tokens via CSS). Valide PWA no Chrome Android (install prompt + offline).

## Log
- 2026-09-06 (ia-opencode): criada refinada (score 85).
- 2026-09-06 (ia-opencode): movida refinando → pronto (score 85 ≥ 70, aceite testável, sem deps).
- 2026-09-07T03:13:09.009Z : mover → fazendo. Motivo: inicio setup app Marmita
- 2026-09-07T03:15:32.562Z : mover → revisao. Motivo: base PWA + tokens + layout, check 0/0, build ok
