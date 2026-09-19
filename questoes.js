function makeQuest(extra) {
  return Object.assign(
    {
      tipo: "dinamica",
      enunciado: "",
      opcoes: [],
      correta: 0,
      explicacao: "",
      respondida: false,
      fechada: false,
      escolha: null,
      acertou: null,
    },
    extra,
  );
}

function hashArray(arr) {
  const str = Array.isArray(arr) ? arr.join("") : String(arr);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function embaralhar(arr, seed) {
  const a = [...arr];
  if (seed === undefined) {
    seed = Math.floor(Math.random() * 100000);
  }
  let s = seed;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 16807 + 0) % 2147483647;
    const j = s % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function gerarSeed(arr, offset) {
  if (offset === undefined) offset = 0;
  return hashArray(arr) + offset * 31;
}

function distratoresNumericos(correta, candidatos) {
  const unicos = [];
  candidatos.forEach((c) => {
    if (c >= 0 && c !== correta && !unicos.includes(c)) unicos.push(c);
  });
  let extra = correta + 1;
  while (unicos.length < 3) {
    if (extra !== correta && !unicos.includes(extra)) unicos.push(extra);
    extra++;
  }
  return unicos.slice(0, 3);
}

function Q_PredicaoTroca(v1, v2, seed) {
  const s = gerarSeed([v1, v2], seed);
  const troca = v1 > v2;
  const correta = troca
    ? `Haverá troca, pois ${v1} é maior que ${v2}.`
    : `Não haverá troca, pois já estão na ordem certa.`;

  const opcoes = embaralhar(
    [
      `Haverá troca, pois ${v1} é maior que ${v2}.`,
      `Não haverá troca, pois já estão na ordem certa.`,
      `Não haverá troca, pois ${v1} é maior — e maiores ficam à frente.`,
      `Haverá troca, pois o algoritmo troca a cada comparação feita.`,
    ],
    s,
  );

  const q = makeQuest({
    tipo: "predicao",
    enunciado: `Avaliando as barras destacadas (${v1} e ${v2}), o que acontecerá com elas neste exato momento?`,
    opcoes: opcoes,
    explicacao: troca
      ? `${v1} é maior que ${v2}: como o algoritmo mantém o menor à esquerda, as duas barras trocam de lugar.`
      : `${v1} não é maior que ${v2}: as barras já estão em ordem, então nenhuma troca acontece.`,
  });

  q.correta = opcoes.indexOf(correta);

  return q;
}

const VARIACOES_SELECTION = [
  (m, a) =>
    `O menor valor provisório registrado é ${m}. Ao compará-lo com a barra atual (${a}), o título de "menor valor" vai mudar?`,
  (m, a) =>
    `Até aqui o menor da rodada é ${m}. A barra atual vale ${a}: o mínimo provisório será substituído?`,
  (m, a) =>
    `O algoritmo guarda ${m} como menor valor desta rodada e agora examina a barra ${a}. Haverá troca de mínimo?`,
  (m, a) =>
    `Comparando o mínimo provisório (${m}) com a barra em análise (${a}), o algoritmo passa a guardar outro valor?`,
];

function Q_SelectionMin(minAtual, avaliado, seed, variacaoIdx = 0) {
  const s = gerarSeed([minAtual, avaliado], seed);
  const trocaMin = avaliado < minAtual;
  const correta = trocaMin
    ? `Sim, ${avaliado} passará a ser o novo menor.`
    : `Não, ${minAtual} continua sendo o menor provisório.`;

  const opcoes = embaralhar(
    [
      `Sim, ${avaliado} passará a ser o novo menor.`,
      `Não, ${minAtual} continua sendo o menor provisório.`,
      `Sim, pois todo elemento analisado substitui o menor provisório.`,
      `Não, pois o menor provisório só pode mudar no fim da rodada.`,
    ],
    s,
  );

  const q = makeQuest({
    tipo: "analise",
    enunciado: VARIACOES_SELECTION[variacaoIdx % VARIACOES_SELECTION.length](
      minAtual,
      avaliado,
    ),
    opcoes: opcoes,
    explicacao: trocaMin
      ? `${avaliado} é menor que o mínimo provisório ${minAtual}, então ${avaliado} assume o lugar de menor.`
      : `${avaliado} não é menor que ${minAtual}, então o mínimo provisório continua sendo ${minAtual}.`,
  });

  q.correta = opcoes.indexOf(correta);
  return q;
}

function Q_MergeDesce(vEsq, vDir, seed) {
  const s = gerarSeed([vEsq, vDir], seed);
  const desceV1 = vEsq <= vDir;
  const correta = desceV1
    ? `O valor ${vEsq}, por ser menor ou igual.`
    : `O valor ${vDir}, por ser estritamente menor.`;

  const opcoes = embaralhar(
    [
      `O valor ${vEsq}, por ser menor ou igual.`,
      `O valor ${vDir}, por ser estritamente menor.`,
      `O valor ${vEsq}, pois o lado esquerdo sempre tem prioridade.`,
      `O valor ${vDir}, pois o lado direito sempre tem prioridade.`,
    ],
    s,
  );

  const q = makeQuest({
    tipo: "predicao",
    enunciado: `Fase de Intercalação (Merge): Comparando as barras ${vEsq} (esquerda) e ${vDir} (direita), qual das duas descerá agora para ocupar a próxima posição no vetor principal?`,
    opcoes: opcoes,
    explicacao: desceV1
      ? `Na intercalação desce o menor entre os primeiros de cada metade (empate vai para a esquerda): ${vEsq} ≤ ${vDir}, então desce ${vEsq}.`
      : `Na intercalação desce o menor entre os primeiros de cada metade: ${vDir} < ${vEsq}, então desce ${vDir}.`,
  });

  q.correta = opcoes.indexOf(correta);

  return q;
}

function Q_QuickPivo(pivo, atual, seed) {
  const s = gerarSeed([pivo, atual], seed);
  const menor = atual <= pivo;
  const correta = menor
    ? `Ficará à esquerda, pois ${atual} <= Pivô (${pivo}).`
    : `Ficará à direita, pois ${atual} > Pivô (${pivo}).`;

  const opcoes = embaralhar(
    [
      `Ficará à esquerda, pois ${atual} <= Pivô (${pivo}).`,
      `Ficará à direita, pois ${atual} > Pivô (${pivo}).`,
      `Ficará à esquerda, pois valores menores sempre vão primeiro.`,
      `Ficará à direita, pois o algoritmo processa da direita para a esquerda.`,
    ],
    s,
  );

  const q = makeQuest({
    tipo: "analise",
    enunciado: `O valor atual é ${atual} e o Pivô é ${pivo}. Qual será o destino de ${atual} neste particionamento?`,
    opcoes: opcoes,
    explicacao: menor
      ? `Na partição, valores menores ou iguais ao pivô vão para a esquerda: ${atual} ≤ ${pivo}, então ${atual} fica à esquerda.`
      : `Na partição, valores maiores que o pivô ficam à direita: ${atual} > ${pivo}, então ${atual} fica à direita.`,
  });

  q.correta = opcoes.indexOf(correta);

  return q;
}

const VARIACOES_METRICA = [
  (t) =>
    `Sem olhar o placar no topo da tela: quantas ${t} o algoritmo já realizou até aqui?`,
  (t) =>
    `Acompanhando a execução desde o início, qual é o total de ${t} neste ponto?`,
  (t) =>
    `Cubra o contador e responda de memória: quantas ${t} já aconteceram até este frame?`,
  (t) =>
    `Somando tudo o que o algoritmo fez desde o primeiro passo, quantas ${t} foram feitas?`,
];

function Q_Contagem(
  tipo,
  valorAtual,
  seed,
  vetorInicial = null,
  variacaoIdx = 0,
) {
  const s = gerarSeed(
    [tipo, valorAtual, vetorInicial ? vetorInicial.join(",") : "sem_vetor"],
    seed,
  );
  const distratores = distratoresNumericos(valorAtual, [
    valorAtual - 1,
    valorAtual + 1,
    valorAtual + 2,
    valorAtual + 3,
    valorAtual - 2,
  ]);
  const correta = String(valorAtual);
  const opcoes = embaralhar(
    [
      correta,
      String(distratores[0]),
      String(distratores[1]),
      String(distratores[2]),
    ],
    s,
  );

  const vetorStr = vetorInicial
    ? `Vetor inicial: [${vetorInicial.join(", ")}]. `
    : "";

  const q = makeQuest({
    tipo: "metrica",
    enunciado: `Análise de Métricas: ${vetorStr}${VARIACOES_METRICA[variacaoIdx % VARIACOES_METRICA.length](tipo)}`,
    opcoes: opcoes,
    explicacao: `O contador de ${tipo}, no topo da tela, marcava ${valorAtual} neste frame — é o total acumulado desde o início.`,
  });

  q.correta = opcoes.indexOf(correta);

  return q;
}

function Q_InsertionDeslocamentos(seed, dados) {
  const s = gerarSeed(
    ["insertion_desl", dados.array.slice(0, dados.j + 1)],
    seed,
  );
  const atual = dados.array[dados.j];
  let deslocamentos = 0;
  for (let k = dados.j - 1; k >= 0; k--) {
    if (dados.array[k] > atual) deslocamentos++;
    else break;
  }
  const distratores = distratoresNumericos(deslocamentos, [
    deslocamentos + 1,
    deslocamentos - 1,
    deslocamentos + 2,
    dados.j,
    0,
  ]);
  const correta = String(deslocamentos);
  const opcoes = embaralhar(
    [
      correta,
      String(distratores[0]),
      String(distratores[1]),
      String(distratores[2]),
    ],
    s,
  );

  const q = makeQuest({
    tipo: "analise",
    enunciado: `Insertion Sort: A barra destacada (valor ${atual}) acabou de ser comparada com a barra imediatamente à sua esquerda na tela (índice menor). Cada vez que o vizinho da esquerda for maior que ${atual}, esse vizinho se desloca uma posição para a direita (índice maior) para abrir espaço. Quantos desses deslocamentos para a direita acontecerão até ${atual} encontrar sua posição correta?`,
    opcoes: opcoes,
    explicacao: `Contando da barra ${atual} para a esquerda, ${deslocamentos} vizinho(s) são maiores que ${atual} (o seguinte já é menor ou igual), logo ${deslocamentos} deslocamento(s).`,
  });

  q.correta = opcoes.indexOf(correta);

  return q;
}

const VARIACOES_INVARIANTE = [
  "Sobre as barras que já ocupam posição definitiva neste momento, o que é correto afirmar?",
  "Neste ponto da execução, onde estão as barras cuja posição já não muda mais?",
  "Observando o vetor agora, qual afirmação descreve corretamente as posições já garantidas?",
  "Considerando o que o algoritmo já processou, o que se pode garantir sobre as posições finais?",
];

function Q_JaFixadas(padrao, k, nomeAlg, seed, variacaoIdx = 0) {
  const s = gerarSeed(["ja_fixadas", padrao, k, nomeAlg], seed);

  const OPC = {
    esquerda:
      "As barras já fixas ficam todas à esquerda (nas primeiras posições).",
    direita: "As barras já fixas ficam todas à direita (nas últimas posições).",
    espalhado:
      "As barras já fixas ficam espalhadas pelo vetor, não agrupadas num lado.",
    nenhum:
      "Nenhuma ainda tem posição final garantida — o que já parece ordenado pode se mover.",
  };
  const correta = OPC[padrao];
  const opcoes = embaralhar(
    [OPC.esquerda, OPC.direita, OPC.espalhado, OPC.nenhum],
    s,
  );

  const EXPL = {
    esquerda: `O ${nomeAlg} pega o menor valor a cada rodada e o fixa da esquerda para a direita, então a região garantida cresce por esse lado.`,
    direita: `Cada passagem do ${nomeAlg} leva o maior valor restante até o fim, então a região garantida cresce pela direita.`,
    espalhado: `No ${nomeAlg}, cada pivô já processado foi direto para o lugar definitivo dele — e esses lugares ficam espalhados pelo vetor.`,
    nenhum: `No ${nomeAlg}, a parte que parece ordenada está ordenada apenas entre si; um valor menor que chegar depois ainda empurra essas barras. Nada é definitivo antes do fim.`,
  };

  const contagem =
    k > 0
      ? `Até agora ${k} barra(s) já foram colocadas na posição final. `
      : "";
  const variacao =
    VARIACOES_INVARIANTE[(variacaoIdx + k) % VARIACOES_INVARIANTE.length];

  const q = makeQuest({
    tipo: "invariante",
    enunciado: `${contagem}${variacao}`,
    opcoes: opcoes,
    explicacao: EXPL[padrao],
  });

  q.correta = opcoes.indexOf(correta);
  return q;
}

function Q_PorQueNaoTrocou(esqVal, dirVal, seed) {
  const s = gerarSeed(["nao_trocou", esqVal, dirVal], seed);

  const correta = `Porque ${esqVal} não é maior que ${dirVal}: elas já estão na ordem certa.`;
  const opcoes = embaralhar(
    [
      correta,
      `Porque ${esqVal} é maior que ${dirVal}, e valores maiores não se movem.`,
      `Porque uma das duas já está na posição final definitiva.`,
      `Porque o algoritmo só realiza uma troca a cada duas comparações.`,
    ],
    s,
  );

  const q = makeQuest({
    tipo: "retrospectiva",
    enunciado: `As barras destacadas (${esqVal} à esquerda e ${dirVal} à direita) foram comparadas, mas NÃO trocaram de lugar. Por quê?`,
    opcoes: opcoes,
    explicacao: `A troca (ou o deslocamento) só acontece quando o valor da esquerda é maior que o da direita. Como ${esqVal} ≤ ${dirVal}, as duas já estão em ordem e ficam onde estão.`,
  });

  q.correta = opcoes.indexOf(correta);
  return q;
}

function Q_ComparacoesRodada(tamTrecho, unidade, seed) {
  const s = gerarSeed(["comp_rodada", tamTrecho, unidade], seed);

  const correta = tamTrecho - 1;
  const distratores = distratoresNumericos(correta, [
    tamTrecho,
    correta - 1,
    correta + 1,
    Math.max(1, Math.floor(tamTrecho / 2)),
  ]);
  const opcoes = embaralhar(
    [
      String(correta),
      String(distratores[0]),
      String(distratores[1]),
      String(distratores[2]),
    ],
    s,
  );

  const q = makeQuest({
    tipo: "contagem",
    enunciado: `O trecho ativo tem ${tamTrecho} barras. Quantas comparações serão feitas nesta ${unidade}?`,
    opcoes: opcoes,
    explicacao: `Percorrer um trecho de ${tamTrecho} barras comparando cada uma com a seguinte (ou com o mínimo/pivô) dá ${tamTrecho} − 1 = ${correta} comparações.`,
  });

  q.correta = opcoes.indexOf(String(correta));
  return q;
}

const VARIACOES_PROJECAO = [
  (k) =>
    `Olhando para as barras à frente: nas próximas ${k} comparações desta passagem, quantas vão resultar em troca?`,
  (k) =>
    `Sem avançar a animação, projete os próximos passos: das ${k} comparações seguintes, quantas terminam em troca?`,
  (k) =>
    `Se o algoritmo seguisse mais ${k} comparações nesta passagem, em quantas delas as barras trocariam de lugar?`,
  (k) =>
    `Antes de continuar: entre as ${k} próximas comparações desta passagem, quantas provocam uma troca?`,
];

function Q_TrocasJanela(array, inicio, limiteJ, k, seed, variacaoIdx = 0) {
  const copia = array.slice();
  let trocas = 0;
  for (let t = 0; t < k; t++) {
    const p = inicio + t;
    if (p + 1 > limiteJ + 1) break;
    if (copia[p] > copia[p + 1]) {
      [copia[p], copia[p + 1]] = [copia[p + 1], copia[p]];
      trocas++;
    }
  }
  const s = gerarSeed(["janela", array.slice(inicio, inicio + k + 1)], seed);
  const opcoes = embaralhar(["0", "1", "2", "3"], s);
  const q = makeQuest({
    tipo: "projecao",
    enunciado: VARIACOES_PROJECAO[variacaoIdx % VARIACOES_PROJECAO.length](k),
    opcoes: opcoes,
    explicacao: `Simulando as ${k} comparações seguintes, ${trocas} resulta(m) em troca. Lembre que cada troca altera o vetor e muda a comparação seguinte.`,
  });
  q.correta = opcoes.indexOf(String(trocas));
  return q;
}

const VARIACOES_DIVISAO = [
  (n) =>
    `O trecho destacado tem ${n} barras e será dividido ao meio antes de qualquer comparação. Quantas barras ficarão na metade da ESQUERDA?`,
  (n) =>
    `Antes de intercalar, o algoritmo precisa quebrar este trecho de ${n} barras em duas partes. Quantas barras vão para a parte da ESQUERDA?`,
  (n) =>
    `Este trecho de ${n} barras está prestes a ser dividido. Qual será o tamanho da metade da ESQUERDA?`,
  (n) =>
    `O Merge Sort vai partir ao meio o trecho destacado, que tem ${n} barras. Com quantas barras fica o lado ESQUERDO?`,
];

function Q_MergeDivisao(tamTrecho, seed, variacaoIdx = 0) {
  const esquerda = Math.ceil(tamTrecho / 2);
  const direita = tamTrecho - esquerda;
  const s = gerarSeed(["divisao", tamTrecho, variacaoIdx], seed);
  const distratores = distratoresNumericos(esquerda, [
    direita,
    esquerda + 1,
    esquerda - 1,
    tamTrecho,
  ]);
  const opcoes = embaralhar(
    [
      String(esquerda),
      String(distratores[0]),
      String(distratores[1]),
      String(distratores[2]),
    ],
    s,
  );
  const q = makeQuest({
    tipo: "divisao",
    enunciado:
      VARIACOES_DIVISAO[variacaoIdx % VARIACOES_DIVISAO.length](tamTrecho),
    opcoes: opcoes,
    explicacao:
      tamTrecho % 2 === 0
        ? `A divisão é por POSIÇÃO, não por valor: o corte cai no meio exato. Com ${tamTrecho} barras, cada lado fica com ${esquerda}.`
        : `A divisão é por POSIÇÃO, não por valor: o corte cai no meio. Com ${tamTrecho} barras (número ímpar), a barra extra fica à esquerda — ${esquerda} de um lado e ${direita} do outro.`,
  });
  q.correta = opcoes.indexOf(String(esquerda));
  return q;
}

class GerenciadorQuestoes {
  constructor(algoritmo, arr) {
    this.algoritmo = algoritmo;
    this.arr = arr;
    this.seed = gerarSeed(arr, 0);
    this.contadoresDinamica = {};
    this.emitidasPorTipo = {};
    this.totalEmitidas = 0;
    this.ultimoIndice = 0;
    this.COTA_POR_TIPO = 2;
    this.COTA_TOTAL = 8;
    this.COTA_ESPECIFICA = {
      trocas: 1,
      comparacoes: 1,
      "trocas definitivas": 1,
      "trocas adjacentes": 1,
      "trocas acumuladas": 1,
    };
  }

  preExecucao() {
    return [];
  }

  questaoFinal(nomeAlg, frame) {
    return null;
  }

  podeMostrarDinamica(tipo, aCada) {
    if (!this.contadoresDinamica[tipo]) {
      this.contadoresDinamica[tipo] = 0;
    }
    const naVez = this.contadoresDinamica[tipo] % aCada === 0;
    this.contadoresDinamica[tipo]++;
    if (!naVez) return false;

    const jaEmitidas = this.emitidasPorTipo[tipo] || 0;
    const cota = this.COTA_ESPECIFICA[tipo] ?? this.COTA_POR_TIPO;
    if (jaEmitidas >= cota) return false;
    if (this.totalEmitidas >= this.COTA_TOTAL) return false;

    this.emitidasPorTipo[tipo] = jaEmitidas + 1;
    this.totalEmitidas++;
    this.ultimoIndice = this.emitidasPorTipo[tipo];
    return true;
  }
}
