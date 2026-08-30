const codigos = {
  bubble: {
    titulo: "BUBBLE SORT",
    explicativo: {
      linhas: [
        { linha: 1, texto: "compara cada par de barras vizinhas" },
        { linha: 2, texto: "se estão fora de ordem, troca as duas" },
        { linha: 3, texto: "ao fim da passagem, a maior fica no lugar (verde)" },
        { linha: 4, texto: "recomeça ignorando a parte já ordenada" },
      ],
    },
    pseudocodigo: {
      mapa: { 1: [2, 3], 2: [3, 4], 3: [1], 4: [1, 2] },
      linhas: [
        { tipo: "titulo", texto: "BUBBLE-SORT(A)" },
        { linha: 1, texto: "para i ← 1 até n - 1" },
        { linha: 2, texto: "  para j ← 1 até n - i - 1" },
        { linha: 3, texto: "    se A[j] > A[j + 1]" },
        { linha: 4, texto: "      troca A[j] ↔ A[j + 1]" },
      ],
    },
  },
  selection: {
    titulo: "SELECTION SORT",
    explicativo: {
      linhas: [
        { linha: 1, texto: "da posição atual em diante, procura o menor valor" },
        { linha: 2, texto: "marca o 1º como menor provisório (roxo)" },
        { linha: 3, texto: "percorre o resto comparando com o menor atual" },
        { linha: 4, texto: "achou um menor? ele vira o novo menor (roxo)" },
        { linha: 5, texto: "ao fim, troca o menor para a posição atual" },
        { linha: 6, texto: "a posição atual fica ordenada (verde) e avança" },
      ],
    },
    pseudocodigo: {
      mapa: { 1: [1], 2: [2], 3: [3, 4], 4: [4, 5], 5: [6], 6: [1] },
      linhas: [
        { tipo: "titulo", texto: "SELECTION-SORT(A)" },
        { linha: 1, texto: "para i ← 1 até n - 1" },
        { linha: 2, texto: "  menor ← i" },
        { linha: 3, texto: "  para j ← i + 1 até n" },
        { linha: 4, texto: "    se A[j] < A[menor]" },
        { linha: 5, texto: "      menor ← j" },
        { linha: 6, texto: "  troca A[i] ↔ A[menor]" },
      ],
    },
  },
  insertion: {
    titulo: "INSERTION SORT",
    explicativo: {
      linhas: [
        { linha: 1, texto: "pega a próxima barra ainda não ordenada" },
        { linha: 2, texto: "compara com a vizinha da esquerda" },
        { linha: 3, texto: "se a da esquerda for maior, troca as duas" },
        { linha: 4, texto: "repete o empurrão até a barra achar seu lugar" },
        { linha: 5, texto: "a parte à esquerda continua ordenada entre si" },
      ],
    },
    pseudocodigo: {
      mapa: { 1: [1, 2], 2: [3], 3: [4, 5], 4: [3, 4, 5], 5: [1] },
      linhas: [
        { tipo: "titulo", texto: "INSERTION-SORT(A)" },
        { linha: 1, texto: "para i ← 2 até n" },
        { linha: 2, texto: "  j ← i" },
        { linha: 3, texto: "  enquanto j > 1 e A[j - 1] > A[j]" },
        { linha: 4, texto: "    troca A[j - 1] ↔ A[j]" },
        { linha: 5, texto: "    j ← j - 1" },
      ],
    },
  },
  merge: {
    titulo: "MERGE SORT",
    explicativo: {
      linhas: [
        { tipo: "titulo", texto: "ORDENAR(intervalo)" },
        { linha: 1, texto: "divide o intervalo ativo ao meio" },
        { linha: 2, texto: "ORDENAR(metade esquerda)" },
        { linha: 3, texto: "ORDENAR(metade direita)" },
        { linha: 4, texto: "INTERCALAR(esquerda, direita)" },
        { tipo: "espaco" },
        { tipo: "titulo", texto: "INTERCALAR — junta 2 metades já ordenadas" },
        { linha: 5, texto: "compara o menor disponível de cada metade" },
        { linha: 6, texto: "move o menor deles para a posição atual" },
        { linha: 7, texto: "repete até esvaziar uma das metades" },
        { linha: 8, texto: "copia o que sobrou da outra metade" },
      ],
    },
    pseudocodigo: {
      mapa: {
        1: [1, 2],
        2: [3],
        3: [4],
        4: [5],
        5: [9],
        6: [10, 12],
        7: [8],
        8: [10, 12],
      },
      linhas: [
        { tipo: "titulo", texto: "MERGE-SORT(A, p, r)" },
        { linha: 1, texto: "se p < r" },
        { linha: 2, texto: "  q ← ⌊(p + r) / 2⌋" },
        { linha: 3, texto: "  MERGE-SORT(A, p, q)" },
        { linha: 4, texto: "  MERGE-SORT(A, q + 1, r)" },
        { linha: 5, texto: "  INTERCALAR(A, p, q, r)" },
        { tipo: "espaco" },
        { tipo: "titulo", texto: "INTERCALAR(A, p, q, r)" },
        { linha: 6, texto: "E ← A[p..q];  D ← A[q+1..r]" },
        { linha: 7, texto: "i ← 0;  j ← 0" },
        { linha: 8, texto: "para k ← p até r" },
        { linha: 9, texto: "  se i < |E| e (j ≥ |D| ou E[i] ≤ D[j])" },
        { linha: 10, texto: "    A[k] ← E[i];  i ← i + 1" },
        { linha: 11, texto: "  senão" },
        { linha: 12, texto: "    A[k] ← D[j];  j ← j + 1" },
      ],
    },
  },
  quick: {
    titulo: "QUICK SORT",
    explicativo: {
      linhas: [
        { tipo: "titulo", texto: "ORDENAR(intervalo)" },
        { linha: 1, texto: "intervalo com 0 ou 1 elemento: já ordenado" },
        { linha: 2, texto: "p = PARTICIONAR(intervalo)" },
        { linha: 3, texto: "ORDENAR(lado esquerdo, antes de p)" },
        { linha: 4, texto: "ORDENAR(lado direito, depois de p)" },
        { tipo: "espaco" },
        { tipo: "titulo", texto: "PARTICIONAR" },
        { linha: 5, texto: "escolhe o último elemento como pivô (roxo)" },
        { linha: 6, texto: "compara cada barra do intervalo com o pivô" },
        { linha: 7, texto: "barra <= pivô: joga para o lado esquerdo" },
        { linha: 8, texto: "no fim, troca o pivô para o meio dos 2 lados" },
        { linha: 9, texto: "pivô fica na posição final (verde)" },
      ],
    },
    pseudocodigo: {
      mapa: {
        1: [1],
        2: [2],
        3: [3],
        4: [4],
        5: [5, 6],
        6: [8, 7],
        7: [10, 9],
        8: [11],
        9: [12],
      },
      linhas: [
        { tipo: "titulo", texto: "QUICKSORT(A, p, r)" },
        { linha: 1, texto: "se p < r" },
        { linha: 2, texto: "  q ← PARTICIONAR(A, p, r)" },
        { linha: 3, texto: "  QUICKSORT(A, p, q - 1)" },
        { linha: 4, texto: "  QUICKSORT(A, q + 1, r)" },
        { tipo: "espaco" },
        { tipo: "titulo", texto: "PARTICIONAR(A, p, r)" },
        { linha: 5, texto: "pivô ← A[r]" },
        { linha: 6, texto: "i ← p - 1" },
        { linha: 7, texto: "para j ← p até r - 1" },
        { linha: 8, texto: "  se A[j] ≤ pivô" },
        { linha: 9, texto: "    i ← i + 1" },
        { linha: 10, texto: "    troca A[i] ↔ A[j]" },
        { linha: 11, texto: "troca A[i + 1] ↔ A[r]" },
        { linha: 12, texto: "retorna i + 1" },
      ],
    },
  },
};

