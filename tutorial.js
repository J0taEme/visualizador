(function () {
  const CHAVE_CONSENTIMENTO = "tccVisualizador_consentimentoAceito";
  const CHAVE_TUTORIAL = "tccVisualizador_tutorialVisto";

  const overlayConsentimento = document.getElementById("overlayConsentimento");
  const checkConsentimento = document.getElementById("consentimentoCheck");
  const btnConsentimentoOk = document.getElementById("btnConsentimentoOk");

  const overlayTutorial = document.getElementById("overlayTutorial");
  const tutorialSpot = document.getElementById("tutorialSpot");
  const tutorialCaixa = document.getElementById("tutorialCaixa");
  const tutorialTexto = document.getElementById("tutorialTexto");
  const tutorialProgresso = document.getElementById("tutorialProgresso");
  const btnTutorialProx = document.getElementById("btnTutorialProx");
  const btnTutorialPular = document.getElementById("btnTutorialPular");

  const sidebar = document.getElementById("barraQuestoes");
  const toggleSidebarBtn = document.getElementById("barraToggle");

  function abrirConsentimento() {
    overlayConsentimento.classList.add("ativo");
    document.body.classList.add("bloqueado");
  }

  function fecharConsentimento() {
    overlayConsentimento.classList.remove("ativo");
    document.body.classList.remove("bloqueado");
  }

  checkConsentimento.addEventListener("change", () => {
    btnConsentimentoOk.disabled = !checkConsentimento.checked;
  });

  btnConsentimentoOk.addEventListener("click", () => {
    if (!checkConsentimento.checked) return;

    localStorage.setItem(CHAVE_CONSENTIMENTO, "1");
    fecharConsentimento();
    iniciarTutorialSePrimeiraVez();
  });

  let passos = [];
  let passoAtual = 0;
  let sidebarEstavaColapsada = true;

  function definirPassos() {
    passos = [
      {
        alvo: document.querySelector(".barrasPainel"),
        texto:
          "Este é o gráfico de barras: cada barra representa um número do vetor sendo ordenado, e a altura dela mostra o valor. As cores indicam o que está acontecendo em cada momento — veja a legenda no topo do painel (comparando, trocando, ordenado, pivô/mínimo).",
      },
      {
        alvo: document.querySelector(".codigoPainel"),
        texto:
          "Este painel acompanha o algoritmo linha a linha: a linha com ▶ é o passo exato do frame atual e o fundo mais claro marca o trecho em execução. No topo do painel há um botão para alternar a exibição entre o pseudocódigo formal (padrão) e uma descrição em linguagem simples — escolha o que for mais confortável para você.",
      },
      {
        alvo: sidebar,
        texto:
          "Esta é a barra lateral de questões: enquanto o algoritmo roda, perguntas aparecem aqui pra testar seu entendimento, junto com o histórico de acertos e erros. Use o botão redondo na borda pra abrir e fechar quando quiser.",
        aoEntrar: () => {
          sidebarEstavaColapsada = sidebar.classList.contains("collapsed");
          if (sidebarEstavaColapsada) {
            sidebar.style.transition = "none";
            sidebar.classList.remove("collapsed");
            toggleSidebarBtn.textContent = "❮";
            void sidebar.offsetWidth;
            requestAnimationFrame(() => {
              sidebar.style.transition = "";
            });
          }
        },
        aoSair: () => {
          if (sidebarEstavaColapsada) {
            sidebar.classList.add("collapsed");
            toggleSidebarBtn.textContent = "❯";
          }
        },
      },
      {
        alvo: document.getElementById("botoesAlgoritmos"),
        texto:
          "Aqui você escolhe qual algoritmo visualizar: Bubble, Selection, Insertion, Merge ou Quick Sort. Trocar de algoritmo reaproveita o vetor atual — só a forma de ordenar muda.",
      },
      {
        alvo: document.getElementById("grupoInputVetor"),
        texto:
          "E aqui você personaliza o vetor: digite números separados por vírgula ou espaço (ex: 5,3,8,1) para ordenar exatamente esses valores, ou apenas um número para gerar um vetor aleatório com esse tamanho. Deixe em branco e clique em 'Gerar' pra um vetor aleatório de 8 elementos.",
      },
    ];
  }

  function iniciarTutorialSePrimeiraVez() {
    if (localStorage.getItem(CHAVE_TUTORIAL)) return;

    definirPassos();
    passoAtual = 0;

    overlayTutorial.classList.add("ativo");
    document.body.classList.add("bloqueado");

    mostrarPasso(0);
  }

  function mostrarPasso(indice) {
    const passoAnterior = passos[passoAtual];
    if (passoAnterior && passoAnterior.aoSair && indice !== passoAtual) {
      passoAnterior.aoSair();
    }

    passoAtual = indice;
    const passo = passos[passoAtual];

    if (!passo || !passo.alvo) {
      finalizarTutorial();
      return;
    }

    if (passo.aoEntrar) passo.aoEntrar();

    requestAnimationFrame(() => posicionarSpot(passo.alvo));

    tutorialTexto.textContent = passo.texto;
    tutorialProgresso.textContent = `${passoAtual + 1} / ${passos.length}`;
    btnTutorialProx.textContent =
      passoAtual === passos.length - 1 ? "Concluir" : "Próximo ▶";
  }

  function posicionarSpot(alvo) {
    const rect = alvo.getBoundingClientRect();
    const folga = 8;

    tutorialSpot.style.top = `${rect.top - folga}px`;
    tutorialSpot.style.left = `${rect.left - folga}px`;
    tutorialSpot.style.width = `${rect.width + folga * 2}px`;
    tutorialSpot.style.height = `${rect.height + folga * 2}px`;

    const espacoAbaixo = window.innerHeight - rect.bottom;
    const caixaAltura = tutorialCaixa.offsetHeight || 160;
    const ficaEmbaixo = espacoAbaixo > caixaAltura + 24;

    tutorialCaixa.style.top = ficaEmbaixo
      ? `${rect.bottom + 20}px`
      : `${Math.max(16, rect.top - caixaAltura - 20)}px`;

    let esquerda = rect.left + rect.width / 2 - tutorialCaixa.offsetWidth / 2;
    esquerda = Math.min(
      Math.max(16, esquerda),
      window.innerWidth - tutorialCaixa.offsetWidth - 16,
    );
    tutorialCaixa.style.left = `${esquerda}px`;
  }

  function finalizarTutorial() {
    const passo = passos[passoAtual];
    if (passo && passo.aoSair) passo.aoSair();

    overlayTutorial.classList.remove("ativo");
    document.body.classList.remove("bloqueado");
    localStorage.setItem(CHAVE_TUTORIAL, "1");
  }

  btnTutorialProx.addEventListener("click", () => {
    if (passoAtual < passos.length - 1) mostrarPasso(passoAtual + 1);
    else finalizarTutorial();
  });

  btnTutorialPular.addEventListener("click", finalizarTutorial);

  window.addEventListener("resize", () => {
    if (overlayTutorial.classList.contains("ativo") && passos[passoAtual]) {
      posicionarSpot(passos[passoAtual].alvo);
    }
  });

  if (!localStorage.getItem(CHAVE_CONSENTIMENTO)) {
    abrirConsentimento();
  } else {
    iniciarTutorialSePrimeiraVez();
  }
})();
