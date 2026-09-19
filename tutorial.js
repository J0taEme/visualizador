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
  const btnTutorialAnt = document.getElementById("btnTutorialAnt");
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

    sessionStorage.setItem(CHAVE_CONSENTIMENTO, "1");
    fecharConsentimento();
    iniciarTutorialSePrimeiraVez();
  });

  let passos = [];
  let passoAtual = 0;

  function encontrarFrameOrdenadoParcial(lista) {
    for (let i = 0; i < lista.length; i++) {
      const ordenados = lista[i].ordenados ? lista[i].ordenados.length : 0;
      if (ordenados > 0 && ordenados < lista[i].array.length) return i;
    }
    return null;
  }

  function criarSaltoFrame(escolherIndice) {
    let salvo = null;

    return {
      aoEntrar: () => {
        if (typeof frames === "undefined" || !frames.length) return;
        const indice = escolherIndice(frames);
        if (indice === null) return;
        salvo = frameAtual;
        frameAtual = indice;
        if (typeof renderizar === "function") renderizar();
      },
      aoSair: () => {
        if (salvo === null) return;
        frameAtual = salvo;
        salvo = null;
        if (typeof renderizar === "function") renderizar();
      },
    };
  }

  function criarAberturaSidebar() {
    let estavaColapsada = true;

    return {
      aoEntrar: () => {
        estavaColapsada = sidebar.classList.contains("collapsed");
        if (estavaColapsada) {
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
        if (estavaColapsada) {
          sidebar.classList.add("collapsed");
          toggleSidebarBtn.textContent = "❯";
        }
      },
    };
  }

  function definirPassos() {
    passos = [
      {
        alvo: document.querySelector(".barrasPainel"),
        texto:
          "Cada barra representa um número do vetor. A altura é baseada no valor, e sua cor muda de acordo com o que está acontecendo com aquele elemento no momento.",
      },
      {
        alvo: document.querySelector(".barrasLegenda"),
        texto:
          "Esta é a legenda de cores: Normal (estado padrão), Comparando (sendo avaliado), Trocando (troca de posição em andamento), Ordenado (já está em sua posição final) e Pivô/Mín. (elemento de referência do algoritmo, sendo o pivô do Quick Sort ou o menor provisório do Selection Sort).",
      },
      {
        alvo: document.getElementById("barras"),
        texto:
          "Barras que estão verdes já alcançaram a sua posição final de ordenação e não serão mais afetadas pelo algoritmo. Em alguns algoritmos, como o Merge Sort, isso só acontece no fim da execução.",
        ...criarSaltoFrame(encontrarFrameOrdenadoParcial),
      },
      {
        alvo: document.getElementById("barras"),
        texto:
          "As barras que ainda não estão verdes formam a parte ativa do algoritmo, ou seja, a região ainda não ordenada.",
        ...criarSaltoFrame(encontrarFrameOrdenadoParcial),
      },
      {
        alvo: document.querySelector(".codigoPainel"),
        texto:
          "O pseudocódigo acompanha o algoritmo linha a linha, no qual a seta ▶ marca o passo atual. Prefere uma versão em português simples? Troque para o modo 'Explicação'.",
      },
      {
        alvo: document.querySelector(".controlesPainel"),
        texto:
          "Use 'Próximo Passo' e 'Passo Anterior' para avançar e voltar um passo por vez, ou 'Play' para a execução automática. O controle de velocidade ajusta o ritmo do Play — você pode mudá-lo a qualquer momento.",
      },
      {
        alvo: sidebar,
        texto:
          "Aqui é a barra lateral, na qual aparecem perguntas para testar seu entendimento, junto com o histórico de respostas. Use o botão redondo na borda para abrir e fechar.",
        ...criarAberturaSidebar(),
      },
      {
        alvo: document.querySelector(".autoPauseLabel"),
        texto:
          "Quando marcado, pausa o autoplay sempre que surge uma nova questão, dando tempo para responder.",
        ...criarAberturaSidebar(),
      },
      {
        alvo: document.getElementById("botoesAlgoritmos"),
        texto:
          "Escolha o algoritmo que deseja ver em execução por meio desses botões. Passe o mouse sobre um botão para ver uma explicação rápida sobre o algoritmo.",
      },
      {
        alvo: document.getElementById("grupoInputVetor"),
        texto: `Deixe o campo em branco e clique em "Gerar" para criar um vetor aleatório de 12 elementos, que é o recomendado para esta pesquisa.

Se preferir, digite apenas um número para gerar um vetor aleatório daquele tamanho, até 25 elementos. Ou digite os valores que quiser, separados por vírgula ou espaço, como em "5,3,8,1,9,2,7,4" — valores de 0 a 30, sem repetir.`,
      },
      {
        centro: true,
        texto: `Para esta pesquisa, siga este roteiro:

Antes de começar, clique em "Copiar ID" no topo e guarde o código — ele será pedido no formulário.

Gere um vetor de 12 elementos e percorra o passo a passo completo dos cinco algoritmos nesta ordem: Bubble, Merge, Selection, Quick e Insertion. Em cada um, avance até o vetor ficar completamente ordenado antes de trocar de algoritmo.

Mantenha "Pausar a receber questão" ativo e responda todas as questões que aparecerem.

Ao terminar os cinco, clique em "Acessar Formulário" no topo e informe o código que você copiou.

Faça tudo de uma vez, na mesma aba, para que seu código não mude. Depois de enviar o formulário, fique à vontade para explorar a plataforma como quiser.`,
      },
    ];
  }

  function iniciarTutorialSePrimeiraVez() {
    if (sessionStorage.getItem(CHAVE_TUTORIAL)) return;

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

    if (!passo) {
      finalizarTutorial();
      return;
    }

    if (passo.aoEntrar) passo.aoEntrar();

    tutorialCaixa.classList.toggle("tutorialFinal", !!passo.centro);

    if (passo.centro || !passo.alvo) {
      requestAnimationFrame(posicionarCentro);
    } else {
      requestAnimationFrame(() => posicionarSpot(passo.alvo));
    }

    tutorialTexto.textContent = passo.texto;
    tutorialProgresso.textContent = `${passoAtual + 1} / ${passos.length}`;
    btnTutorialAnt.disabled = passoAtual === 0;
    btnTutorialProx.textContent =
      passoAtual === passos.length - 1 ? "Concluir" : "Prox ▶";
  }

  function posicionarSpot(alvo) {
    tutorialSpot.classList.remove("semDestaque");
    tutorialCaixa.style.transform = "";

    const rect = alvo.getBoundingClientRect();
    const folga = 8;

    tutorialSpot.style.top = `${rect.top - folga}px`;
    tutorialSpot.style.left = `${rect.left - folga}px`;
    tutorialSpot.style.width = `${rect.width + folga * 2}px`;
    tutorialSpot.style.height = `${rect.height + folga * 2}px`;

    const caixaAltura = tutorialCaixa.offsetHeight || 160;
    const caixaLargura = tutorialCaixa.offsetWidth || 320;
    const margem = 20;

    const espacoAbaixo = window.innerHeight - rect.bottom;
    const espacoAcima = rect.top;
    const espacoDireita = window.innerWidth - rect.right;
    const espacoEsquerda = rect.left;

    let top, left;

    if (espacoAbaixo > caixaAltura + margem) {
      top = rect.bottom + margem;
      left = rect.left + rect.width / 2 - caixaLargura / 2;
    } else if (espacoAcima > caixaAltura + margem) {
      top = rect.top - caixaAltura - margem;
      left = rect.left + rect.width / 2 - caixaLargura / 2;
    } else if (espacoDireita > caixaLargura + margem) {
      top = rect.top + rect.height / 2 - caixaAltura / 2;
      left = rect.right + margem;
    } else if (espacoEsquerda > caixaLargura + margem) {
      top = rect.top + rect.height / 2 - caixaAltura / 2;
      left = rect.left - caixaLargura - margem;
    } else {
      top = rect.bottom + margem;
      left = rect.left + rect.width / 2 - caixaLargura / 2;
    }

    top = Math.min(Math.max(16, top), window.innerHeight - caixaAltura - 16);
    left = Math.min(Math.max(16, left), window.innerWidth - caixaLargura - 16);

    tutorialCaixa.style.top = `${top}px`;
    tutorialCaixa.style.left = `${left}px`;
  }

  function posicionarCentro() {
    tutorialSpot.classList.add("semDestaque");
    tutorialSpot.style.top = "50%";
    tutorialSpot.style.left = "50%";
    tutorialSpot.style.width = "0px";
    tutorialSpot.style.height = "0px";

    tutorialCaixa.style.top = "50%";
    tutorialCaixa.style.left = "50%";
    tutorialCaixa.style.transform = "translate(-50%, -50%)";
  }

  function finalizarTutorial() {
    const passo = passos[passoAtual];
    if (passo && passo.aoSair) passo.aoSair();

    overlayTutorial.classList.remove("ativo");
    document.body.classList.remove("bloqueado");
    sessionStorage.setItem(CHAVE_TUTORIAL, "1");
  }

  btnTutorialProx.addEventListener("click", () => {
    if (passoAtual < passos.length - 1) mostrarPasso(passoAtual + 1);
    else finalizarTutorial();
  });

  btnTutorialAnt.addEventListener("click", () => {
    if (passoAtual > 0) mostrarPasso(passoAtual - 1);
  });

  btnTutorialPular.addEventListener("click", finalizarTutorial);

  window.addEventListener("resize", () => {
    if (!overlayTutorial.classList.contains("ativo")) return;
    const passo = passos[passoAtual];
    if (!passo) return;

    if (passo.centro || !passo.alvo) posicionarCentro();
    else posicionarSpot(passo.alvo);
  });

  if (!sessionStorage.getItem(CHAVE_CONSENTIMENTO)) {
    abrirConsentimento();
  } else {
    iniciarTutorialSePrimeiraVez();
  }
})();