const CHAVE_MODO_CODIGO = "tccVisualizador_modoCodigo";
let modoCodigo =
  localStorage.getItem(CHAVE_MODO_CODIGO) === "explicativo"
    ? "explicativo"
    : "pseudocodigo";

const $ = (id) => document.getElementById(id);

const refs = {
  inputVetor: $("inputVetor"),
  botaoVetor: $("botaoVetor"),
  botaoAnt: $("botaoAnt"),
  botaoPlay: $("botaoPlay"),
  botaoProx: $("botaoProx"),
  barras: $("barras"),
  codigoRef: $("codigo"),
  codigoCabecalho: document.querySelector(".codigoCabecalho"),
  trocasCount: $("trocasCount"),
  comparacoesCount: $("comparacoesCount"),
  frameCount: $("frameCount"),
  questaoSidebar: $("barraQuestoes"),
  toggleSidebar: $("barraToggle"),
  questaoAtual: $("questaoAtual"),
  questaoStatus: $("questaoStatus"),
  questaoOpcoes: $("questaoOpcoes"),
  historico: $("questaoHistorico"),
  questoesCount: $("questoesCount"),
  autoPauseCheck: $("autoPauseCheck"),
  velocidadeSlider: $("velocidadeSlider"),
  btnModoExplicativo: $("btnModoExplicativo"),
  btnModoPseudo: $("btnModoPseudo"),
};

