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
      questao: extras.questao || null,
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
    const q = this.questoes.questaoFinal(nomeAlg, last);
    if (q) last.questao = q;
    return frames;
  }
}

class BubbleSort extends BaseSort {
  constructor(arr) {
    super("Bubble Sort", arr);
  }

  gerarFrames() {
    const array = [...this.arr],
      frames = [],
      n = array.length;
    let st = { trocas: 0, comparacoes: 0, ordenados: [] };

    this.addFrame(frames, array, st, { linhasAtivas: [1, 2, 3, 4] });

    for (let i = 0; i < n - 1; i++) {
      st.ordenados = Array.from({ length: i }, (_, k) => n - 1 - k);

      let qRodada =
        i >= 1 &&
        n - i >= 3 &&
        this.questoes.podeMostrarDinamica("rodada", 2)
          ? Q_ComparacoesRodada(n - i, "passagem", this.questoes.seed)
          : null;

      for (let j = 0; j < n - i - 1; j++) {
        st.comparacoes++;

        let naoTroca = array[j] <= array[j + 1];
        let qRetro =
          !qRodada &&
          naoTroca &&
          st.comparacoes % 13 === 0 &&
          this.questoes.podeMostrarDinamica("retro", 2)
            ? Q_PorQueNaoTrocou(array[j], array[j + 1], this.questoes.seed)
            : null;

        let qComp =
          !qRodada &&
          !qRetro &&
          st.comparacoes % 11 === 0 &&
          this.questoes.podeMostrarDinamica("predicao", 2)
            ? Q_PredicaoTroca(array[j], array[j + 1], this.questoes.seed)
            : null;

        this.addFrame(frames, array, st, {
          comparando: [j, j + 1],
          linhasAtivas: [1],
          linhaSeta: 1,
          questao: qRodada || qRetro || qComp,
        });
        qRodada = null;

        if (array[j] > array[j + 1]) {
          this.addFrame(frames, array, st, {
            trocando: [j, j + 1],
            linhasAtivas: [1, 2],
            linhaSeta: 2,
          });
          [array[j], array[j + 1]] = [array[j + 1], array[j]];
          st.trocas++;

          let qTroca =
            st.trocas > 0 &&
            st.trocas % 8 === 0 &&
            this.questoes.podeMostrarDinamica("trocas", 2)
              ? Q_Contagem(
                  "trocas",
                  st.trocas,
                  this.questoes.seed,
                  array.slice(),
                )
              : null;
          this.addFrame(frames, array, st, {
            trocando: [j, j + 1],
            linhasAtivas: [1, 2],
            linhaSeta: 2,
            questao: qTroca,
          });
        }
      }

      st.ordenados = Array.from({ length: i + 1 }, (_, k) => n - 1 - k);

      let qInv =
        i + 1 >= 3 &&
        i % 3 === 0 &&
        this.questoes.podeMostrarDinamica("invariante", 2)
          ? Q_JaFixadas("direita", i + 1, "Bubble Sort", this.questoes.seed)
          : null;

      this.addFrame(frames, array, st, {
        linhasAtivas: [3, 4],
        linhaSeta: 4,
        questao: qInv,
      });
    }

    st.ordenados = Array.from({ length: n }, (_, k) => k);
    this.addFrame(frames, array, st);

    this._injetarQuestoesPreExecucao(frames);
    return this._injetarQuestaoFinal(frames, "Bubble Sort");
  }
}

class SelectionSort extends BaseSort {
  constructor(arr) {
    super("Selection Sort", arr);
  }

