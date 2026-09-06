import { describe, expect, it } from "vitest";
import { cognitivaPorFuncao, deveAnalisar, verificarLimite } from "../src/cognitiva.js";

function scoreDe(codigo: string): Map<string, number> {
  return new Map(cognitivaPorFuncao("a.ts", codigo).map((f) => [f.nome, f.cognitiva]));
}

describe("cognitivaPorFuncao", () => {
  it("função simples zera", () => {
    const r = cognitivaPorFuncao("a.ts", "export function soma(a: number, b: number): number {\n  return a + b;\n}\n");
    expect(r).toEqual([{ nome: "soma", linha: 1, cognitiva: 0 }]);
  });

  it("if aninhado soma nível", () => {
    const m = scoreDe(
      "export function f(a: boolean, b: boolean): number {\n  if (a) {\n    if (b) {\n      return 1;\n    }\n  }\n  return 0;\n}\n",
    );
    expect(m.get("f")).toBe(3);
  });

  it("if/else-if/else somam 3 no nível 0", () => {
    const m = scoreDe(
      "export function f(a: boolean, b: boolean): number {\n  if (a) {\n    return 1;\n  } else if (b) {\n    return 2;\n  } else {\n    return 3;\n  }\n}\n",
    );
    expect(m.get("f")).toBe(3);
  });

  it("laços, switch, catch e ternário", () => {
    const m = scoreDe(
      "export function loops(xs: number[]): number {\n  let r = 0;\n  for (let i = 0; i < 10; i++) {\n    r += i;\n  }\n  for (const k in xs) {\n    r += 1;\n  }\n  for (const x of xs) {\n    r += x;\n  }\n  while (r < 0) {\n    r += 1;\n  }\n  do {\n    r -= 1;\n  } while (r > 100);\n  return r;\n}\nexport function sw(n: number): number {\n  switch (n) {\n    case 1:\n      if (n > 0) {\n        return 1;\n      }\n      return 0;\n    default:\n      return -1;\n  }\n}\nexport function tent(): number {\n  try {\n    return 1;\n  } catch {\n    return 2;\n  } finally {\n    return 3;\n  }\n}\nexport function tern(xs: number[]): number {\n  let r = 0;\n  for (const x of xs) {\n    r += x > 0 ? x : 0;\n  }\n  return r;\n}\n",
    );
    expect(m.get("loops")).toBe(5);
    expect(m.get("sw")).toBe(3);
    expect(m.get("tent")).toBe(1);
    expect(m.get("tern")).toBe(3);
  });

  it("sequências lógicas e ??", () => {
    const m = scoreDe(
      "export function c1(a: boolean, b: boolean, c: boolean): boolean {\n  return a && b && c;\n}\nexport function c2(a: boolean, b: boolean, c: boolean): boolean {\n  return a && b || c;\n}\nexport function c3(a: boolean, b: boolean, c: boolean): boolean {\n  return (a || b) && c;\n}\nexport function c4(a: number | null, b: number | null): number | null {\n  return a ?? b;\n}\n",
    );
    expect(m.get("c1")).toBe(1);
    expect(m.get("c2")).toBe(2);
    expect(m.get("c3")).toBe(2);
    expect(m.get("c4")).toBe(0);
  });

  it("funções aninhadas viram entradas próprias", () => {
    const r = cognitivaPorFuncao(
      "a.ts",
      "export function outer(a: boolean): () => number {\n  if (a) {\n    return () => 1;\n  }\n  const inner = (): number => (a ? 1 : 0);\n  return inner;\n}\n",
    );
    const m = new Map(r.map((f) => [f.nome, f.cognitiva]));
    expect(m.get("outer")).toBe(1);
    expect(m.get("inner")).toBe(1);
  });

  it("classe: ctor/get/set/método com nomes próprios", () => {
    const m = scoreDe(
      "export class C {\n  constructor(private n: number) {}\n  get v(): number {\n    return this.n;\n  }\n  set v(x: number) {\n    this.n = x;\n  }\n  m(a: boolean): number {\n    if (a) {\n      return 1;\n    }\n    return 0;\n  }\n}\n",
    );
    expect(m.get("m")).toBe(1);
    expect(m.get("v")).toBe(0);
  });

  it("function anônima em objeto herda o nome da propriedade", () => {
    const m = scoreDe(
      "export const o = {\n  f: function (a: boolean): number {\n    if (a) {\n      return 1;\n    }\n    return 0;\n  },\n};\n",
    );
    expect(m.get("f")).toBe(1);
  });

  it("nome computado cai para anonima", () => {
    const r = cognitivaPorFuncao("a.ts", "export class K {\n  [\"k\"](): number {\n    return 2;\n  }\n}\n");
    expect(r).toEqual([{ nome: "<anonima>:2", linha: 2, cognitiva: 0 }]);
  });

  it("anônima sem contexto usa <anonima>:linha", () => {
    const r = cognitivaPorFuncao("a.ts", "export default function (): number {\n  return 1;\n}\n");
    expect(r).toEqual([{ nome: "<anonima>:1", linha: 1, cognitiva: 0 }]);
  });

  it("overloads sem corpo zeram", () => {
    const r = cognitivaPorFuncao(
      "a.ts",
      "export function ov(a: string): number;\nexport function ov(a: number): number;\nexport function ov(a: unknown): number {\n  return 1;\n}\n",
    );
    expect(r.every((f) => f.cognitiva === 0)).toBe(true);
    expect(r).toHaveLength(3);
  });

  it("código top-level vira <modulo>; arquivo só-funções não tem módulo", () => {
    const com = cognitivaPorFuncao("a.ts", "export const x = cond ? 1 : 0;\n");
    expect(com).toEqual([{ nome: "<modulo>", linha: 1, cognitiva: 1 }]);
    expect(cognitivaPorFuncao("a.ts", "export function f(): number {\n  return 1;\n}\n").some((f) => f.nome === "<modulo>")).toBe(false);
    expect(cognitivaPorFuncao("a.ts", "")).toEqual([]);
  });
});

describe("verificarLimite", () => {
  it("viola em >= max e passa abaixo", () => {
    const codigo = "export function f(a: boolean, b: boolean): number {\n  if (a) {\n    if (b) {\n      return 1;\n    }\n  }\n  return 0;\n}\n";
    expect(verificarLimite("a.ts", codigo, 3)).toEqual([{ arquivo: "a.ts", nome: "f", linha: 1, cognitiva: 3 }]);
    expect(verificarLimite("a.ts", codigo, 4)).toEqual([]);
  });
});

describe("deveAnalisar", () => {
  it("filtra infra e aceita fonte", () => {
    expect(deveAnalisar("src/a.ts")).toBe(true);
    expect(deveAnalisar("src/a.test.ts")).toBe(false);
    expect(deveAnalisar("src/a.d.ts")).toBe(false);
    expect(deveAnalisar("src/a.svelte")).toBe(false);
    expect(deveAnalisar("docs/a.md")).toBe(false);
    expect(deveAnalisar("node_modules/x/a.ts")).toBe(false);
    expect(deveAnalisar("apps/web/dist/a.ts")).toBe(false);
    expect(deveAnalisar("apps/web/build/a.ts")).toBe(false);
    expect(deveAnalisar("apps/web/coverage/a.ts")).toBe(false);
    expect(deveAnalisar("apps/web/.svelte-kit/a.ts")).toBe(false);
  });
});
