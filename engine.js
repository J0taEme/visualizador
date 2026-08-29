class BaseSort {
    constructor(algoritmo, arr) {
        this.algoritmo = algoritmo;
        this.arr = arr;
        this.questoes = new GerenciadorQuestoes(algoritmo, arr);
    }

    addFrame(frames, arr, state, extras = {}) {
      frames.push({
        array: [...arr],
        trocas: state.trocas,
        comparacoes: state.comparacoes,
        ordenados: [...(extras.ordenados || state.ordenados || [])],
        comparando: [...(extras.comparando || [])],
        trocando: [...(extras.trocando || [])],
        pivo: extras.pivo !== undefined ? extras.pivo : null,
        subarray: extras.subarray ? [...extras.subarray] : null,
        linhasAtivas: [...(extras.linhasAtivas || [])],
        linhaSeta: extras.linhaSeta || null,
        questao: extras.questao || null
      });
    }

    _injetarQuestoesPreExecucao(frames) {
      if (frames.length === 0) return;
      const questoes = this.questoes.preExecucao();
      questoes.forEach((q, i) => {
        if (frames[i]) frames[i].questao = q;
      });
    }

    _injetarQuestaoFinal(frames, nomeAlg) {
      if (frames.length === 0) return frames;
      const last = frames[frames.length - 1];
      const q = this.questoes.questaoFinal(nomeAlg);

      if (q) {
        last.questao = q;
        return frames;
      }

      let correta, enunciado;

      if (nomeAlg === "Bubble Sort" || nomeAlg === "Insertion Sort") {
        enunciado = `Conclusão Teórica: Na prática da engenharia, algoritmos como o ${nomeAlg} se saem surpreendentemente bem e são rápidos se o vetor inicial estiver:`;
        correta = `Quase totalmente ordenado.`;
      } else if (nomeAlg === "Quick Sort") {
        enunciado = `Conclusão Teórica: O Quick Sort é famosamente rápido. Mas qual é a sua "kryptonita" (o pior cenário teórico de desempenho)?`;
        correta = `Quando o vetor já está ordenado e o pivô é mal escolhido nas extremidades.`;
      } else if (nomeAlg === "Merge Sort") {
        enunciado = `Conclusão Teórica: O Merge Sort é extremamente consistente em tempo. Qual é o seu grande custo/desvantagem oculta?`;
        correta = `Exige espaço extra (clones de array na memória) para realizar a fusão (merge).`;
      } else {
        enunciado = `Conclusão Teórica: Finalizamos o ${nomeAlg}. Baseado no comportamento visualizado, qual o seu padrão característico?`;
        correta = `Realiza comparações excessivas, mas tenta otimizar o número de trocas totais.`;
      }

      const distratores = [ `Totalmente invertido na ordem decrescente rigorosa.`, `Completamente embaralhado e com valores aleatórios.`, `Quando todos os elementos da lista são números negativos.`, `Nenhum, pois a complexidade de tempo não muda nunca.` ];
      const opcoes = embaralhar([correta, ...distratores].slice(0, 4));
      const qFinal = makeQuest({ tipo: "teoria", enunciado, opcoes });
      qFinal.correta = opcoes.indexOf(correta);

      last.questao = qFinal;
      return frames;
    }
}

