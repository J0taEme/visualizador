const codigos = {
    bubble: { titulo: "BUBBLESORT(A)", linhas: [ { linha: 1, texto: "PARA i = 1 ATÉ tamanho - 1" }, { linha: 2, texto: "  PARA j = 1 ATÉ tamanho - i" }, { linha: 3, texto: "    SE A[j] > A[j+1]" }, { linha: 4, texto: "      TROCAR j com j+1" } ] },
    selection: { titulo: "SELECTION-SORT(A)", linhas: [ { linha: 1, texto: "PARA i = 1 ATÉ tamanho - 1" }, { linha: 2, texto: "  menor = i" }, { linha: 3, texto: "  PARA j = i+1 ATÉ tamanho" }, { linha: 4, texto: "    SE A[j] < A[menor]" }, { linha: 5, texto: "      menor = j" }, { linha: 6, texto: "  TROCAR i com menor" } ] },
    insertion: { titulo: "INSERTION-SORT(A)", linhas: [ { linha: 1, texto: "PARA j = 2 ATÉ tamanho" }, { linha: 2, texto: "  chave = A[j]" }, { linha: 3, texto: "  i = j - 1" }, { linha: 4, texto: "  ENQUANTO i >= 0 E A[i] > chave" }, { linha: 5, texto: "    A[i+1] = A[i]" }, { linha: 6, texto: "    i = i - 1" }, { linha: 7, texto: "  A[i+1] = chave" } ] },
    merge: { titulo: "MERGE-SORT / MERGE", linhas: [ { tipo: "titulo", texto: "MERGE-SORT(A, p, r)" }, { linha: 1, texto: "SE p < r" }, { linha: 2, texto: "  q = (p + r) / 2" }, { linha: 3, texto: "  MERGE-SORT(A, p, q)" }, { linha: 4, texto: "  MERGE-SORT(A, q+1, r)" }, { linha: 5, texto: "  MESCLAR(A, p, q, r)" }, { tipo: "espaco" }, { tipo: "titulo", texto: "MESCLAR(A, p, q, r)" }, { linha: 6, texto: "n1 = q - p + 1" }, { linha: 7, texto: "n2 = r - q" }, { linha: 8, texto: "CRIAR L[0..n1], R[0..n2]" }, { linha: 9, texto: "COPIAR A[p..q] → L" }, { linha: 10, texto: "COPIAR A[q+1..r] → R" }, { linha: 11, texto: "i = 0, j = 0" }, { linha: 12, texto: "PARA k = p ATÉ r" }, { linha: 13, texto: "  SE L[i] <= R[j]" }, { linha: 14, texto: "    A[k] = L[i]; i++" }, { linha: 15, texto: "  SENÃO" }, { linha: 16, texto: "    A[k] = R[j]; j++" } ] },
    quick: { titulo: "QUICKSORT / PARTICAO", linhas: [ { tipo: "titulo", texto: "QUICKSORT(A, p, r)" }, { linha: 1, texto: "SE p < r" }, { linha: 2, texto: "  SE p == r" }, { linha: 3, texto: "    ELEMENTO já ordenado" }, { linha: 4, texto: "  q = PARTICAO(A, p, r)" }, { linha: 5, texto: "  QUICKSORT(A, p, q-1)" }, { linha: 6, texto: "  QUICKSORT(A, q+1, r)" }, { tipo: "espaco" }, { tipo: "titulo", texto: "PARTICAO(A, p, r)" }, { linha: 7, texto: "pivo = A[r]" }, { linha: 8, texto: "i = p - 1" }, { linha: 9, texto: "PARA j = p ATÉ r-1" }, { linha: 10, texto: "  SE A[j] <= pivo" }, { linha: 11, texto: "    i = i + 1" }, { linha: 12, texto: "    TROCAR A[i] com A[j]" }, { linha: 13, texto: "TROCAR A[i+1] com A[r]" }, { linha: 14, texto: "RETORNAR i + 1" } ] }
};

const $ = id => document.getElementById(id);

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
    velocidadeSlider: $("velocidadeSlider")
};

const botoesAlgoritmos = document.querySelectorAll("#botoesAlgoritmos button");

let vetorAtual = [5, 3, 8, 1, 9, 2, 7, 4];
let frames = [], frameAtual = 0, timer = null, velocidadeIntervalo = 600;
let questaoAtiva = null;

const algoritmoAtual = () => document.querySelector("#botoesAlgoritmos button.active").getAttribute("alg");

function logEvento(acao, detalhes = {}) {
    Tracker.registrar(acao, algoritmoAtual(), frameAtual, detalhes);
}

