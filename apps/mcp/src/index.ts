#!/usr/bin/env bun
import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  type CallToolResult,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import type { ConfigTaskia, Result, Task } from "@taskia/core";
import { aplicarMovimento, avaliarClareza, esqueletoNovaTarefa, nomeArquivo, parseConfig, parseTask, resolverProjeto, validarBranch, verificarQuality } from "@taskia/core";

const ROOT = process.env["TASKIA_ROOT"] ?? join(process.cwd(), ".taskia");
const TASKS = join(ROOT, "tasks");

interface Arquivo {
  id: string;
  arquivo: string;
  raw: string;
}

interface Carregada {
  arquivo: string;
  raw: string;
  task: Task;
}

async function lerTodas(): Promise<Arquivo[]> {
  const files = (await readdir(TASKS)).filter((f) => f.endsWith(".md")).sort();
  return Promise.all(
    files.map(async (f) => ({ id: f, arquivo: join(TASKS, f), raw: await readFile(join(TASKS, f), "utf8") })),
  );
}

async function carregarConfig(): Promise<Result<ConfigTaskia>> {
  let raw: string;
  try {
    raw = await readFile(join(ROOT, "config.yaml"), "utf8");
  } catch {
    return { ok: false, error: "VALIDATION: config.yaml não encontrado em .taskia/" };
  }
  return parseConfig(raw);
}

async function carregarTarefa(id: string): Promise<Result<Carregada>> {
  const todas = await lerTodas();
  const achada = todas.find((t) => t.id.startsWith(id));
  if (!achada) return { ok: false, error: `NAO_ENCONTRADO: ${id}` };
  const parsed = parseTask(achada.raw);
  if (!parsed.ok) return parsed;
  return { ok: true, value: { arquivo: achada.arquivo, raw: achada.raw, task: parsed.value } };
}

async function proximoId(): Promise<string> {
  const existentes = await lerTodas();
  const ids = existentes.map((e) => Number(e.id.slice(2, 5))).filter((n) => !Number.isNaN(n));
  return String(Math.max(0, ...ids) + 1).padStart(3, "0");
}

function erro(text: string): CallToolResult {
  return { content: [{ type: "text", text }], isError: true };
}

function texto(text: string): CallToolResult {
  return { content: [{ type: "text", text }] };
}

const TipoSchema = z.enum(["feature", "bug", "chore", "spike", "decisao"]);
const PrioridadeSchema = z.enum(["P0", "P1", "P2", "P3"]);
const StatusSchema = z.enum(["inbox", "refinando", "pronto", "fazendo", "revisao", "feito", "arquivado"]);

const SCHEMAS = {
  criar_tarefa: z.object({
    titulo: z.string(),
    tipo: TipoSchema.default("feature"),
    prioridade: PrioridadeSchema.default("P2"),
    projeto: z.string().optional(),
    branch: z.string().optional(),
  }),
  listar_tarefas: z.object({ status: z.string().optional(), projeto: z.string().optional() }),
  obter_tarefa: z.object({ id: z.string() }),
  atualizar_tarefa: z.object({
    id: z.string(),
    titulo: z.string().optional(),
    responsavel: z.string().nullable().optional(),
    estimativa: z.string().optional(),
    clarity_score: z.number().optional(),
    entrada_log: z.string().default(""),
    branch: z.string().optional(),
  }),
  mover_tarefa: z.object({ id: z.string(), para: StatusSchema, motivo: z.string() }),
  comentar_log: z.object({ id: z.string(), autor: z.string(), texto: z.string() }),
  dividir_tarefa: z.object({ id: z.string(), subtarefas: z.array(z.object({ titulo: z.string() })).min(2) }),
  resumir_quadro: z.object({ projeto: z.string().optional() }),
  avaliar_clareza: z.object({ id: z.string() }),
  verificar_qualidade: z.object({ id: z.string(), slop: z.number().default(100) }),
} as const;

type NomeTool = keyof typeof SCHEMAS;

const DESCRICOES: Record<NomeTool, string> = {
  criar_tarefa: "Cria T-XXX em inbox",
  listar_tarefas: "Lista resumida (economiza tokens)",
  obter_tarefa: "Context Pack completo da tarefa",
  atualizar_tarefa: "Patch validado (incrementa versao)",
  mover_tarefa: "Move com validação total (estados + DoR + WIP)",
  comentar_log: "Append no ## Log sem mexer no resto",
  dividir_tarefa: "Quebra em 2+ filhas, arquiva original com link",
  resumir_quadro: "Daily: contagem por coluna + travadas + próximas",
  avaliar_clareza: "Clarity score 0-100 + o que falta",
  verificar_qualidade: "Quality + slop gates (10 limites)",
};

