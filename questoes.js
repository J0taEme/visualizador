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
      `Haverá troca, pois ${v2} é maior que ${v1}.`,
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

function Q_SelectionMin(minAtual, avaliado, seed) {
  const s = gerarSeed([minAtual, avaliado], seed);
  const trocaMin = avaliado < minAtual;
  const correta = trocaMin
    ? `Sim, ${avaliado} passará a ser o novo menor.`
    : `Não, ${minAtual} continua sendo o menor provisório.`;

  const opcoes = embaralhar(
    [
      `Sim, ${avaliado} passará a ser o novo menor.`,
      `Não, ${minAtual} continua sendo o menor provisório.`,
      `Não, pois ${minAtual} é menor que ${avaliado}.`,
      `Sim, pois todo novo elemento analisado substitui o menor.`,
    ],
    s,
  );

  const q = makeQuest({
    tipo: "analise",
    enunciado: `O menor valor provisório registrado é ${minAtual}. Ao compará-lo com a barra atual (${avaliado}), o título de "menor valor" vai mudar?`,
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

function Q_Contagem(tipo, valorAtual, seed, vetorInicial = null) {
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
    enunciado: `Análise de Métricas: ${vetorStr}Esconda o placar com a mão e tente descobrir! Quantas ${tipo} o algoritmo já precisou realizar até este momento exato?`,
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

function Q_JaFixadas(padrao, k, nomeAlg, seed) {
  const s = gerarSeed(["ja_fixadas", padrao, k, nomeAlg], seed);

  const OPC = {
    esquerda: "As barras já fixas ficam todas à esquerda (nas primeiras posições).",
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
    k > 0 ? `Até agora ${k} barra(s) já foram colocadas na posição final. ` : "";

  const q = makeQuest({
    tipo: "invariante",
    enunciado: `${contagem}Sobre as barras que já ocupam posição definitiva neste momento, o que é correto afirmar?`,
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

class GerenciadorQuestoes {
  constructor(algoritmo, arr) {
    this.algoritmo = algoritmo;
    this.arr = arr;
    this.seed = gerarSeed(arr, 0);
    this.contadoresDinamica = {};
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
    const resultado = this.contadoresDinamica[tipo] % aCada === 0;
    this.contadoresDinamica[tipo]++;
    return resultado;
  }
}