const botoesAlgoritmos = document.querySelectorAll("#botoesAlgoritmos button");

let vetorAtual = [5, 3, 8, 1, 9, 2, 7, 4];
let frames = [],
  frameAtual = 0,
  timer = null,
  velocidadeIntervalo = 600;

const algoritmoAtual = () =>
  document.querySelector("#botoesAlgoritmos button.active").getAttribute("alg");

function logEvento(acao, detalhes = {}) {
  Tracker.registrar(acao, algoritmoAtual(), frameAtual, detalhes);
}

botoesAlgoritmos.forEach((btn) =>
  btn.addEventListener("click", (e) => {
    if (e.target.classList.contains("active")) {
      return;
    }

    botoesAlgoritmos.forEach((b) => b.classList.remove("active"));

    e.target.classList.add("active");

    logEvento("MUDAR_ALGORITMO", { novo_algoritmo: algoritmoAtual() });

    iniciarVisualizacao();
  }),
);

function gerarFrames() {
  const key = algoritmoAtual();
  const sorts = {
    bubble: BubbleSort,
    selection: SelectionSort,
    insertion: InsertionSort,
    merge: MergeSort,
    quick: QuickSort,
  };

  return new sorts[key](vetorAtual).gerarFrames();
}

function atualizaCodigo(frame) {
  const codigo = codigos[algoritmoAtual()];
  const modo = codigo[modoCodigo] || codigo.explicativo;
  const mapa = modo.mapa;

  const expandir = (passo) => (mapa && mapa[passo] ? mapa[passo] : [passo]);

  const linhasAtivas = new Set();
  (frame.linhasAtivas || []).forEach((passo) =>
    expandir(passo).forEach((l) => linhasAtivas.add(l)),
  );
  const linhaSeta =
    frame.linhaSeta != null ? expandir(frame.linhaSeta)[0] : null;

  let cabecalho = codigo.titulo;
  if (
    frame.subarray &&
    frame.subarray.length &&
    frame.subarray.length < frame.array.length
  ) {
    const a = frame.subarray[0];
    const b = frame.subarray[frame.subarray.length - 1];
    cabecalho += `  ·  trecho A[${a}..${b}]`;
  }
  refs.codigoCabecalho.textContent = cabecalho;
  refs.codigoRef.innerHTML = "";

  modo.linhas.forEach((item) => {
    const texto = typeof item === "string" ? item : item.texto;
    const linha = typeof item === "string" ? null : item.linha;
    const tipo = typeof item === "string" ? null : item.tipo;

    const div = document.createElement("div");
    div.className = "linha";

    if (tipo === "titulo") {
      div.className = "linha titulo";
    } else if (tipo === "espaco") {
      div.className = "linha espaco";
    }

    div.textContent = texto;

    if (linha !== null && linhasAtivas.has(linha)) {
      div.classList.add("active");
    }
    if (linha !== null && linha === linhaSeta) {
      div.classList.add("seta");
    }

    refs.codigoRef.appendChild(div);
  });
}