  gerarFrames() {
    const array = [...this.arr],
      frames = [],
      n = array.length;
    let st = { trocas: 0, comparacoes: 0, ordenados: [] };

    this.addFrame(frames, array, st, { linhasAtivas: [1, 2, 3, 4, 5, 6] });

    for (let i = 0; i < n - 1; i++) {
      let minIdx = i;
      st.ordenados = Array.from({ length: i }, (_, k) => k);

      let qRodada =
        i % 3 === 1 &&
        n - i >= 3 &&
        this.questoes.podeMostrarDinamica("rodada", 2)
          ? Q_ComparacoesRodada(n - i, "rodada", this.questoes.seed)
          : null;

      this.addFrame(frames, array, st, {
        pivo: minIdx,
        linhasAtivas: [1, 2],
        linhaSeta: 2,
        questao: qRodada,
      });

      for (let j = i + 1; j < n; j++) {
        st.comparacoes++;

        let qComp =
          st.comparacoes % 9 === 0 &&
          this.questoes.podeMostrarDinamica("predicao", 2)
            ? Q_SelectionMin(array[minIdx], array[j], this.questoes.seed)
            : null;
        this.addFrame(frames, array, st, {
          comparando: [j],
          pivo: minIdx,
          linhasAtivas: [3],
          linhaSeta: 3,
          questao: qComp,
        });

        if (array[j] < array[minIdx]) {
          minIdx = j;
          this.addFrame(frames, array, st, {
            pivo: minIdx,
            linhasAtivas: [3, 4],
            linhaSeta: 4,
          });
        }
      }

      if (minIdx !== i) {
        this.addFrame(frames, array, st, {
          trocando: [i, minIdx],
          linhasAtivas: [5],
          linhaSeta: 5,
        });
        [array[i], array[minIdx]] = [array[minIdx], array[i]];
        st.trocas++;

        let qTroca =
          st.trocas > 0 &&
          st.trocas % 5 === 0 &&
          this.questoes.podeMostrarDinamica("trocas", 2)
            ? Q_Contagem(
                "trocas definitivas",
                st.trocas,
                this.questoes.seed,
                array.slice(),
              )
            : null;
        this.addFrame(frames, array, st, {
          trocando: [i, minIdx],
          linhasAtivas: [5],
          linhaSeta: 5,
          questao: qTroca,
        });
      }

      st.ordenados = Array.from({ length: i + 1 }, (_, k) => k);

      let qInv =
        i + 1 >= 3 &&
        i % 3 === 0 &&
        this.questoes.podeMostrarDinamica("invariante", 2)
          ? Q_JaFixadas("esquerda", i + 1, "Selection Sort", this.questoes.seed)
          : null;

      this.addFrame(frames, array, st, {
        linhasAtivas: [6],
        linhaSeta: 6,
        questao: qInv,
      });
    }

    st.ordenados = Array.from({ length: n }, (_, k) => k);
    this.addFrame(frames, array, st);

    this._injetarQuestoesPreExecucao(frames);
    return this._injetarQuestaoFinal(frames, "Selection Sort");
  }
}

class InsertionSort extends BaseSort {
  constructor(arr) {
    super("Insertion Sort", arr);
  }

  gerarFrames() {
    const array = [...this.arr],
      frames = [],
      n = array.length;
    let st = { trocas: 0, comparacoes: 0, ordenados: [] };

    this.addFrame(frames, array, st, { linhasAtivas: [1, 2, 3, 4, 5] });

    for (let i = 1; i < n; i++) {
      let j = i;

      let qDeslocamentosPendente =
        i % 4 === 0 && this.questoes.podeMostrarDinamica("deslocamentos", 2)
          ? Q_InsertionDeslocamentos(this.questoes.seed, { array, j })
          : null;

      while (j > 0) {
        st.comparacoes++;

        let vaiParar = !(array[j] < array[j - 1]);
        let qRetro =
          !qDeslocamentosPendente &&
          vaiParar &&
          st.comparacoes % 12 === 0 &&
          this.questoes.podeMostrarDinamica("retro", 2)
            ? Q_PorQueNaoTrocou(array[j - 1], array[j], this.questoes.seed)
            : null;

        let qComp =
          !qDeslocamentosPendente &&
          !qRetro &&
          st.comparacoes % 11 === 0 &&
          this.questoes.podeMostrarDinamica("predicao", 2)
            ? Q_PredicaoTroca(array[j - 1], array[j], this.questoes.seed)
            : null;
        let questaoFrame = qDeslocamentosPendente || qRetro || qComp;

        qDeslocamentosPendente = null;

        this.addFrame(frames, array, st, {
          comparando: [j, j - 1],
          linhasAtivas: [2, 4],
          linhaSeta: 2,
          questao: questaoFrame,
        });

        if (array[j] < array[j - 1]) {
          this.addFrame(frames, array, st, {
            trocando: [j, j - 1],
            linhasAtivas: [3, 4],
            linhaSeta: 3,
          });
          [array[j], array[j - 1]] = [array[j - 1], array[j]];
          st.trocas++;

          let qTroca =
            st.trocas > 0 &&
            st.trocas % 9 === 0 &&
            this.questoes.podeMostrarDinamica("trocas", 2)
              ? Q_Contagem(
                  "trocas adjacentes",
                  st.trocas,
                  this.questoes.seed,
                  array.slice(),
                )
              : null;
          this.addFrame(frames, array, st, {
            trocando: [j, j - 1],
            linhasAtivas: [3, 4],
            linhaSeta: 3,
            questao: qTroca,
          });
          j--;
        } else break;
      }

      let qInv =
        i >= 3 &&
        i % 4 === 2 &&
        this.questoes.podeMostrarDinamica("invariante", 2)
          ? Q_JaFixadas("nenhum", 0, "Insertion Sort", this.questoes.seed)
          : null;

      this.addFrame(frames, array, st, {
        linhasAtivas: [5],
        linhaSeta: 5,
        questao: qInv,
      });
    }

    st.ordenados = Array.from({ length: n }, (_, k) => k);
    this.addFrame(frames, array, st);

    this._injetarQuestoesPreExecucao(frames);
    return this._injetarQuestaoFinal(frames, "Insertion Sort");
  }
}