async function criarTarefa(args: z.infer<typeof SCHEMAS.criar_tarefa>): Promise<CallToolResult> {
  const cfg = await carregarConfig();
  if (!cfg.ok) return erro(cfg.error);
  const proj = resolverProjeto(args.projeto ?? "", cfg.value);
  if (!proj.ok) return erro(proj.error);
  const branch = args.branch ?? "";
  if (branch !== "") {
    const vb = validarBranch(branch);
    if (!vb.ok) return erro(vb.error);
  }
  const next = await proximoId();
  const agora = new Date().toISOString();
  await writeFile(
    join(TASKS, nomeArquivo(next, args.titulo)),
    esqueletoNovaTarefa(next, { titulo: args.titulo, tipo: args.tipo, prioridade: args.prioridade, status: "inbox", projeto: proj.value, branch }, agora),
    "utf8",
  );
  return texto(`T-${next} criada em inbox (${proj.value}).`);
}

async function listarTarefas(args: z.infer<typeof SCHEMAS.listar_tarefas>): Promise<CallToolResult> {
  const todas = await lerTodas();
  const linhas: string[] = [];
  for (const t of todas) {
    const p = parseTask(t.raw);
    if (!p.ok) continue;
    if (args.status !== undefined && p.value.frontmatter.status !== args.status) continue;
    if (args.projeto !== undefined && p.value.frontmatter.projeto !== args.projeto) continue;
    const f = p.value.frontmatter;
    linhas.push(`${f.id} | ${f.status} | ${f.projeto || "?"} | ${f.prioridade} | ${f.titulo}`);
  }
  return texto(linhas.join("\n") || "vazio");
}

async function atualizarTarefa(args: z.infer<typeof SCHEMAS.atualizar_tarefa>): Promise<CallToolResult> {
  const c = await carregarTarefa(args.id);
  if (!c.ok) return erro(c.error);
  let raw = c.value.raw;
  const f = c.value.task.frontmatter;
  if (args.titulo !== undefined) raw = raw.replace(`titulo: ${f.titulo}`, `titulo: ${args.titulo}`);
  if (args.responsavel !== undefined)
    raw = raw.replace(`responsavel: ${f.responsavel ?? "null"}`, `responsavel: ${args.responsavel ?? "null"}`);
  if (args.estimativa !== undefined) raw = raw.replace(`estimativa: ${f.estimativa}`, `estimativa: ${args.estimativa}`);
  if (args.clarity_score !== undefined)
    raw = raw.replace(`clarity_score: ${f.clarity_score}`, `clarity_score: ${args.clarity_score}`);
  if (args.branch !== undefined) {
    if (f.status === "fazendo" || f.status === "revisao" || f.status === "feito") {
      return erro("VALIDATION: branch travada após fazendo. Crie nova tarefa linkada.");
    }
    const vb = validarBranch(args.branch);
    if (!vb.ok) return erro(vb.error);
    raw = raw.replace(/^branch: .*$/m, `branch: ${args.branch}`);
  }
  const agora = new Date().toISOString();
  raw = raw.replace(/versao: \d+/, `versao: ${f.versao + 1}`).replace(/atualizado_em: .*/, `atualizado_em: ${agora}`);
  if (args.entrada_log !== "") raw = `${raw.trim()}\n\n## Log\n- ${agora} : ${args.entrada_log}\n`;
  await writeFile(c.value.arquivo, raw, "utf8");
  return texto(`${args.id} atualizada (v${f.versao + 1}).`);
}

async function moverTarefa(args: z.infer<typeof SCHEMAS.mover_tarefa>): Promise<CallToolResult> {
  const c = await carregarTarefa(args.id);
  if (!c.ok) return erro(c.error);
  const m = aplicarMovimento(c.value.raw, args.para, args.motivo, new Date().toISOString(), true);
  if (!m.ok) return erro(m.error);
  await writeFile(c.value.arquivo, m.value.raw, "utf8");
  return texto(`${args.id} → ${args.para} ok (v${m.value.versao}).`);
}

async function comentarLog(args: z.infer<typeof SCHEMAS.comentar_log>): Promise<CallToolResult> {
  const c = await carregarTarefa(args.id);
  if (!c.ok) return erro(c.error);
  const linha = `- ${new Date().toISOString()} (${args.autor}): ${args.texto}\n`;
  const raw = c.value.raw.includes("## Log") ? `${c.value.raw.trim()}\n${linha}` : `${c.value.raw.trim()}\n\n## Log\n${linha}`;
  await writeFile(c.value.arquivo, raw, "utf8");
  return texto(`${args.id}: log anexado.`);
}

