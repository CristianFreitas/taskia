import * as ts from "typescript";

// Complexidade cognitiva, subset inspirado no Sonar ("Cognitive Complexity", G. A. Campbell).
//
// Regras implementadas (determinísticas, documentadas aqui porque NÃO há paridade
// total com o Sonar — o gate precisa de estabilidade, não de igualdade):
// - +1 + nível atual: if, else-if, else, switch, for, for-in, for-of, while,
//   do-while, catch, ternário (? :).
//   - `else if` conta +1 + nível (sem aninhar): `if/else-if/else` no nível 0 = 3.
//   - `else` puro conta +1 flat (sem nível); o corpo do else aninha +1.
//   - Corpo das demais estruturas aninha +1.
// - Sequência maximal de `&&` ou `||`: +1 por sequência (flat, sem nível).
//   `a && b && c` = +1; `a && b || c` = +2. Parênteses são transparentes.
//   `??` NÃO conta (só && e ||), mas os filhos são visitados normalmente.
// - Funções NÃO aumentam o nível; cada função é medida com nível inicial 0.
//   Funções aninhadas viram entradas próprias (a externa ignora a subárvore).
// - NÃO detectado (documentado): recursão, `break/continue` com label, JSX conta
//   como código normal, `.svelte` fora do escopo (só `.ts`).
// - Gate: viola se cognitiva >= max (max 22 = limite "<22").

export interface FuncaoComplexa {
  nome: string;
  linha: number;
  cognitiva: number;
}

export interface Violacao extends FuncaoComplexa {
  arquivo: string;
}

type FuncaoLike =
  | ts.FunctionDeclaration
  | ts.FunctionExpression
  | ts.ArrowFunction
  | ts.MethodDeclaration
  | ts.GetAccessorDeclaration
  | ts.SetAccessorDeclaration
  | ts.ConstructorDeclaration;

function isFuncaoLike(no: ts.Node): no is FuncaoLike {
  return (
    ts.isFunctionDeclaration(no) ||
    ts.isFunctionExpression(no) ||
    ts.isArrowFunction(no) ||
    ts.isMethodDeclaration(no) ||
    ts.isGetAccessorDeclaration(no) ||
    ts.isSetAccessorDeclaration(no) ||
    ts.isConstructorDeclaration(no)
  );
}

function isLaco(no: ts.Node): no is ts.ForStatement | ts.ForInStatement | ts.ForOfStatement | ts.WhileStatement | ts.DoStatement {
  return (
    ts.isForStatement(no) ||
    ts.isForInStatement(no) ||
    ts.isForOfStatement(no) ||
    ts.isWhileStatement(no) ||
    ts.isDoStatement(no)
  );
}

function isOperadorLogico(no: ts.Node): no is ts.BinaryExpression {
  return (
    ts.isBinaryExpression(no) &&
    (no.operatorToken.kind === ts.SyntaxKind.AmpersandAmpersandToken ||
      no.operatorToken.kind === ts.SyntaxKind.BarBarToken)
  );
}

function linhaDe(sf: ts.SourceFile, no: ts.Node): number {
  return sf.getLineAndCharacterOfPosition(no.getStart(sf)).line + 1;
}

function nomeContexto(pai: ts.Node, filho: ts.Node): string | null {
  if (ts.isVariableDeclaration(pai) && pai.initializer === filho && ts.isIdentifier(pai.name)) {
    return pai.name.text;
  }
  if (ts.isPropertyAssignment(pai) && !ts.isComputedPropertyName(pai.name)) {
    return pai.name.text;
  }
  return null;
}

function nomeProprio(no: FuncaoLike): string | null {
  if (ts.isMethodDeclaration(no) || ts.isGetAccessorDeclaration(no) || ts.isSetAccessorDeclaration(no)) {
    return ts.isIdentifier(no.name) ? no.name.text : null;
  }
  if (ts.isFunctionDeclaration(no) || ts.isFunctionExpression(no)) {
    return no.name?.text ?? null;
  }
  return null;
}

function nomeDe(no: FuncaoLike, herdado: string | null, sf: ts.SourceFile): string {
  const proprio = nomeProprio(no);
  if (proprio !== null) {
    return proprio;
  }
  if (herdado !== null) {
    return herdado;
  }
  return `<anonima>:${linhaDe(sf, no)}`;
}