function aplicarModoCodigo(novo, salvar = true) {
  modoCodigo = novo;
  if (salvar) {
    try {
      localStorage.setItem(CHAVE_MODO_CODIGO, novo);
    } catch (e) {
    }
    logEvento("MUDAR_MODO_CODIGO", { modo: novo });
  }
  refs.btnModoExplicativo.classList.toggle("ativo", novo === "explicativo");
  refs.btnModoPseudo.classList.toggle("ativo", novo === "pseudocodigo");
  if (frames[frameAtual]) atualizaCodigo(frames[frameAtual]);
}

function renderQuestao(frame) {
  if (!frame.questao || frame.questao.fechada) {
    refs.questaoAtual.textContent = "Observando o algoritmo...";
    refs.questaoStatus.textContent = "";
    refs.questaoOpcoes.innerHTML = "";
    return;
  }

  const q = frame.questao;
  refs.questaoAtual.textContent = q.enunciado;
  refs.questaoStatus.textContent = q.respondida
    ? q.acertou
      ? "✅ Resposta Correta!"
      : "❌ Resposta Incorreta!"
    : "Selecione uma opção:";
  refs.questaoOpcoes.innerHTML = "";

  q.opcoes.forEach((opc, i) => {
    const btn = document.createElement("button");

    btn.className = "opcao";
    btn.textContent = opc;

    if (q.respondida) {
      if (i === q.correta) btn.classList.add("certa");
      else if (i === q.escolha) btn.classList.add("errada");

      btn.disabled = true;
    } else btn.addEventListener("click", () => responder(i));

    refs.questaoOpcoes.appendChild(btn);
  });
}

function responder(idx) {
  const frame = frames[frameAtual];
  const q = frame.questao;

  if (!q || q.respondida) return;

  q.respondida = true;
  q.escolha = idx;
  q.acertou = idx === q.correta;

  logEvento("RESPONDER_QUESTAO", {
    tipo: q.tipo,
    enunciado: q.enunciado,
    escolha: q.opcoes[idx],
    correta: q.opcoes[q.correta],
    acertou: q.acertou,
    explicacao: q.explicacao || "",
  });

  renderQuestao(frame);
  renderHistorico();
}

function renderHistorico() {
  const respostas = Tracker.obterRespostasQuestoes();

  const acertos = respostas.filter((h) => h.detalhes.acertou).length;

  refs.questoesCount.textContent = `Questões: ${acertos} / ${respostas.length}`;
  refs.historico.innerHTML = "";

  [...respostas].reverse().forEach((h) => {
    const div = document.createElement("div");

    div.className = "historicoItem";

    const feedback =
      !h.detalhes.acertou && h.detalhes.explicacao
        ? `<br><small class="historicoFeedback">💡 ${h.detalhes.explicacao}</small>`
        : "";

    div.innerHTML = `<strong>${h.detalhes.acertou ? "✅" : "❌"}</strong> [Frame ${h.frame_idx + 1}]<br><small>Sua resposta: <em>${h.detalhes.escolha}</em> | Correta: <em>${h.detalhes.correta}</em></small>${feedback}`;

    refs.historico.appendChild(div);
  });
}

