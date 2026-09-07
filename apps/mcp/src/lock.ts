import { open, stat, unlink } from "node:fs/promises";
import type { Result } from "@taskia/core";

// Serializa escritas concorrentes via lockfile (`<alvo>.lock` com pid dentro).
// Cobre 2 processos (fila em memória só cobriria 1); CAS foi descartado porque
// fs puro não dá atomicidade no check-and-write. Nunca faz hang: stale (>5s)
// é assumido, timeout (default 5s) vira erro tipado.

const STALE_MS = 5000;
const POLL_MS = 20;

type LockEstado = "ok" | "existe" | "erro";

async function tentarLock(lock: string): Promise<LockEstado> {
  try {
    const fd = await open(lock, "wx");
    await fd.writeFile(`${process.pid}`);
    await fd.close();
    return "ok";
  } catch (e: unknown) {
    if (typeof e === "object" && e !== null && "code" in e && e.code === "EEXIST") {
      return "existe";
    }
    return "erro";
  }
}

async function obsoleto(lock: string): Promise<boolean> {
  try {
    const st = await stat(lock);
    return Date.now() - st.mtimeMs > STALE_MS;
  } catch {
    return false;
  }
}

async function soltar(lock: string): Promise<void> {
  try {
    await unlink(lock);
  } catch {
    // outro dono já removeu ou assumiu: nada a fazer
  }
}

export async function comLock<T>(alvo: string, fn: () => Promise<Result<T>>, timeoutMs = 5000): Promise<Result<T>> {
  const lock = `${alvo}.lock`;
  const inicio = Date.now();
  for (;;) {
    const estado = await tentarLock(lock);
    if (estado === "ok") {
      try {
        return await fn();
      } finally {
        await soltar(lock);
      }
    }
    if (estado === "erro") {
      return { ok: false, error: `LOCK: sem acesso a ${alvo}.` };
    }
    if (await obsoleto(lock)) {
      await soltar(lock);
      continue;
    }
    if (Date.now() - inicio >= timeoutMs) {
      return { ok: false, error: `LOCK: timeout aguardando ${alvo} (outro escritor ativo). Tente de novo.` };
    }
    await new Promise((resolve) => setTimeout(resolve, POLL_MS));
  }
}