class BubbleSort extends BaseSort {
    constructor(arr) { super("Bubble Sort", arr); }
    gerarFrames() {
      const array = [...this.arr], frames = [], n = array.length;
      let st = { trocas: 0, comparacoes: 0, ordenados: [] };

      this.addFrame(frames, array, st, { linhasAtivas: [1], linhaSeta: 1 });

      for (let i = 0; i < n - 1; i++) {
        st.ordenados = Array.from({ length: i }, (_, k) => n - 1 - k);

        let qEstado = (i > 0 && i % 2 === 0) ? Q_EstadoOrdenados(i, this.questoes.seed) : null;
        if (qEstado) this.addFrame(frames, array, st, { questao: qEstado });

        for (let j = 0; j < n - i - 1; j++) {
          st.comparacoes++;

          let qComp = (st.comparacoes % 6 === 0) ? Q_PredicaoTroca(array[j], array[j + 1], this.questoes.seed) : null;
          this.addFrame(frames, array, st, { comparando: [j, j + 1], linhasAtivas: [1, 2, 3], linhaSeta: 3, questao: qComp });

          if (array[j] > array[j + 1]) {
            this.addFrame(frames, array, st, { trocando: [j, j + 1], linhasAtivas: [1, 2, 3, 4], linhaSeta: 4 });
            [array[j], array[j + 1]] = [array[j + 1], array[j]];
            st.trocas++;

            let qTroca = (st.trocas > 0 && st.trocas % 5 === 0) ? Q_Contagem('trocas', st.trocas, this.questoes.seed) : null;
            this.addFrame(frames, array, st, { trocando: [j, j + 1], linhasAtivas: [1, 2, 3, 4], linhaSeta: 4, questao: qTroca });
          }
        }
        st.ordenados = Array.from({ length: i + 1 }, (_, k) => n - 1 - k);
        this.addFrame(frames, array, st, { linhasAtivas: [1], linhaSeta: 1 });
      }
      st.ordenados = Array.from({ length: n }, (_, k) => k);
      this.addFrame(frames, array, st);

      this._injetarQuestoesPreExecucao(frames);
      return this._injetarQuestaoFinal(frames, "Bubble Sort");
    }
}

class SelectionSort extends BaseSort {
    constructor(arr) { super("Selection Sort", arr); }
    gerarFrames() {
      const array = [...this.arr], frames = [], n = array.length;
      let st = { trocas: 0, comparacoes: 0, ordenados: [] };

      this.addFrame(frames, array, st, { linhasAtivas: [1], linhaSeta: 1 });

      for (let i = 0; i < n - 1; i++) {
        let minIdx = i;
        st.ordenados = Array.from({ length: i }, (_, k) => k);

        for (let j = i + 1; j < n; j++) {
          st.comparacoes++;

          let qComp = (st.comparacoes % 5 === 0) ? Q_SelectionMin(array[minIdx], array[j], this.questoes.seed) : null;
          this.addFrame(frames, array, st, { comparando: [j], pivo: minIdx, linhasAtivas: [1, 3, 4], linhaSeta: 4, questao: qComp });

          if (array[j] < array[minIdx]) {
            minIdx = j;
            this.addFrame(frames, array, st, { pivo: minIdx, linhasAtivas: [1, 3, 4, 5], linhaSeta: 5 });
          }
        }
        if (minIdx !== i) {
          this.addFrame(frames, array, st, { trocando: [i, minIdx], linhasAtivas: [1, 6], linhaSeta: 6 });
          [array[i], array[minIdx]] = [array[minIdx], array[i]];
          st.trocas++;

          let qTroca = (st.trocas > 0 && st.trocas % 3 === 0) ? Q_Contagem('trocas definitivas', st.trocas, this.questoes.seed) : null;
          this.addFrame(frames, array, st, { trocando: [i, minIdx], linhasAtivas: [1, 6], linhaSeta: 6, questao: qTroca });
        }
        st.ordenados = Array.from({ length: i + 1 }, (_, k) => k);
        this.addFrame(frames, array, st, { linhasAtivas: [1], linhaSeta: 1 });
      }
      st.ordenados = Array.from({ length: n }, (_, k) => k);
      this.addFrame(frames, array, st);

      this._injetarQuestoesPreExecucao(frames);
      return this._injetarQuestaoFinal(frames, "Selection Sort");
    }
}

