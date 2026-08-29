import { supabase } from "./supabase-config.js";

function mostrarPainel(logado) {
  document.getElementById("login").style.display = logado ? "none" : "block";
  document.getElementById("painel").style.display = logado ? "block" : "none";
}

supabase.auth.getSession().then(({ data: { session } }) => {
  mostrarPainel(!!session);
});

supabase.auth.onAuthStateChange((_event, session) => {
  mostrarPainel(!!session);
});

document.getElementById("btnLogin").addEventListener("click", async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("senha").value;
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) alert("Login inválido: " + error.message);
});

document.getElementById("btnLogout").addEventListener("click", async () => {
  await supabase.auth.signOut();
});

async function buscarLogs() {
  const { data, error } = await supabase.from("logs").select("*").order("criado_em");
  if (error) { alert("Erro ao buscar logs: " + error.message); return []; }
  return data;
}

function gerarCSV(logs) {
  const colunas = ["session_id", "timestamp", "algoritmo", "frame_idx", "acao", "detalhes"];
  const linhas = logs.map(h => {
    const detalhesStr = JSON.stringify(h.detalhes).replace(/"/g, '""');
    return [h.session_id, h.timestamp, h.algoritmo, h.frame_idx, h.acao, `"${detalhesStr}"`].join(",");
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
  if (logs.length === 0) return alert("Não há dados para exportar.");
  gerarCSV(logs);
  await limparTabela();
  alert("CSV baixado e sessão limpa para a próxima turma.");
});