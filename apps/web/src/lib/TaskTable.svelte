<script lang="ts">
  import { ordenarParaLista, type CardView } from "$lib/board.js";

  interface Props {
    linhas: CardView[];
    onAbrir: (id: string) => void;
  }
  let { linhas, onAbrir }: Props = $props();
  let ordenadas = $derived(ordenarParaLista(linhas));
</script>

<table>
  <thead>
    <tr>
      <th scope="col">ID</th>
      <th scope="col">Título</th>
      <th scope="col">Status</th>
      <th scope="col">Prioridade</th>
      <th scope="col">Dono</th>
      <th scope="col">Clarity</th>
    </tr>
  </thead>
  <tbody>
    {#each ordenadas as t (t.id)}
      <tr>
        <td><button class="link" onclick={() => onAbrir(t.id)}>{t.id}</button></td>
        <td>{t.titulo}</td>
        <td>{t.status}</td>
        <td>{t.prioridade}</td>
        <td>{t.responsavel ?? "—"}</td>
        <td>{t.clarity}</td>
      </tr>
    {/each}
  </tbody>
</table>

<style>
  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
    background: var(--bg-1);
    border: 1px solid var(--border);
    border-radius: 10px;
    overflow: hidden;
  }
  th,
  td {
    text-align: left;
    padding: 8px 12px;
    border-bottom: 1px solid var(--border);
    color: var(--text-1);
  }
  th {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--text-2);
  }
  tbody tr:last-child td {
    border-bottom: none;
  }
  .link {
    background: none;
    border: none;
    padding: 0;
    color: var(--st-pronto);
    font-family: "JetBrains Mono", monospace;
    font-size: 12px;
    cursor: pointer;
  }
</style>
