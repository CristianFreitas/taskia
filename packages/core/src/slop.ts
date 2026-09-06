export interface SlopFinding {
  tipo: string;
  arquivo: string;
  linha: number;
  sugestao: string;
}

const OBVIOUS_COMMENT = /^\s*\/\/( increments?| incrementa| retorna? | seta? | cria? )/i; // slop-allow: fuga_tipos — define o padrão, não foge de tipo
const BANNED_UI_WORDS = ["Unlock", "Delve", "Game-changing", "revolutionizing"]; // slop-allow: texto_slop — define a lista, não usa os termos

function semSuprimidas(conteudo: string): string {
  return conteudo
    .split("\n")
    .map((l) => (l.includes("slop-allow") ? "" : l))
    .join("\n");
}

export function detectarObvios(linhas: string[], arquivo: string): SlopFinding[] {
  const achados: SlopFinding[] = [];
  linhas.forEach((linha, i) => {
    if (!linha.includes("slop-allow") && OBVIOUS_COMMENT.test(linha))
      achados.push({ tipo: "comentario_obvio", arquivo, linha: i + 1, sugestao: "remova: reconta o código" });
  });
  return achados;
}

export function detectarFugaDeTipos(conteudo: string, arquivo: string): SlopFinding[] {
  const achados: SlopFinding[] = [];
  const limpo = semSuprimidas(conteudo);
  const re = /as\s+any|@ts-ignore|@ts-expect-error(?!.*motivo)/g; // slop-allow: fuga_tipos — define o padrão, não foge de tipo
  let m: RegExpExecArray | null;
  while ((m = re.exec(limpo)) !== null) {
    const linha = limpo.slice(0, m.index).split("\n").length;
    achados.push({ tipo: "fuga_tipos", arquivo, linha, sugestao: "conserte o tipo em vez de as any" }); // slop-allow: fuga_tipos — texto da sugestão, não código
  }
  return achados;
}

export function detectarTextoSlop(texto: string, arquivo: string): SlopFinding[] {
  const limpo = semSuprimidas(texto);
  return BANNED_UI_WORDS.filter((w) => limpo.includes(w)).map((w) => ({
    tipo: "texto_slop",
    arquivo,
    linha: 1,
    sugestao: `troque "${w}" por texto específico`,
  }));
}

export function slopScore(totalLinhas: number, achados: SlopFinding[]): number {
  if (totalLinhas <= 0) return 100;
  const peso = achados.reduce((acc, a) => acc + (a.tipo === "comentario_obvio" ? 5 : 15), 0);
  return Math.max(0, 100 - Math.round((peso / totalLinhas) * 100));
}

export interface AvaliacaoArquivo {
  arquivo: string;
  score: number;
  achados: SlopFinding[];
}

export function avaliarArquivo(arquivo: string, conteudo: string): AvaliacaoArquivo {
  const linhas = conteudo.split("\n");
  const achados = [
    ...detectarObvios(linhas, arquivo),
    ...detectarFugaDeTipos(conteudo, arquivo),
    ...detectarTextoSlop(conteudo, arquivo),
  ];
  return { arquivo, score: slopScore(linhas.length, achados), achados };
}
