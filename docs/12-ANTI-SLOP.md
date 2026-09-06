# 12 — Anti-Slop (operar 100% com IA sem virar legado em 3 meses)

> Slop = código que compila, passa no teste básico, parece ok — mas viola arquitetura, duplica lógica, ou ninguém entendeu antes do review.
> Com 100% IA, ninguém reconstruiu a intenção antes do PR. Esse doc fecha esse buraco.
> Base: `11-PESQUISA-CAMPO.md` + padrões de campo (Casanova reviewer, unslop profiler, Hallmark, stop-slop skills).

## Princípio: recipe-first, não lista de proibição

Pesquisa mostra que só dizer "não gere slop" piora (modelo ancora no termo). Em vez disso:
1. **Receita do que É bom** mora em `AGENTS.md` + tarefa (padrão do arquivo vizinho, exemplo concreto).
2. **Detector** roda depois e dá score + diff limpo.
3. **Humano/2ª IA** valida intenção recuperada (Handoff), não só sintaxe.

## As 7 pragas do code slop (o que o detector flagra)

| # | Praga | Exemplo | Como detectar |
|---|---|---|---|
| 1 | Comentário óbvio | `// incrementa i` em `i++`, bloco que reconta o código | diff com +comentários sem +complexidade → flag |
| 2 | Defensivismo alheio | `try/catch` + `?.` + `if (!x) return` onde input já validado upstream | compara com padrão do arquivo (scratchpad: o vizinho faz assim?) |
| 3 | Fuga de tipos | `as any`, `as unknown as X`, `@ts-ignore` em vez de consertar o tipo | gate `any/unknown=0` já bloqueia; resto vai pro score |
| 4 | Inconsistência de estilo | nome/casing/estrutura diferente do arquivo (ex: `fetchData` num arquivo de `get*`) | eslint + revisão de diff |
| 5 | Over-engineering | factory/strategy/ abstração p/ 2 casos, config que ninguém usa (YAGNI) | pergunta: "o vizinho precisou disso?" + LOC/complexidade |
| 6 | Duplicação mole | copia-cola com 2 nomes trocados em vez de extrair | `jscpd --reporters ai` já pega |
| 7 | Teste de enfeite | teste que executa mas não asserta (coverage mente) | Stryker mata: mutante sobrevive = teste fraco |

## As 5 pragas do UI slop (nossa UI nunca tem)

1. Gradiente decorativo roxo-azul genérico + `transition-all duration-300` em tudo.
2. Vermelho puro `#FF0000` / verde puro `#00FF00` no dark (dói). Usar tokens de `06` (muted).
3. Card genérico sem decisão: sombra + radius + ícone aleatório. Nosso card tem anatomia fixa (`06`).
4. Motion sem sistema: ou zero ou bounce/spring. Nosso: micro 150ms, transição 200-250ms, `cubic-bezier(0.25,1,0.5,1)`, sem bounce.
5. Texto IA: "Delve", "Unlock potential", "Game-changing", empty-state genérico. Revisar com skill `stop-slop`.

## Como opera na TaskIA (3 camadas)

**Camada 1 — Prevenção (generation-time):**
- Toda tarefa com código exige `## Padrão a seguir` (1 arquivo vizinho de referência + 1 exemplo do que NÃO fazer). IA lê antes de codar.
- `AGENTS.md` do repo carrega receita Svelte 5 + tokens TaskIA + "siga o vizinho". MCP `obter_tarefa` retorna isso junto (Context Pack já inclui `arquivos_relevantes`).
- Uma vez com código real: rodar `unslop`-style profiler (gera 50+ outputs do modelo no nosso repo, extrai defaults estatísticos, escreve perfil custom). Vira `docs/12-perfil-unslop.md`.

**Camada 2 — Detecção (automática, antes de `revisao`):**
- `verificar_qualidade` (tool 10) ganha campo `slop`: `{ score: 0-100, achados: [{tipo, arquivo:linha, sugestao}] }`.
- Score: 100 - 15 por praga (comentário óbvio conta 5). **Gate: slop_score ≥ 80 p/ ir pra `revisao`.**
- Comando: prompt reviewer (Casanova) como `bun run review:slop --base main` → devolve diff limpo. IA anexa diff limpo na tarefa.

**Camada 3 — Intenção recuperada (antes de `feito`):**
- `Handoff` + `## Log` respondem: por que essa abordagem e não a alternativa? Se a resposta é "a IA sugeriu", volta pra `fazendo`.
- 2ª IA (ou humano) roda checklist: cabe no `packages/core`? segue o vizinho? é a solução mais simples que passa nos gates?

## Frontmatter + tarefa (aditivo a `03`)

```yaml
slop:
  score: 85              # 0-100, ≥80 p/ revisao
  perfil: v1             # versão do perfil unslop usado
```

```markdown
## Padrão a seguir (obrigatório antes de codar)
- Referência: `src/kanban/Card.svelte` (estrutura + nomes)
- NÃO fazer: `try/catch` em handler já validado (ver Card.svelte:42)
```

## Comandos

```json
{
  "scripts": {
    "review:slop": "bun run verificar-slop --base origin/main --reporter ai",
    "profile:slop": "bun run gerar-perfil-unslop --out docs/12-perfil-unslop.md"
  }
}
```

## Métrica visível (o que a pesquisa enterprise pede)

`resumir_quadro` ganha linha: `slop médio da semana: 84 (↑3)`. Time vê tendência sem burocracia. Caiu 2 semanas seguidas = revisar `AGENTS.md` + perfil, não culpar a IA.
