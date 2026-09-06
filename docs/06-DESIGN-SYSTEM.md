# 06 — Design System (cores, tipo, UI)

> Dark-first. Denso como Linear, lúdico como Trello. Feito pra escanear em 5s.

## Paleta (tokens oficiais — usar HEX exato)

**Fundo:**
- `--bg-0`: `#0B0D12` (app)
- `--bg-1`: `#12151D` (coluna)
- `--bg-2`: `#1A1F2B` (card)
- `--bg-2-hover`: `#222839`
- `--border`: `#2A3142`
- `--text-1`: `#F1F5F9` (título)
- `--text-2`: `#94A3B8` (secundário)
- `--text-3`: `#64748B` (muted)

**Status (fundo do badge = cor a 15% + texto na cor cheia):**
- `inbox`: `#8A8F98`
- `refinando`: `#EAB308`
- `pronto`: `#3B82F6`
- `fazendo`: `#F59E0B` (com pulso/animação sutil — é onde a IA está)
- `revisao`: `#8B5CF6`
- `feito`: `#10B981`
- `arquivado`: `#52525B`
- `bloqueado` (borda + flag): `#EF4444`

**Prioridade (barra esquerda 3px no card):**
- P0 `#EF4444` · P1 `#F97316` · P2 `#3B82F6` · P3 `#A1A1AA`

**Acentos:**
- Primário (botões, links): `#6366F1` (índigo)
- Sucesso: `#10B981` · Aviso: `#F59E0B` · Erro: `#EF4444`
- IA (tudo que foi feito por IA leva selo): gradiente `#8B5CF6 → #6366F1` + ícone ✨

**Light mode (espelho):** bg `#F8FAFC`, coluna `#FFFFFF`, card `#FFFFFF` + shadow, texto `#0F172A`. Mesmos status, só clarear 10%.

## Tipografia

- Fonte: **Inter** (UI) + **JetBrains Mono** (IDs, código, logs).
- Card: título 13px/600, ID+tipo 11px mono muted, tags 11px pill.
- Coluna: nome 12px UPPERCASE/700 tracking-wide + contador pill.
- Detalhe da tarefa: título 20px/700, seções 13px/700 uppercase muted.

## Card (anatomia fixa)

```
┌─────────────────────────────┐
│ [P2|azul 3px] T-001 ✨IA    │  ← header: id mono + selo IA se responsavel=ia-*
│ Implementar login magic link│  ← título 2 linhas max, ellipsis
│ ✅ Pronto · 🔬? ✨feature   │  ← badges status + tipo
│ 🔴 Bloq por T-002           │  ← só se bloqueado/dependência pendente
│ [auth] [backend]     P1     │  ← footer: tags + prioridade
└─────────────────────────────┘
```

- Altura compacta (~110px). Hover: eleva + mostra `mover →` rápido.
- Card em `fazendo` tem anel âmbar pulsante + avatar do dono (🤖 p/ IA, 🧑 p/ humano).

## Quadro

- Colunas 280px, gap 12px, scroll horizontal. Header sticky com WIP (`2/3` fica vermelho se lotar).
- Filtros topo: busca + `minhas` + `da IA` + prioridade. Atalhos: `c` cria, `/` busca, `←→` move selecionado.
- Detalhe abre em drawer direita (não modal): Context Pack inteiro, Log timeline, botões de mover com validação visível (exibe "falta clarity 70" desabilitado com motivo).

## Princípios visuais

1. Estado grita, detalhe sussurra. Cor de status sempre visível de longe.
2. Tudo que IA fez é marcado ✨ — confiança exige proveniência.
3. Zero modal de criar com 20 campos. Criar = só título. Refinar depois (inbox → refinando).

## Stack visual oficial (ver 10-STACK.md — não reinventar)

- **Base:** SvelteKit 2 + Svelte 5 + shadcn-svelte + Tailwind. Tokens acima vivem em `src/theme/taskia.css`.
- **`sv-blocks`:** App Shell do Kanban (sidebar + topbar + board layout). Não criar layout do zero.
- **`sv-animations` (Motion SV):** entrada de card, pulso âmbar em `fazendo`, drawer, toast de mover.
- **`sv-table` + `sv-particles` data-table:** 2ª view Lista/Relatórios (aging, clarity médio, throughput).
- **`sv-matrix`:** skeletons + loading de `resumir_quadro`.
- **`sv-agentation`:** modo `i` em dev — clica no elemento bugado → gera markdown → vira tarefa com Context Pack.
- **`sv-efferd`:** landing pública.
- Qualidade visual também é gate: `svelte-check` 0 erros, sem `any` em props, acessibilidade (focus, aria) ok.
