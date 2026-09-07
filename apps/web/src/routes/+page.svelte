<script lang="ts">
  import "../theme/taskia.css";
  import type { CardView } from "$lib/board.js";
  import { Quadro } from "$lib/usarQuadro.svelte.js";
  import BoardTopo from "$lib/BoardTopo.svelte";
  import BoardShell from "$lib/BoardShell.svelte";

  interface Props {
    data: { cards: CardView[] };
  }
  let { data }: Props = $props();
  const q = new Quadro(() => data.cards);
  let esquema = $state<"padrao" | "denso" | "zen">(lerEsquema());

  function lerEsquema(): "padrao" | "denso" | "zen" {
    try {
      const salvo = window.localStorage.getItem("taskia:layout");
      if (salvo === "denso" || salvo === "zen" || salvo === "padrao") return salvo;
    } catch {
      // storage indisponível (privado): segue no padrão
    }
    return "padrao";
  }

  function aoTrocarEsquema(v: "padrao" | "denso" | "zen"): void {
    esquema = v;
    try {
      window.localStorage.setItem("taskia:layout", v);
    } catch {
      // ignora: layout da sessão continua valendo
    }
  }
</script>

<main data-layout={esquema}>
  <BoardTopo
    bind:busca={q.busca}
    bind:dono={q.dono}
    bind:prio={q.prio}
    bind:novoTitulo={q.novoTitulo}
    bind:visao={q.visao}
    {esquema}
    criando={q.criando}
    total={q.total}
    abertas={q.abertas}
    contadores={q.contadores}
    vazio={q.filtrados.length === 0}
    onCriar={() => void q.criar()}
    onLimpar={() => q.limparFiltros()}
    onVisao={(v) => (q.visao = v)}
    onEsquema={aoTrocarEsquema}
  />
  <BoardShell {q} {esquema} visao={q.visao} />
</main>

<style>
  main {
    background: var(--bg-0);
    color: var(--text-1);
    height: 100vh;
    height: 100dvh;
    padding: 16px 24px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  @media (max-width: 720px) {
    main {
      padding: 12px 16px;
    }
  }
</style>
