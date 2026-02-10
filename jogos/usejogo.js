import { API_URL } from "../src/config";
import { useState } from "react";
import { tutorialPerguntas } from "./tutorialperguntas";

export function useJogo({
    perguntas,
    setPerguntas,
    indiceAtual,
    setIndiceAtual,
    pontos,
    setPontos,
    idsUsados,
    setIdsUsados,
    tempo,
    respondido,
    setRespondido,
    fase,
    avancar
}) {
    async function montarJogo(q, idiomaSelecionado, tutorial) {
        if (tutorial) {
            setPerguntas(tutorialPerguntas[idiomaSelecionado]);
            setIndiceAtual(0);
            return;
        }

        const total = q * 3;
        const porNivel = total / 3;
        let lista = [];

        await carregarPerguntas("facil", porNivel, lista, idiomaSelecionado);
        await carregarPerguntas("media", porNivel, lista, idiomaSelecionado);
        await carregarPerguntas("dificil", porNivel, lista, idiomaSelecionado);

        setPerguntas(lista);
        setIndiceAtual(0);
    }

    const [opcaoSelecionada, setOpcaoSelecionada] = useState(null);

    async function carregarPerguntas(dificuldade, qtd, lista, idiomaSelecionado) {
        for (let i = 0; i < qtd; i++) {
            const r = await fetch(
                `${API_URL}/jogos/msb/quiz?dificuldade=${dificuldade}&idioma=${idiomaSelecionado}&limit=1&excluir=${idsUsados.join(",")}`
            );

            const [p] = await r.json();
            if (!p) continue;

            lista.push(p);
            setIdsUsados(prev => [...prev, p.id]);
        }
    }

    function responder(opcao) {
        if (respondido || fase !== "jogando") return;

        const atual = perguntas[indiceAtual];
        let ganho = 0;

        setOpcaoSelecionada(opcao);

        if (opcao === atual.resposta) {
            if (atual.dificuldade === "facil") ganho = 3;
            if (atual.dificuldade === "media") ganho = 6;
            if (atual.dificuldade === "dificil") ganho = 9;
            ganho += Math.floor(tempo);
        }

        const totalAtual = pontos + ganho;
        setPontos(totalAtual);
        setRespondido(true);

        setTimeout(() => {
            setOpcaoSelecionada(null);
            avancar(totalAtual);
        }, 1000);
    }


    return { montarJogo, responder, opcaoSelecionada };
}
