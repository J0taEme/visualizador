import { supabase } from "./supabase-config.js";

const sessionId =
  localStorage.getItem("sessionId") ||
  (() => {
    const id = "aluno_" + Math.random().toString(36).slice(2, 10);
    localStorage.setItem("sessionId", id);
    return id;
  })();

const sessaoPronta = supabase.auth.signInAnonymously().catch((err) => {
  console.error("Falha no login anônimo:", err);
});

const Tracker = {
  historico: [],

  registrar: async function (acao, algoritmo, frameIdx, detalhes = {}) {
    const evento = {
      timestamp: new Date().toISOString(),
      session_id: sessionId,
      algoritmo,
      frame_idx: frameIdx,
      acao,
      detalhes,
    };
    this.historico.push(evento);

    try {
      await sessaoPronta;
      const { error } = await supabase.from("logs").insert(evento);
      if (error) console.error(error);
    } catch (e) {
      console.error("Erro ao registrar no Supabase:", e);
    }
  },

  obterRespostasQuestoes: function () {
    return this.historico.filter((h) => h.acao === "RESPONDER_QUESTAO");
  },
};

window.Tracker = Tracker;

const btnCopiarSessionId = document.getElementById("btnCopiarSessionId");
if (btnCopiarSessionId) {
  const textoOriginal = btnCopiarSessionId.textContent;
  btnCopiarSessionId.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(sessionId);
      btnCopiarSessionId.textContent = "✅ Copiado!";
    } catch (e) {
      console.error("Erro ao copiar ID de sessão:", e);
      btnCopiarSessionId.textContent = "Erro ao copiar";
    }
    setTimeout(() => {
      btnCopiarSessionId.textContent = textoOriginal;
    }, 1500);
  });
}