class InsertionSort extends BaseSort {
    constructor(arr) { super("Insertion Sort", arr); }
    gerarFrames() {
      const array = [...this.arr], frames = [], n = array.length;
      let st = { trocas: 0, comparacoes: 0, ordenados: [] };

      this.addFrame(frames, array, st, { linhasAtivas: [1], linhaSeta: 1 });

      for (let i = 1; i < n; i++) {
        let j = i;

        while (j > 0) {
          st.comparacoes++;

          let qComp = (st.comparacoes % 6 === 0) ? Q_PredicaoTroca(array[j-1], array[j], this.questoes.seed) : null;
          this.addFrame(frames, array, st, { comparando: [j, j - 1], linhasAtivas: [1, 4], linhaSeta: 4, questao: qComp });

          if (array[j] < array[j - 1]) {
            this.addFrame(frames, array, st, { trocando: [j, j - 1], linhasAtivas: [1, 4, 5], linhaSeta: 5 });
            [array[j], array[j - 1]] = [array[j - 1], array[j]];
            st.trocas++;

            let qTroca = (st.trocas > 0 && st.trocas % 6 === 0) ? Q_Contagem('deslocamentos/trocas', st.trocas, this.questoes.seed) : null;
            this.addFrame(frames, array, st, { trocando: [j, j - 1], linhasAtivas: [1, 4, 5], linhaSeta: 5, questao: qTroca });
            j--;
          } else break;
        }
        this.addFrame(frames, array, st, { linhasAtivas: [1, 7], linhaSeta: 7 });
      }
      st.ordenados = Array.from({ length: n }, (_, k) => k);
      this.addFrame(frames, array, st);

      this._injetarQuestoesPreExecucao(frames);
      return this._injetarQuestaoFinal(frames, "Insertion Sort");
    }
}

class MergeSort extends BaseSort {
    constructor(arr) { super("Merge Sort", arr); this.st = { trocas: 0, comparacoes: 0, ordenados: [] }; }
    gerarFrames() {
      const array = [...this.arr], frames = [];

      this.addFrame(frames, array, this.st, { linhasAtivas: [1], linhaSeta: 1 });
      this.dividir(array, 0, array.length - 1, frames);
      this.st.ordenados = Array.from({ length: array.length }, (_, k) => k);
      this.addFrame(frames, array, this.st);

      this._injetarQuestoesPreExecucao(frames);
      return this._injetarQuestaoFinal(frames, "Merge Sort");
    }
    dividir(array, esq, dir, frames) {
      if (esq >= dir) return;
      const meio = Math.floor((esq + dir) / 2);
      this.dividir(array, esq, meio, frames);
      this.dividir(array, meio + 1, dir, frames);
      this.intercalar(array, esq, meio, dir, frames);
    }
    intercalar(array, esq, meio, dir, frames) {
      const temp = array.slice(esq, dir + 1);
      let i = 0, j = meio - esq + 1, k = esq;
      const subarray = Array.from({ length: dir - esq + 1 }, (_, x) => esq + x);

      this.addFrame(frames, array, this.st, { comparando: subarray, subarray, linhasAtivas: [13, 14], linhaSeta: 13 });

      while (i <= meio - esq && j <= dir - esq) {
        this.st.comparacoes++;

        let qMerge = (this.st.comparacoes % 6 === 0) ? Q_MergeDesce(temp[i], temp[j], this.questoes.seed) : null;

        if (temp[i] <= temp[j]) { array[k] = temp[i]; i++; }
        else { array[k] = temp[j]; j++; this.st.trocas++; }

        this.addFrame(frames, array, this.st, { trocando: [k], subarray, linhasAtivas: [13, 14], linhaSeta: 13, questao: qMerge });
        k++;
      }
      while (i <= meio - esq) {
        array[k] = temp[i]; i++;
        this.addFrame(frames, array, this.st, { trocando: [k], subarray, linhasAtivas: [13], linhaSeta: 13 });
        k++;
      }
      while (j <= dir - esq) {
        array[k] = temp[j]; j++;
        this.addFrame(frames, array, this.st, { trocando: [k], subarray, linhasAtivas: [14], linhaSeta: 14 });
        k++;
      }

      let qTrocas = (this.st.trocas > 0 && this.st.trocas % 7 === 0) ? Q_Contagem('atribuições no vetor final', this.st.trocas, this.questoes.seed) : null;
      this.addFrame(frames, array, this.st, { trocando: subarray, subarray, linhasAtivas: [13], linhaSeta: 13, questao: qTrocas });
    }
}