function renderizar() {
  const frame = frames[frameAtual];
  if (!frame) return;

  const max = Math.max(...vetorAtual, 1);
  refs.frameCount.textContent = `${frameAtual + 1} / ${frames.length}`;
  refs.trocasCount.textContent = frame.trocas || 0;
  refs.comparacoesCount.textContent = frame.comparacoes || 0;

  const barrasExistentes = refs.barras.children;
  const totalAlvo = frame.array.length;

  const alturaMinima = 25;
  const espacoReservadoNumero = 30;
  const paddingVerticalBarras = 20;
  const alturaDisponivel = refs.barras.clientHeight - paddingVerticalBarras;
  const alturaMaxima = Math.max(
    alturaMinima,
    alturaDisponivel - espacoReservadoNumero,
  );

  for (let i = 0; i < totalAlvo; i++) {
    let barra = barrasExistentes[i];
    if (!barra) {
      barra = document.createElement("div");
      barra.className = "barra";
      refs.barras.appendChild(barra);
    }

    const valor = frame.array[i];
    const altura = alturaMinima + (valor / max) * (alturaMaxima - alturaMinima);

    let classeStatus = "normal";
    if (frame.trocando?.includes(i)) classeStatus = "trocando";
    else if (frame.comparando?.includes(i)) classeStatus = "comparando";
    else if (frame.pivo === i) classeStatus = "pivo";
    else if (frame.ordenados?.includes(i)) classeStatus = "ordenado";

    barra.className = `barra ${classeStatus}`;
    barra.style.height = `${altura}px`;
    barra.innerHTML = `<span>${valor}</span>`;

    if (frame.subarray && !frame.subarray.includes(i)) {
      barra.style.opacity = "0.3";
    } else {
      barra.style.opacity = "1";
    }
  }

  while (refs.barras.children.length > totalAlvo) {
    refs.barras.removeChild(refs.barras.lastChild);
  }

  atualizaCodigo(frame);
  renderQuestao(frame);

  refs.botaoAnt.disabled = frameAtual === 0;
  refs.botaoProx.disabled = frameAtual === frames.length - 1;
}

function passoAutoplay() {
  if (frameAtual < frames.length - 1) {
    frameAtual++;
    renderizar();

    if (
      frames[frameAtual]?.questao &&
      !frames[frameAtual].questao.respondida &&
      refs.autoPauseCheck.checked &&
      !refs.questaoSidebar.classList.contains("collapsed")
    ) {
      pausarAutoplay("auto_questao");
    }
  } else {
    pausarAutoplay("fim_execucao");
  }
}

function iniciarAutoplay() {
  if (timer) return;

  if (frameAtual >= frames.length - 1) {
    frameAtual = 0;
    renderizar();
  }

  logEvento("PLAY", { velocidade: velocidadeIntervalo });
  refs.botaoPlay.textContent = "⏸ Pausar";
  timer = setInterval(passoAutoplay, velocidadeIntervalo);
}

function pausarAutoplay(motivo = "usuario") {
  if (timer) {
    logEvento("PAUSE", { motivo });
    clearInterval(timer);
    timer = null;
    refs.botaoPlay.textContent = "▶ Play";
  }
}

function gerarVetorAleatorio(tamanho, min = 1, max = 30) {
  const intervalo = max - min + 1;
  const total = Math.min(tamanho, intervalo);
  const pool = Array.from({ length: intervalo }, (_, i) => min + i);

  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  return pool.slice(0, total);
}

function atualizarVetorDaEntrada() {
  const entrada = refs.inputVetor.value.trim();
  const partes = entrada
    ? entrada.replace(/,/g, " ").split(/\s+/).filter(Boolean)
    : [];

  if (partes.length === 0) {
    vetorAtual = gerarVetorAleatorio(8);
  } else if (partes.length === 1 && /^\d+$/.test(partes[0])) {
    const tamanho = parseInt(partes[0], 10);

    if (tamanho <= 0) {
      alert("Informe um tamanho de vetor válido (maior que 0).");
      return false;
    }

    if (tamanho > 25) {
      alert("O tamanho máximo do vetor é 25 elementos.");
      return false;
    }

    vetorAtual = gerarVetorAleatorio(tamanho);
  } else {
    if (!partes.every((p) => /^\d+$/.test(p))) {
      alert("Insira apenas números inteiros separados por vírgula ou espaço.");
      return false;
    }

    const numeros = partes.map(Number);

    if (numeros.some((n) => n < 1 || n > 30)) {
      alert("Insira apenas números entre 1 e 30.");
      return false;
    }

    if (new Set(numeros).size !== numeros.length) {
      alert("Os números não podem se repetir.");
      return false;
    }

    vetorAtual = numeros;
  }

  return true;
}