class MergeSort extends BaseSort {
  constructor(arr) {
    super("Merge Sort", arr);
    this.st = { trocas: 0, comparacoes: 0, atribuicoes: 0, ordenados: [] };
  }

  gerarFrames() {
    const array = [...this.arr],
      frames = [];

    this.dividir(array, 0, array.length - 1, frames);
    this.st.ordenados = Array.from({ length: array.length }, (_, k) => k);
    this.addFrame(frames, array, this.st);

    this._injetarQuestoesPreExecucao(frames);
    return this._injetarQuestaoFinal(frames, "Merge Sort");
  }

  dividir(array, esq, dir, frames) {
    if (esq >= dir) return;
    const meio = Math.floor((esq + dir) / 2);
    const subarray = Array.from({ length: dir - esq + 1 }, (_, x) => esq + x);

    this.addFrame(frames, array, this.st, {
      subarray,
      linhasAtivas: [1, 2, 3, 4],
    });

    this.dividir(array, esq, meio, frames);
    this.dividir(array, meio + 1, dir, frames);
    this.intercalar(array, esq, meio, dir, frames);
  }

  intercalar(array, esq, meio, dir, frames) {
    const temp = array.slice(esq, dir + 1);
    const nEsq = meio - esq + 1;
    const total = dir - esq + 1;
    const subarray = Array.from({ length: total }, (_, x) => esq + x);

    let i = 0,
      j = nEsq;
    const mesclados = [];

    const pintar = () => {
      const disp = mesclados
        .concat(temp.slice(i, nEsq))
        .concat(temp.slice(j, total));
      for (let x = 0; x < total; x++) array[esq + x] = disp[x];
    };

    pintar();
    this.addFrame(frames, array, this.st, {
      subarray,
      linhasAtivas: [4],
      linhaSeta: 4,
    });

    while (i < nEsq && j < total) {
      this.st.comparacoes++;

      let qMerge =
        this.st.comparacoes % 10 === 0 &&
        this.questoes.podeMostrarDinamica("predicao", 2)
          ? Q_MergeDesce(temp[i], temp[j], this.questoes.seed)
          : null;

      const idxEsq = esq + mesclados.length;
      const idxDir = esq + mesclados.length + (nEsq - i);
      pintar();
      this.addFrame(frames, array, this.st, {
        comparando: [idxEsq, idxDir],
        subarray,
        linhasAtivas: [5, 7],
        linhaSeta: 5,
        questao: qMerge,
      });

      const veioDaEsquerda = temp[i] <= temp[j];
      if (veioDaEsquerda) {
        mesclados.push(temp[i]);
        i++;
      } else {
        mesclados.push(temp[j]);
        j++;
        this.st.trocas++;
      }
      this.st.atribuicoes++;

      pintar();
      this.addFrame(frames, array, this.st, {
        trocando: [esq + mesclados.length - 1],
        subarray,
        linhasAtivas: [6, 7],
        linhaSeta: 6,
      });
    }

    while (i < nEsq) {
      mesclados.push(temp[i]);
      i++;
      this.st.atribuicoes++;
      pintar();
      this.addFrame(frames, array, this.st, {
        trocando: [esq + mesclados.length - 1],
        subarray,
        linhasAtivas: [8],
        linhaSeta: 8,
      });
    }

    while (j < total) {
      mesclados.push(temp[j]);
      j++;
      this.st.atribuicoes++;
      pintar();
      this.addFrame(frames, array, this.st, {
        trocando: [esq + mesclados.length - 1],
        subarray,
        linhasAtivas: [8],
        linhaSeta: 8,
      });
    }

    let qTrocas =
      this.st.atribuicoes > 0 &&
      this.st.atribuicoes % 10 === 0 &&
      this.questoes.podeMostrarDinamica("trocas", 2)
        ? Q_Contagem(
            "atribuicoes",
            this.st.atribuicoes,
            this.questoes.seed,
            array.slice(),
          )
        : null;

    let qInv =
      !qTrocas &&
      this.st.comparacoes % 17 === 0 &&
      this.questoes.podeMostrarDinamica("invariante", 2)
        ? Q_JaFixadas("nenhum", 0, "Merge Sort", this.questoes.seed)
        : null;

    pintar();
    this.addFrame(frames, array, this.st, {
      subarray,
      linhasAtivas: [5, 6, 7],
      linhaSeta: 7,
      questao: qTrocas || qInv,
    });
  }
}