botoesAlgoritmos.forEach(btn => btn.addEventListener("click", e => {
    if (e.target.classList.contains("active")){
        return;
    }

    botoesAlgoritmos.forEach(b => b.classList.remove("active"));

    e.target.classList.add("active");

    logEvento("MUDAR_ALGORITMO", { novo_algoritmo: algoritmoAtual() });

    iniciarVisualizacao();
}));

function gerarFrames() {
    const key = algoritmoAtual();
    const sorts = { bubble: BubbleSort, selection: SelectionSort, insertion: InsertionSort, merge: MergeSort, quick: QuickSort };
    
    return new sorts[key](vetorAtual).gerarFrames();
}

function atualizaCodigo(frame){
    const codigo = codigos[algoritmoAtual()];
    refs.codigoCabecalho.textContent = codigo.titulo;
    refs.codigoRef.innerHTML = "";

    codigo.linhas.forEach((item) => {
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

        if (linha !== null && (frame.linhaSeta === linha || (frame.linhasAtivas && frame.linhasAtivas.includes(linha)))) {
            div.classList.add("active");
        }

        refs.codigoRef.appendChild(div);
    });
}

function renderQuestao(frame){
    if(!frame.questao || frame.questao.fechada){
        refs.questaoAtual.textContent = "Observando o algoritmo...";
        refs.questaoStatus.textContent = "";
        refs.questaoOpcoes.innerHTML = "";

        questaoAtiva = null;
        return;
    }

    const q = frame.questao;
    questaoAtiva = q;
    refs.questaoAtual.textContent = q.enunciado;
    refs.questaoStatus.textContent = q.respondida ? (q.acertou ? "✅ Resposta Correta!" : "❌ Resposta Incorreta!") : "Selecione uma opção:";
    refs.questaoOpcoes.innerHTML = "";

    q.opcoes.forEach((opc, i) => {
        const btn = document.createElement("button");
        
        btn.className = "opcao";
        btn.textContent = opc;

        if(q.respondida){
            if (i === q.correta) btn.classList.add("certa");
            else if (i === q.escolha) btn.classList.add("errada");
            
            btn.disabled = true;
        }else btn.addEventListener("click", () => responder(i));

        refs.questaoOpcoes.appendChild(btn)
    });
}

function responder(idx){
    const frame = frames[frameAtual]
    const q = frame.questao;

    if(!q || q.respondida) return;

    q.respondida = true;
    q.escolha = idx;
    q.acertou = idx === q.correta;

    logEvento("RESPONDER_QUESTAO", {
        tipo: q.tipo,
        enunciado: q.enunciado,
        escolha: q.opcoes[idx],
        correta: q.opcoes[q.correta],
        acertou: q.acertou
    });

    renderQuestao(frame);
    renderHistorico();
}

function renderHistorico(){
    const respostas = Tracker.obterRespostasQuestoes();
    
    const acertos = respostas.filter(h => h.detalhes.acertou).length;
    
    refs.questoesCount.textContent = `Questões: ${acertos} / ${respostas.length}`;
    refs.historico.innerHTML = "";

    [...respostas].reverse().forEach( h => {
        const div = document.createElement("div");

        div.className = "historicoItem";
        div.innerHTML = `<strong> ${h.detalhes.acertou ? "✅" : "❌"}<strong> [Frame ${h.frameIdx}]<br><small>Sua resposta: <em>${h.detalhes.escolha}</em> | Correta: <em>${h.detalhes.correta}</em></small>`;
        
        refs.historico.appendChild(div);
    });
}