async function dividirTarefa(args: z.infer<typeof SCHEMAS.dividir_tarefa>): Promise<CallToolResult> {
  const c = await carregarTarefa(args.id);
  if (!c.ok) return erro(c.error);
  const cfg = await carregarConfig();
  if (!cfg.ok) return erro(cfg.error);
  const proj = resolverProjeto(c.value.task.frontmatter.projeto, cfg.value);
  if (!proj.ok) return erro(proj.error);
  const agora = new Date().toISOString();
  const filhas: string[] = [];
  for (const sub of args.subtarefas) {
    const next = await proximoId();
    const esqueleto = esqueletoNovaTarefa(next, { titulo: sub.titulo, tipo: "feature", prioridade: "P2", status: "refinando", projeto: proj.value }, agora);
    await writeFile(join(TASKS, nomeArquivo(next, sub.titulo)), esqueleto, "utf8");
    filhas.push(`T-${next}`);
  }
  const arquivada = c.value.raw
    .replace(`status: ${c.value.task.frontmatter.status}`, "status: arquivado")
    .replace(/atualizado_em: .*/, `atualizado_em: ${agora}`);
  await writeFile(c.value.arquivo, `${arquivada.trim()}\n\n## Log\n- ${agora} : dividida em ${filhas.join(", ")}.\n`, "utf8");
  return texto(`${args.id} → ${filhas.join(", ")}.`);
}

async function resumirQuadro(args: z.infer<typeof SCHEMAS.resumir_quadro>): Promise<CallToolResult> {
  const todas = await lerTodas();
  const grupos = new Map<string, Map<string, number>>();
  for (const t of todas) {
    const p = parseTask(t.raw);
    if (!p.ok) continue;
    const proj = p.value.frontmatter.projeto || "?";
    if (args.projeto !== undefined && proj !== args.projeto) continue;
    let contagem = grupos.get(proj);
    if (contagem === undefined) {
      contagem = new Map<string, number>();
      grupos.set(proj, contagem);
    }
    const st = p.value.frontmatter.status;
    contagem.set(st, (contagem.get(st) ?? 0) + 1);
  }
  const blocos: string[] = [];
  for (const [proj, contagem] of [...grupos.entries()].sort()) {
    const linhas = [...contagem.entries()].map(([s, n]) => `- ${s}: ${n}`).join("\n");
    blocos.push(`## ${proj}\n${linhas}`);
  }
  return texto(`# Quadro\n${blocos.join("\n") || "vazio"}`);
}

async function verificarQualidade(args: z.infer<typeof SCHEMAS.verificar_qualidade>): Promise<CallToolResult> {
  const c = await carregarTarefa(args.id);
  if (!c.ok) return erro(c.error);
  const r = verificarQuality(c.value.task, {
    metricas: [],
    mutantesSobreviventes: 0,
    deadCode: 0,
    clonesNovos: 0,
    anyUnknown: 0,
    slopScore: args.slop,
  });
  if (!r.ok) return erro(r.error);
  return texto(`${args.id}: qualidade passando (sem métricas de arquivo — anexe reports/)`);
}

// eslint-disable-next-line @typescript-eslint/no-deprecated -- McpServer.tool() dispara TS2589 no SDK 1.30 (30s+/call); Server low-level é API pública suportada e tipa em ~10s.
const server = new Server({ name: "taskia-mcp", version: "0.1.0" }, { capabilities: { tools: {} } });

server.setRequestHandler(ListToolsRequestSchema, () => ({
  tools: (Object.keys(SCHEMAS) as NomeTool[]).map((name) => ({
    name,
    description: DESCRICOES[name],
    inputSchema: zodToJsonSchema(SCHEMAS[name], { target: "jsonSchema7" }),
  })),
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const rawArgs = request.params.arguments ?? {};
  try {
    switch (request.params.name) {
      case "criar_tarefa": return await criarTarefa(SCHEMAS.criar_tarefa.parse(rawArgs));
      case "listar_tarefas": return await listarTarefas(SCHEMAS.listar_tarefas.parse(rawArgs));
      case "obter_tarefa": {
        const c = await carregarTarefa(SCHEMAS.obter_tarefa.parse(rawArgs).id);
        if (!c.ok) return erro(c.error);
        return texto(c.value.raw);
      }
      case "atualizar_tarefa": return await atualizarTarefa(SCHEMAS.atualizar_tarefa.parse(rawArgs));
      case "mover_tarefa": return await moverTarefa(SCHEMAS.mover_tarefa.parse(rawArgs));
      case "comentar_log": return await comentarLog(SCHEMAS.comentar_log.parse(rawArgs));
      case "dividir_tarefa": return await dividirTarefa(SCHEMAS.dividir_tarefa.parse(rawArgs));
      case "resumir_quadro": return await resumirQuadro(SCHEMAS.resumir_quadro.parse(rawArgs));
      case "avaliar_clareza": {
        const c = await carregarTarefa(SCHEMAS.avaliar_clareza.parse(rawArgs).id);
        if (!c.ok) return erro(c.error);
        return texto(JSON.stringify(avaliarClareza(c.value.task)));
      }
      case "verificar_qualidade": return await verificarQualidade(SCHEMAS.verificar_qualidade.parse(rawArgs));
      default: return erro(`NAO_ENCONTRADO: tool ${request.params.name}`);
    }
  } catch (e) {
    return erro(`VALIDATION: argumentos inválidos: ${e instanceof Error ? e.message : String(e)}`);
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