class QuickSort extends BaseSort {
  constructor(arr) {
    super("Quick Sort", arr);
    this.st = { trocas: 0, comparacoes: 0, ordenados: [] };
  }

  gerarFrames() {
    const array = [...this.arr],
      frames = [];

    this._quickSort(array, 0, array.length - 1, frames);
    this.st.ordenados = Array.from({ length: array.length }, (_, k) => k);
    this.addFrame(frames, array, this.st);

    this._injetarQuestoesPreExecucao(frames);
    return this._injetarQuestaoFinal(frames, "Quick Sort");
  }

  _quickSort(array, esq, dir, frames) {
    if (esq > dir) return;

    if (esq === dir) {
      if (!this.st.ordenados.includes(esq)) {
        this.st.ordenados.push(esq);
        this.st.ordenados.sort((a, b) => a - b);
        this.addFrame(frames, array, this.st, {
          linhasAtivas: [1],
          linhaSeta: 1,
        });
      }
      return;
    }

    const subarray = Array.from({ length: dir - esq + 1 }, (_, x) => esq + x);
    this.addFrame(frames, array, this.st, {
      subarray,
      linhasAtivas: [1, 2, 3, 4],
    });

    const indicePivo = this.particionar(array, esq, dir, frames);

    if (!this.st.ordenados.includes(indicePivo)) {
      this.st.ordenados.push(indicePivo);
      this.st.ordenados.sort((a, b) => a - b);

      let qInv =
        this.st.ordenados.length >= 3 &&
        this.questoes.podeMostrarDinamica("invariante", 2)
          ? Q_JaFixadas(
              "espalhado",
              this.st.ordenados.length,
              "Quick Sort",
              this.questoes.seed,
            )
          : null;

      this.addFrame(frames, array, this.st, {
        linhasAtivas: [9],
        linhaSeta: 9,
        questao: qInv,
      });
    }

    this._quickSort(array, esq, indicePivo - 1, frames);
    this._quickSort(array, indicePivo + 1, dir, frames);
  }

  particionar(array, esq, dir, frames) {
    const pivo = array[dir],
      subarray = Array.from({ length: dir - esq + 1 }, (_, x) => esq + x);
    let i = esq - 1;

    let qRodada =
      dir - esq + 1 >= 5 &&
      this.questoes.podeMostrarDinamica("rodada", 2)
        ? Q_ComparacoesRodada(dir - esq + 1, "partição", this.questoes.seed)
        : null;

    this.addFrame(frames, array, this.st, {
      pivo: dir,
      subarray,
      linhasAtivas: [5],
      linhaSeta: 5,
      questao: qRodada,
    });

    for (let j = esq; j < dir; j++) {
      this.st.comparacoes++;

      let qPivo =
        this.st.comparacoes % 10 === 0 &&
        this.questoes.podeMostrarDinamica("predicao", 2)
          ? Q_QuickPivo(pivo, array[j], this.questoes.seed)
          : null;

      this.addFrame(frames, array, this.st, {
        comparando: [j],
        pivo: dir,
        subarray,
        linhasAtivas: [6],
        linhaSeta: 6,
        questao: qPivo,
      });

      if (array[j] <= pivo) {
        i++;
        if (i !== j) {
          this.st.trocas++;

          this.addFrame(frames, array, this.st, {
            trocando: [i, j],
            pivo: dir,
            subarray,
            linhasAtivas: [7],
            linhaSeta: 7,
          });
          [array[i], array[j]] = [array[j], array[i]];

          let qTrocaQuick =
            this.st.trocas > 0 &&
            this.st.trocas % 6 === 0 &&
            this.questoes.podeMostrarDinamica("trocas", 2)
              ? Q_Contagem(
                  "trocas acumuladas",
                  this.st.trocas,
                  this.questoes.seed,
                  array.slice(),
                )
              : null;

          this.addFrame(frames, array, this.st, {
            trocando: [i, j],
            pivo: dir,
            subarray,
            linhasAtivas: [7],
            linhaSeta: 7,
            questao: qTrocaQuick,
          });
        }
      }
    }

    if (i + 1 !== dir) {
      this.st.trocas++;

      this.addFrame(frames, array, this.st, {
        trocando: [i + 1, dir],
        pivo: dir,
        subarray,
        linhasAtivas: [8],
        linhaSeta: 8,
      });
      [array[i + 1], array[dir]] = [array[dir], array[i + 1]];

      this.addFrame(frames, array, this.st, {
        trocando: [i + 1, dir],
        subarray,
        linhasAtivas: [8],
        linhaSeta: 8,
      });
    }

    return i + 1;
  }
}
