import { supabase } from "./supabase-config-professor.js";

function mostrarPainel(logado) {
  document.getElementById("login").classList.toggle("hidden", logado);
  document.getElementById("painel").classList.toggle("hidden", !logado);
}

supabase.auth.getSession().then(async ({ data: { session } }) => {
  const valida = session && !session.user?.is_anonymous;
  if (!valida && session) {
    await supabase.auth.signOut();
  }
  mostrarPainel(valida);
});

supabase.auth.onAuthStateChange(async (_event, session) => {
  const valida = session && !session.user?.is_anonymous;
  if (!valida && session) {
    await supabase.auth.signOut();
  }
  mostrarPainel(valida);
});

document.getElementById("btnLogin").addEventListener("click", async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("senha").value;
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    alert("Login inválido: " + error.message);
  } else {
    mostrarPainel(true);
  }
});

document.getElementById("btnLogout").addEventListener("click", async () => {
  await supabase.auth.signOut();
  mostrarPainel(false);
});

const TAMANHO_PAGINA = 1000;

async function buscarLogs() {
  const todos = [];
  let pagina = 0;

  while (true) {
    const inicio = pagina * TAMANHO_PAGINA;
    const fim = inicio + TAMANHO_PAGINA - 1;
    const { data, error } = await supabase
      .from("logs")
      .select("*")
      .order("timestamp", { ascending: true })
      .order("id", { ascending: true })
      .range(inicio, fim);

    if (error) {
      alert("Erro ao buscar logs: " + error.message);
      return [];
    }
    if (!data || data.length === 0) break;

    todos.push(...data);
    if (data.length < TAMANHO_PAGINA) break;
    pagina++;
  }

  return todos;
}

function gerarCSV(logs) {
  const colunas = [
    "session_id",
    "timestamp",
    "algoritmo",
    "frame_idx",
    "acao",
    "detalhes",
  ];
  const linhas = logs.map((h) => {
    const detalhesStr = JSON.stringify(h.detalhes).replace(/"/g, '""');
    return [
      h.session_id,
      h.timestamp,
      h.algoritmo,
      h.frame_idx,
      h.acao,
      `"${detalhesStr}"`,
    ].join(",");
  });
  const csvString = "\uFEFF" + [colunas.join(","), ...linhas].join("\n");
  const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `logs_turma_${Date.now()}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

async function limparTabela() {
  const { error } = await supabase.from("logs").delete().not("id", "is", null);
  if (error) alert("Erro ao limpar: " + error.message);
}

document.getElementById("btnExportar").addEventListener("click", async () => {
  const logs = await buscarLogs();
  if (logs.length === 0) return alert("Não há dados para exportar.");
  gerarCSV(logs);
});

document.getElementById("btnLimpar").addEventListener("click", async () => {
  const logs = await buscarLogs();
  if (logs.length === 0) return alert("Não há dados para limpar.");
  if (!confirm(`Baixar CSV de ${logs.length} registros e apagar a tabela?`)) {
    return;
  }
  gerarCSV(logs);
  await limparTabela();
  alert("CSV baixado e sessão limpa para a próxima turma.");
});