class QuickSort extends BaseSort {
    constructor(arr) { super("Quick Sort", arr); this.st = { trocas: 0, comparacoes: 0, ordenados: [] }; }
    gerarFrames() {
      const array = [...this.arr], frames = [];

      this.addFrame(frames, array, this.st, { linhasAtivas: [1], linhaSeta: 1 });
      this._quickSort(array, 0, array.length - 1, frames);
      this.st.ordenados = Array.from({ length: array.length }, (_, k) => k);
      this.addFrame(frames, array, this.st);

      this._injetarQuestoesPreExecucao(frames);
      return this._injetarQuestaoFinal(frames, "Quick Sort");
    }
    _quickSort(array, esq, dir, frames) {
      if (esq === dir) {
        if (!this.st.ordenados.includes(esq)) {
          this.st.ordenados.push(esq); this.st.ordenados.sort((a, b) => a - b);
          this.addFrame(frames, array, this.st);
        }
        return;
      }
      if (esq > dir) return;
      const indicePivo = this.particionar(array, esq, dir, frames);
      if (!this.st.ordenados.includes(indicePivo)) {
        this.st.ordenados.push(indicePivo); this.st.ordenados.sort((a, b) => a - b);
      }

      let qOrdenados = (this.st.ordenados.length > 0 && this.st.ordenados.length % 3 === 0) ? Q_EstadoOrdenados(this.st.ordenados.length, this.questoes.seed) : null;
      this.addFrame(frames, array, this.st, { questao: qOrdenados });

      this._quickSort(array, esq, indicePivo - 1, frames);
      this._quickSort(array, indicePivo + 1, dir, frames);
    }
    particionar(array, esq, dir, frames) {
      const pivo = array[dir], subarray = Array.from({ length: dir - esq + 1 }, (_, x) => esq + x);
      let i = esq - 1;

      for (let j = esq; j < dir; j++) {
        this.st.comparacoes++;

        let qPivo = (this.st.comparacoes % 6 === 0) ? Q_QuickPivo(pivo, array[j], this.questoes.seed) : null;

        this.addFrame(frames, array, this.st, { pivo: dir, subarray, linhasAtivas: [9, 10], linhaSeta: 10, questao: qPivo });
        this.addFrame(frames, array, this.st, { comparando: [j, dir], pivo: dir, subarray, linhasAtivas: [9, 10], linhaSeta: 10 });

        if (array[j] <= pivo) {
          i++;
          if (i !== j) {
            this.st.trocas++;
            this.addFrame(frames, array, this.st, { trocando: [i, j], pivo: dir, subarray, linhasAtivas: [11, 12], linhaSeta: 12 });
            [array[i], array[j]] = [array[j], array[i]];
            this.addFrame(frames, array, this.st, { trocando: [i, j], pivo: dir, subarray, linhasAtivas: [11, 12], linhaSeta: 12 });
          }
        }
      }
      if (i + 1 !== dir) {
        this.st.trocas++;
        this.addFrame(frames, array, this.st, { trocando: [i + 1, dir], pivo: dir, subarray, linhasAtivas: [13], linhaSeta: 13 });
        [array[i + 1], array[dir]] = [array[dir], array[i + 1]];
        this.addFrame(frames, array, this.st, { trocando: [i + 1, dir], subarray, linhasAtivas: [13], linhaSeta: 13 });
      }
      return i + 1;
    }
}