function renderizar(){
    const frame = frames[frameAtual];
    if(!frame) return;

    const max = Math.max(...vetorAtual,1);
    refs.frameCount.textContent = `${frameAtual + 1} / ${frames.length}`;
    refs.trocasCount.textContent = frame.trocas || 0;
    refs.comparacoesCount.textContent = frame.comparacoes || 0;

    const barrasExistentes = refs.barras.children;
    const totalAlvo = frame.array.length;
    const alturaMinima = 25;
    const espacoReservadoNumero = 30;
    const paddingVerticalBarras = 20;
    const alturaDisponivel = refs.barras.clientHeight - paddingVerticalBarras;
    const alturaMaxima = Math.max(alturaMinima, alturaDisponivel - espacoReservadoNumero);

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
        if(frame.trocando?.includes(i)) classeStatus = "trocando";
        else if(frame.comparando?.includes(i)) classeStatus = "comparando";
        else if(frame.pivo === i) classeStatus = "pivo";
        else if(frame.ordenados?.includes(i)) classeStatus = "ordenado";

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

function iniciarAutoplay(){
    if(!timer){
        logEvento("PLAY", {velocidade: velocidadeIntervalo});
        refs.botaoPlay.textContent = "⏸ Pausar";

        timer = setInterval(() => {
            if(frameAtual < frames.length - 1){
                frameAtual++;
                renderizar();

                if(frames[frameAtual]?.questao && !frames[frameAtual].questao.respondida && refs.autoPauseCheck.checked){
                    pausarAutoplay("autoQuestao");
                }
            } else pausarAutoplay("fimExecucao");
        }, velocidadeIntervalo);
    }
}

function pausarAutoplay(motivo = "usuario"){
    if(timer){
        logEvento("PAUSE", {motivo});
        clearInterval(timer);
        timer = null;
        refs.botaoPlay.textContent = "▶ Play"; 
    }
}

function gerarVetorAleatorio(tamanho, min = 1, max = 50) {
  const intervalo = max - min + 1;
  const total = Math.min(tamanho, intervalo);
  const pool = Array.from({ length: intervalo }, (_, i) => min + i);

  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  return pool.slice(0, total);
}

function atualizarVetorDaEntrada(){
    const entrada = refs.inputVetor.value.trim();
    const partes = entrada ? entrada.replace(/,/g, ' ').split(/\s+/).filter(Boolean) : [];

    if(partes.length === 0){
        vetorAtual = gerarVetorAleatorio(8);
    }
    else if(partes.length === 1 && /^\d+$/.test(partes[0])){
        const tamanho = parseInt(partes[0], 10);

        if (tamanho <= 0) {
            alert('Informe um tamanho de vetor válido (maior que 0).');
            return false;
        }

        if (tamanho > 25) {
            alert('O tamanho máximo do vetor é 50 (valores entre 1 e 50, sem repetição).');
            return false;
        }

        vetorAtual = gerarVetorAleatorio(tamanho);
    }
    else {
        if (!partes.every(p => /^\d+$/.test(p))) {
            alert('Insira apenas números inteiros separados por vírgula ou espaço.');
            return false;
        }

        const numeros = partes.map(Number);

        if (numeros.some(n => n < 1 || n > 25)) {
            alert('Insira apenas números entre 1 e 50.');
            return false;
        }

        if (new Set(numeros).size !== numeros.length) {
            alert('Os números não podem se repetir.');
            return false;
        }

        vetorAtual = numeros;
    }

    return true;
}

function iniciarVisualizacao(){
    frames = gerarFrames();
    frameAtual = 0;
  
    pausarAutoplay('restart');
  
    renderizar();
}

function iniciar(){
    if (!atualizarVetorDaEntrada()) return;

    logEvento('GERAR_VETOR', { vetor: vetorAtual.join(',') });

    iniciarVisualizacao();
}

refs.botaoVetor.addEventListener("click", iniciar);
refs.inputVetor.addEventListener("keydown", e => {if (e.key === "Enter") iniciar(); });

refs.botaoProx.addEventListener("click", () =>{
    if(frameAtual < frames.length - 1) {
        logEvento("AVANCAR_FRAME", { metodo:"botao"});
        frameAtual++;
        renderizar();
    }
});
refs.botaoAnt.addEventListener("click", () =>{
    if(frameAtual > 0) {
        logEvento("VOLTAR_FRAME", { metodo:"botao"});
        frameAtual--;
        renderizar();
    }
})

refs.botaoPlay.addEventListener("click", () => timer ? pausarAutoplay("usuario") : iniciarAutoplay());

refs.velocidadeSlider.addEventListener("input", e => {
    velocidadeIntervalo = 600 / parseFloat(e.target.value);

    if(timer){
        clearInterval(timer);
        timer = setInterval(() => {
            if(frameAtual < frames.length - 1){
                frameAtual++;
                renderizar();

                if(frames[frameAtual]?.questao && !frames[frameAtual].questao.respondida && refs.autoPauseCheck.checked){
                    pausarAutoplay("auto_questao");
                }
            }else{
                pausarAutoplay("fim_execucao");
            }
        }, velocidadeIntervalo);
    }
});

refs.velocidadeSlider.addEventListener("change", e =>{ 
    logEvento("MUDAR_VELOCIDADE", {multiplicador: parseFloat(e.target.value), intervaloMs: velocidadeIntervalo});
});

document.addEventListener("keydown", e => {
    if (e.key === "ArrowRight" && frameAtual < frames.length - 1) { 
        logEvento("AVANCAR_FRAME", {metodo: "teclado"});
        frameAtual++; renderizar(); 
    }
    if (e.key === "ArrowLeft" && frameAtual > 0) { 
        logEvento("VOLTAR_FRAME", {metodo: "teclado"});
        frameAtual--; renderizar(); 
    }
});

refs.toggleSidebar.addEventListener("click", () =>{
    refs.questaoSidebar.classList.toggle("collapsed");
    refs.toggleSidebar.textContent = refs.questaoSidebar.classList.contains("collapsed") ? "❯" : "❮";
    logEvento("TOGGLE_SIDEBAR", {collapsed: refs.questaoSidebar.classList.contains("collapsed") });
});


iniciarVisualizacao();
