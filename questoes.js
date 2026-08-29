function makeQuest(extra) {
    return Object.assign({
        tipo: "dinamica",
        enunciado: "",
        opcoes: [],
        correta: 0,
        respondida: false,
        fechada: false,
        escolha: null,
        acertou: null
    }, extra);
}

function hashArray(arr) {
    let hash = 0;
    for (let i = 0; i < arr.length; i++) {
        hash = ((hash << 5) - hash) + arr[i];
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

function Q_PredicaoTroca(v1, v2, seed) {
    const s = gerarSeed([v1, v2], seed);
    const troca = v1 > v2;
    const correta = troca
        ? `Haverá troca, pois ${v1} é maior que ${v2}.`
        : `Não haverá troca, pois já estão na ordem certa.`;

    const opcoes = embaralhar([
        `Haverá troca, pois ${v1} é maior que ${v2}.`,
        `Não haverá troca, pois já estão na ordem certa.`,
        `Haverá troca, pois a regra exige alternar posições a cada passo.`,
        `Os elementos serão somados e mesclados no mesmo local.`
    ], s);

    const q = makeQuest({
        tipo: "predicao",
        enunciado: `Avaliando as barras destacadas (${v1} e ${v2}), o que acontecerá com elas neste exato momento?`,
        opcoes: opcoes
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

    const opcoes = embaralhar([
        `Sim, ${avaliado} passará a ser o novo menor.`,
        `Não, ${minAtual} continua sendo o menor provisório.`,
        `Eles serão trocados de posição visualmente de imediato.`,
        `O algoritmo vai parar e reiniciar a busca do zero.`
    ], s);

    const q = makeQuest({
        tipo: "analise",
        enunciado: `O menor valor provisório registrado é ${minAtual}. Ao compará-lo com a barra atual (${avaliado}), o título de "menor valor" vai mudar?`,
        opcoes: opcoes
    });
    q.correta = opcoes.indexOf(correta);
    return q;
}

function Q_MergeDesce(vEsq, vDir, seed) {
    const s = gerarSeed([vEsq, vDir], seed);
    const desceV1 = vEsq <= vDir;
    const correta = desceV1 ? `O valor ${vEsq}, por ser menor ou igual.` : `O valor ${vDir}, por ser estritamente menor.`;

    const opcoes = embaralhar([
        `O valor ${vEsq}, por ser menor ou igual.`,
        `O valor ${vDir}, por ser estritamente menor.`,
        `Ambos descerão ao mesmo tempo para o vetor final.`,
        `O algoritmo ignorará ambos e buscará o próximo par.`
    ], s);

    const q = makeQuest({
        tipo: "predicao",
        enunciado: `Fase de Intercalação (Merge): Comparando as barras ${vEsq} e ${vDir}, qual das duas descerá para ocupar a posição no vetor principal agora?`,
        opcoes: opcoes
    });
    q.correta = opcoes.indexOf(correta);
    return q;
}

function Q_QuickPivo(pivo, atual, seed) {
    const s = gerarSeed([pivo, atual], seed);
    const menor = atual <= pivo;
    const correta = menor ? `Ficará à esquerda, pois ${atual} <= Pivô (${pivo}).` : `Ficará à direita, pois ${atual} > Pivô (${pivo}).`;

    const opcoes = embaralhar([
        `Ficará à esquerda, pois ${atual} <= Pivô (${pivo}).`,
        `Ficará à direita, pois ${atual} > Pivô (${pivo}).`,
        `Substituirá o pivô imediatamente, assumindo seu lugar.`,
        `Será removido temporariamente da partição atual.`
    ], s);

    const q = makeQuest({
        tipo: "analise",
        enunciado: `O valor atual analisado é ${atual} e o Pivô é ${pivo}. Baseado na regra de partição, qual será o destino do valor ${atual}?`,
        opcoes: opcoes
    });
    q.correta = opcoes.indexOf(correta);
    return q;
}

function Q_Contagem(tipo, valorAtual, seed) {
    const s = gerarSeed([tipo, valorAtual], seed);
    const correta = String(valorAtual);
    const distratores = Array.from(new Set([valorAtual - 1, valorAtual + 1, valorAtual + 2, valorAtual + 3, valorAtual - 2].filter(x => x >= 0)));

    const opcoes = embaralhar([correta, String(distratores[0]), String(distratores[1]), String(distratores[2])], s);

    const q = makeQuest({
        tipo: "metrica",
        enunciado: `Análise de Métricas: Esconda o placar com a mão e tente descobrir! Quantas ${tipo} o algoritmo já precisou realizar até este momento exato?`,
        opcoes: opcoes
    });
    q.correta = opcoes.indexOf(correta);
    return q;
}

function Q_EstadoOrdenados(qtd, seed) {
    const s = gerarSeed(["estado", qtd], seed);
    const correta = String(qtd);
    const opcoes = embaralhar([correta, String(qtd + 1), String(qtd + 2), String(qtd === 0 ? 3 : qtd - 1)], s);

    const q = makeQuest({
        tipo: "estado",
        enunciado: `Leitura Visual: Observe as barras com a cor Verde. Exatamente quantos elementos já atingiram sua posição final e definitiva no vetor?`,
        opcoes: opcoes
    });
    q.correta = opcoes.indexOf(correta);
    return q;
}

function Q_BubblePasso(seed, dados) {
    const s = gerarSeed(["bubble_passo", dados.i, dados.n], seed);
    const posicaoFinal = dados.n - 1 - dados.i;
    const valorFinal = `A posição ${posicaoFinal} (índice ${posicaoFinal})`;

    const correta = valorFinal;
    const opcoes = embaralhar([
        valorFinal,
        `A posição ${dados.i} (índice ${dados.i})`,
        `A posição 0 (índice 0)`,
        `A posição ${Math.floor(dados.n / 2)} (índice ${Math.floor(dados.n / 2)})`
    ], s);

    const q = makeQuest({
        tipo: "estado",
        enunciado: `Bubble Sort: Após ${dados.i + 1} passo(s) completo(s) da ordenação, qual posição está garantidamente com seu elemento final e definitivo?`,
        opcoes: opcoes
    });
    q.correta = opcoes.indexOf(correta);
    return q;
}

function Q_SelectionPrimeiraPosicao(seed) {
    const s = gerarSeed(["selection_primeira"], seed);
    const correta = "A posição 0 (índice 0)";
    const opcoes = embaralhar([
        correta,
        "A última posição do vetor",
        "A posição do menor elemento encontrado",
        "A posição central do vetor"
    ], s);

    const q = makeQuest({
        tipo: "estado",
        enunciado: "Selection Sort: No primeiro ciclo completo, qual posição do vetor será preenchida com o menor elemento definitivamente?",
        opcoes: opcoes
    });
    q.correta = opcoes.indexOf(correta);
    return q;
}

function Q_SelectionTrocasMaximas(seed, dados) {
    const n = Array.isArray(dados) ? dados.length : dados;
    const s = gerarSeed(["selection_trocas", n], seed);
    const correta = String(n - 1);
    const opcoes = embaralhar([correta, String(n), String(Math.floor(n / 2)), String(n * (n - 1) / 2)], s);

    const q = makeQuest({
        tipo: "metrica",
        enunciado: `Selection Sort: Para um vetor de ${n} elementos, qual o número máximo de trocas que este algoritmo pode realizar?`,
        opcoes: opcoes
    });
    q.correta = opcoes.indexOf(correta);
    return q;
}

function Q_InsertionDeslocamentos(seed, dados) {
    const s = gerarSeed(["insertion_desl", dados.array.slice(0, dados.j + 1)], seed);
    const atual = dados.array[dados.j];
    let deslocamentos = 0;
    for (let k = dados.j - 1; k >= 0; k--) {
        if (dados.array[k] > atual) deslocamentos++;
        else break;
    }

    const correta = String(deslocamentos);
    const distratores = Array.from(new Set([deslocamentos + 1, deslocamentos - 1, dados.j, 0].filter(x => x >= 0)));
    const opcoes = embaralhar([correta, String(distratores[0]), String(distratores[1] || deslocamentos + 2), String(distratores[2] || dados.j)], s);

    const q = makeQuest({
        tipo: "analise",
        enunciado: `Insertion Sort: O elemento ${atual} acabou de ser comparado com seu vizinho à esquerda. Quantos deslocamentos para a direita ele sofrerá até encontrar sua posição correta?`,
        opcoes: opcoes
    });
    q.correta = opcoes.indexOf(correta);
    return q;
}

function Q_InsertionMelhorCaso(seed) {
    const s = gerarSeed(["insertion_melhor"], seed);
    const correta = "O(n) — percorre uma vez e não desloca ninguém.";
    const opcoes = embaralhar([
        correta,
        "O(n²) — sempre compara todos os elementos.",
        "O(log n) — usa busca binária internamente.",
        "O(1) — já insere direto sem comparações."
    ], s);

    const q = makeQuest({
        tipo: "teoria",
        enunciado: "Insertion Sort: Se o vetor já estiver totalmente ordenado, qual será o comportamento do algoritmo?",
        opcoes: opcoes
    });
    q.correta = opcoes.indexOf(correta);
    return q;
}

function Q_MergeEspacoExtra(seed) {
    const s = gerarSeed(["merge_espaco"], seed);
    const correta = "O(n) — arranjos temporários L e R são criados a cada fusão.";
    const opcoes = embaralhar([
        correta,
        "O(1) — todas as trocas acontecem no próprio vetor.",
        "O(log n) — usa a pilha de chamadas recursivas.",
        "O(n²) — clona o vetor várias vezes."
    ], s);

    const q = makeQuest({
        tipo: "teoria",
        enunciado: "Merge Sort: Qual a complexidade de espaço (memória extra) deste algoritmo no pior caso?",
        opcoes: opcoes
    });
    q.correta = opcoes.indexOf(correta);
    return q;
}

function Q_MergeNiveisRecursao(seed, dados) {
    const n = Array.isArray(dados) ? dados.length : dados;
    const s = gerarSeed(["merge_niveis", n], seed);
    const niveis = Math.ceil(Math.log2(n));
    const correta = String(niveis);
    const opcoes = embaralhar([correta, String(n - 1), String(n), String(Math.floor(n / 2))], s);

    const q = makeQuest({
        tipo: "analise",
        enunciado: `Merge Sort: Para um vetor de ${n} elementos, quantos níveis de divisão recursiva existirão até chegar a subarrays de tamanho 1?`,
        opcoes: opcoes
    });
    q.correta = opcoes.indexOf(correta);
    return q;
}

function Q_QuickPiorCaso(seed) {
    const s = gerarSeed(["quick_pior"], seed);
    const correta = "O(n²) — quando o pivô é sempre o maior ou menor elemento.";
    const opcoes = embaralhar([
        correta,
        "O(n log n) — é o caso médio e também o pior.",
        "O(n) — sempre divide exatamente ao meio.",
        "O(1) — não há comparações no pior cenário."
    ], s);

    const q = makeQuest({
        tipo: "teoria",
        enunciado: "Quick Sort: Qual a complexidade de tempo no pior caso e qual condição a desencadeia?",
        opcoes: opcoes
    });
    q.correta = opcoes.indexOf(correta);
    return q;
}

function Q_QuickParticicoes(seed, dados) {
    const n = Array.isArray(dados) ? dados.length : dados;
    const s = gerarSeed(["quick_part", n], seed);
    const correta = String(n - 1);
    const opcoes = embaralhar([correta, String(n), String(Math.floor(n / 2)), String(Math.ceil(Math.log2(n)))], s);

    const q = makeQuest({
        tipo: "analise",
        enunciado: `Quick Sort: Para um vetor de ${n} elementos, quantas partições (chamadas a PARTITION) serão criadas no total durante toda a execução?`,
        opcoes: opcoes
    });
    q.correta = opcoes.indexOf(correta);
    return q;
}

function Q_Estavel(algoritmo, seed) {
    const s = gerarSeed(["estavel", algoritmo], seed);
    const estaveis = ["Bubble Sort", "Insertion Sort", "Merge Sort"];
    const ehEstavel = estaveis.includes(algoritmo);
    const correta = ehEstavel ? `Sim, o ${algoritmo} é estável.` : `Não, o ${algoritmo} não garante estabilidade.`;

    const opcoes = embaralhar([
        `Sim, o ${algoritmo} é estável.`,
        `Não, o ${algoritmo} não garante estabilidade.`,
        "Depende da implementação do programador.",
        "Apenas algoritmos recursivos são estáveis."
    ], s);

    const q = makeQuest({
        tipo: "teoria",
        enunciado: `${algoritmo}: Este algoritmo é considerado estável, ou seja, mantém a ordem relativa de elementos com valores iguais?`,
        opcoes: opcoes
    });
    q.correta = opcoes.indexOf(correta);
    return q;
}

function Q_ComplexidadeCaso(algoritmo, caso, seed) {
    const s = gerarSeed(["complexidade", algoritmo, caso], seed);
    const complexidades = {
        "Bubble Sort": { melhor: "O(n)", medio: "O(n²)", pior: "O(n²)" },
        "Selection Sort": { melhor: "O(n²)", medio: "O(n²)", pior: "O(n²)" },
        "Insertion Sort": { melhor: "O(n)", medio: "O(n²)", pior: "O(n²)" },
        "Merge Sort": { melhor: "O(n log n)", medio: "O(n log n)", pior: "O(n log n)" },
        "Quick Sort": { melhor: "O(n log n)", medio: "O(n log n)", pior: "O(n²)" }
    };

    const correta = complexidades[algoritmo][caso];
    const outras = Object.values(complexidades[algoritmo]).filter(c => c !== correta);
    const distratores = Array.from(new Set(outras)).slice(0, 3);
    while (distratores.length < 3) distratores.push("O(n³)");

    const opcoes = embaralhar([correta, distratores[0], distratores[1], distratores[2]], s);

    const q = makeQuest({
        tipo: "teoria",
        enunciado: `${algoritmo}: Qual a complexidade de tempo no ${caso} caso?`,
        opcoes: opcoes
    });
    q.correta = opcoes.indexOf(correta);
    return q;
}

const BancoQuestoes = {
    pre_execucao: {
        "Bubble Sort": [Q_InsertionMelhorCaso, Q_ComplexidadeCaso],
        "Selection Sort": [Q_SelectionTrocasMaximas],
        "Insertion Sort": [Q_InsertionMelhorCaso],
        "Merge Sort": [Q_MergeEspacoExtra, Q_MergeNiveisRecursao],
        "Quick Sort": [Q_QuickPiorCaso, Q_QuickParticicoes]
    },
    final: {
        "Bubble Sort": [Q_Estavel, Q_ComplexidadeCaso],
        "Selection Sort": [Q_Estavel, Q_ComplexidadeCaso],
        "Insertion Sort": [Q_Estavel, Q_ComplexidadeCaso],
        "Merge Sort": [Q_Estavel, Q_MergeEspacoExtra],
        "Quick Sort": [Q_Estavel, Q_QuickPiorCaso]
    }
};

class GerenciadorQuestoes {
    constructor(algoritmo, arr) {
        this.algoritmo = algoritmo;
        this.arr = arr;
        this.seed = hashArray(arr);
    }

    _chamarPreExecucao(funcao, indice) {
        const seed = this.seed + indice;
        if (funcao.name === "Q_ComplexidadeCaso") {
            return funcao(this.algoritmo, "medio", seed);
        }
        if (funcao.name === "Q_SelectionTrocasMaximas") {
            return funcao(seed, this.arr);
        }
        return funcao(seed, this.arr);
    }

    preExecucao() {
        const questoes = [];
        const banco = BancoQuestoes.pre_execucao[this.algoritmo] || [];
        const count = banco.length > 0 ? Math.min(2, banco.length) : 0;

        for (let i = 0; i < count; i++) {
            const idx = (Math.abs(this.seed * 17 + i * 31) % banco.length);
            const funcao = banco[idx];
            const q = this._chamarPreExecucao(funcao, i);
            questoes.push(q);
        }
        return questoes;
    }

    _chamarFinal(funcao, nomeAlg) {
        if (funcao.name === "Q_Estavel") {
            return funcao(nomeAlg, this.seed);
        }
        if (funcao.name === "Q_ComplexidadeCaso") {
            return funcao(nomeAlg, "medio", this.seed);
        }
        return funcao(this.seed, nomeAlg);
    }

    questaoFinal(nomeAlg) {
        const questoesTipo = BancoQuestoes.final[nomeAlg] || [];
        if (questoesTipo.length === 0) return null;

        const idx = Math.abs(this.seed * 23) % questoesTipo.length;
        const funcaoQuestao = questoesTipo[idx];

        if (this.usadosFinal && this.usadosFinal.has(funcaoQuestao.name)) {
            const altIdx = (idx + 1) % questoesTipo.length;
            const altFuncao = questoesTipo[altIdx];
            return this._chamarFinal(altFuncao, nomeAlg);
        }

        if (!this.usadosFinal) this.usadosFinal = new Set();
        this.usadosFinal.add(funcaoQuestao.name);
        return this._chamarFinal(funcaoQuestao, nomeAlg);
    }
}