function iniciarVisualizacao() {
  frames = gerarFrames();
  frameAtual = 0;

  pausarAutoplay("restart");

  renderizar();
}

function iniciar() {
  if (!atualizarVetorDaEntrada()) return;

  logEvento("GERAR_VETOR", { vetor: vetorAtual.join(",") });

  iniciarVisualizacao();
}

refs.botaoVetor.addEventListener("click", iniciar);
refs.inputVetor.addEventListener("keydown", (e) => {
  if (e.key === "Enter") iniciar();
});

refs.botaoProx.addEventListener("click", () => {
  if (frameAtual < frames.length - 1) {
    logEvento("AVANCAR_FRAME", { metodo: "botao" });
    frameAtual++;
    renderizar();
  }
});
refs.botaoAnt.addEventListener("click", () => {
  if (frameAtual > 0) {
    logEvento("VOLTAR_FRAME", { metodo: "botao" });
    frameAtual--;
    renderizar();
  }
});

refs.botaoPlay.addEventListener("click", () =>
  timer ? pausarAutoplay("usuario") : iniciarAutoplay(),
);

function redefinirVelocidade() {
  refs.velocidadeSlider.value = 1;
  velocidadeIntervalo = 600;
  if (timer) {
    clearInterval(timer);
    timer = setInterval(passoAutoplay, velocidadeIntervalo);
  }
}
redefinirVelocidade();
window.addEventListener("pageshow", (e) => {
  if (e.persisted) redefinirVelocidade();
});

refs.velocidadeSlider.addEventListener("input", (e) => {
  velocidadeIntervalo = 600 / parseFloat(e.target.value);

  if (timer) {
    clearInterval(timer);
    timer = setInterval(passoAutoplay, velocidadeIntervalo);
  }
});

refs.velocidadeSlider.addEventListener("change", (e) => {
  logEvento("MUDAR_VELOCIDADE", {
    multiplicador: parseFloat(e.target.value),
    intervaloMs: velocidadeIntervalo,
  });
});

document.addEventListener("keydown", (e) => {
  const alvo = e.target;
  if (alvo && (alvo.tagName === "INPUT" || alvo.tagName === "TEXTAREA")) return;
  if (document.body.classList.contains("bloqueado")) return;

  if (e.key === "ArrowRight" && frameAtual < frames.length - 1) {
    logEvento("AVANCAR_FRAME", { metodo: "teclado" });
    frameAtual++;
    renderizar();
  }
  if (e.key === "ArrowLeft" && frameAtual > 0) {
    logEvento("VOLTAR_FRAME", { metodo: "teclado" });
    frameAtual--;
    renderizar();
  }
});

refs.toggleSidebar.addEventListener("click", () => {
  refs.questaoSidebar.classList.toggle("collapsed");
  refs.toggleSidebar.textContent = refs.questaoSidebar.classList.contains(
    "collapsed",
  )
    ? "❯"
    : "❮";
  logEvento("TOGGLE_SIDEBAR", {
    collapsed: refs.questaoSidebar.classList.contains("collapsed"),
  });
});

refs.btnModoExplicativo.addEventListener("click", () =>
  aplicarModoCodigo("explicativo"),
);
refs.btnModoPseudo.addEventListener("click", () =>
  aplicarModoCodigo("pseudocodigo"),
);
aplicarModoCodigo(modoCodigo, false);

iniciarVisualizacao();