function coletar(sf: ts.SourceFile, no: ts.Node, herdado: string | null, out: { no: FuncaoLike; nome: string }[]): void {
  if (isFuncaoLike(no)) {
    out.push({ no, nome: nomeDe(no, herdado, sf) });
  }
  ts.forEachChild(no, (filho) => {
    coletar(sf, filho, nomeContexto(no, filho), out);
  });
}

function pontuarFilhos(no: ts.Node, nivel: number): number {
  let soma = 0;
  ts.forEachChild(no, (filho) => {
    soma += pontuar(filho, nivel);
  });
  return soma;
}

function pontuarElse(alt: ts.Statement | undefined, nivel: number): number {
  if (alt === undefined) {
    return 0;
  }
  if (ts.isIfStatement(alt)) {
    return 1 + nivel + pontuar(alt.thenStatement, nivel + 1) + pontuarElse(alt.elseStatement, nivel);
  }
  return 1 + pontuar(alt, nivel + 1);
}

function pontuarOperando(expr: ts.Expression, op: ts.SyntaxKind, nivel: number): number {
  if (ts.isParenthesizedExpression(expr)) {
    return pontuarOperando(expr.expression, op, nivel);
  }
  if (ts.isBinaryExpression(expr) && expr.operatorToken.kind === op) {
    return pontuarOperando(expr.left, op, nivel) + pontuarOperando(expr.right, op, nivel);
  }
  if (isOperadorLogico(expr)) {
    return pontuarBinario(expr, nivel);
  }
  return pontuar(expr, nivel);
}

function pontuarBinario(no: ts.BinaryExpression, nivel: number): number {
  const op = no.operatorToken.kind;
  return 1 + pontuarOperando(no.left, op, nivel) + pontuarOperando(no.right, op, nivel);
}

function pontuar(no: ts.Node, nivel: number): number {
  if (ts.isIfStatement(no)) {
    return 1 + nivel + pontuar(no.thenStatement, nivel + 1) + pontuarElse(no.elseStatement, nivel);
  }
  if (ts.isConditionalExpression(no)) {
    return 1 + nivel + pontuar(no.whenTrue, nivel + 1) + pontuar(no.whenFalse, nivel + 1);
  }
  if (ts.isSwitchStatement(no)) {
    return 1 + nivel + pontuar(no.caseBlock, nivel + 1);
  }
  if (ts.isCatchClause(no)) {
    return 1 + nivel + pontuar(no.block, nivel + 1);
  }
  if (isLaco(no)) {
    return 1 + nivel + pontuar(no.statement, nivel + 1);
  }
  if (isOperadorLogico(no)) {
    return pontuarBinario(no, nivel);
  }
  if (isFuncaoLike(no)) {
    return 0;
  }
  return pontuarFilhos(no, nivel);
}

function pontuarFuncao(no: FuncaoLike): number {
  if (no.body === undefined) {
    return 0;
  }
  return pontuar(no.body, 0);
}

export function cognitivaPorFuncao(arquivo: string, conteudo: string): FuncaoComplexa[] {
  const sf = ts.createSourceFile(arquivo, conteudo, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const coletadas: { no: FuncaoLike; nome: string }[] = [];
  coletar(sf, sf, null, coletadas);
  const funcoes = coletadas.map(({ no, nome }) => ({
    nome,
    linha: linhaDe(sf, no),
    cognitiva: pontuarFuncao(no),
  }));
  const resto = sf.statements
    .filter((st) => !isFuncaoLike(st))
    .reduce((soma, st) => soma + pontuar(st, 0), 0);
  if (resto > 0) {
    funcoes.push({ nome: "<modulo>", linha: 1, cognitiva: resto });
  }
  return funcoes;
}

export function verificarLimite(arquivo: string, conteudo: string, max: number): Violacao[] {
  return cognitivaPorFuncao(arquivo, conteudo)
    .filter((f) => f.cognitiva >= max)
    .map((f) => ({ arquivo, ...f }));
}

export function deveAnalisar(caminho: string): boolean {
  if (caminho.endsWith(".d.ts") || caminho.endsWith(".test.ts")) {
    return false;
  }
  if (!caminho.endsWith(".ts")) {
    return false;
  }
  return !/(^|\/)(\.svelte-kit|build|dist|coverage|node_modules)\//.test(caminho);
}
