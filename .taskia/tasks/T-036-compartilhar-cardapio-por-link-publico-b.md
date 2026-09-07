---
id: T-036
titulo: Compartilhar cardápio por link público (backend leve)
status: revisao
tipo: feature
prioridade: P0
projeto: marmita
branch: "t-036-link"
responsavel: null
criado_em: 2026-09-07T16:05:51.156Z
atualizado_em: 2026-09-07T16:13:46.739Z
versao: 6
estimativa: M
dependencias: []
tags: [backend, link, compartilhamento]
arquivos_relevantes: [marmita-api, public-c, painel-share]
clarity_score: 85
quality:
  status: pendente
  relatorio: ""
---

## Objetivo
Cliente escolhe no próprio celular via link `/c/<codigo>`; cozinheira vê as escolhas chegando no painel.

## Contexto
Buraco admitido: app era local-first (localStorage), link não existia. Backend leve = rotas SvelteKit + JSON em disco (`data/`, gitignored, escrita atômica), sem serviço externo. Publicar gera código de 6 letras; cliente abre, escolhe 10, confirma (salvo no servidor); painel lê escolhas pelo código. Validação de escolha reaproveita `podeEscolher` no servidor.

## Escopo
- [ ] Lib server (`banco-server.ts`): publicar→código único, obter, salvar escolha (valida + sobrescreve por nome), listar; testes 100%
- [ ] APIs: `POST/GET /api/cardapios`, `POST/GET /api/escolhas` (finas, sem regra)
- [ ] Publicar no painel também envia snapshot e guarda `codigo` (offline → só local + aviso)
- [ ] Páginas públicas `/c/[codigo]` (escolha) e `/c/[codigo]/lista` (lista + envio wa.me)
- [ ] Painel: card compartilhar (link + copiar + wa.me) e escolhas recebidas na página da cliente

## Fora de escopo
- Conta/login da cozinheira, banco real (SQLite/Postgres), múltiplas cozinheiras isoladas, moderação

## Critérios de aceite (Done)
- [ ] Dado cardápio publicado, quando compartilho, então link `/c/XXXXXX` abre escolha no outro celular
- [ ] Dada escolha confirmada no link, quando abro o painel, então vejo nome + pratos recebidos
- [ ] Dado servidor sem o código, quando abro, então vejo "link inválido" (nunca tela quebrada)
- [ ] Dado `bun run check` + coverage, quando rodam, então verdes

## Plano
1. Lib server + testes + APIs
2. Publicar com código + card compartilhar
3. Páginas públicas + escolhas no painel

## Handoff para próxima IA
Repo /home/zatty/marmita, branch t-036-link. Arquivo server em `data/marmita.json` (não commitar). Depois desta, o produto fecha o ciclo ponta a ponta.

## Log
- 2026-09-07 (ia-opencode): criada refinada (score 85, v2).
- 2026-09-07T16:06:47.304Z : mover → refinando. Motivo: escopo backend leve definido
- 2026-09-07T16:06:49.366Z : mover → pronto. Motivo: score 85, aceite testavel, sem deps
- 2026-09-07T16:06:57.582Z : mover → fazendo. Motivo: inicio backend + link publico
- 2026-09-07T16:13:46.739Z : mover → revisao. Motivo: e2e provado: publicar→codigo→escolha→painel, gates verdes, merge main
