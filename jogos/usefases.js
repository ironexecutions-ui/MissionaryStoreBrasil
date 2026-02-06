import { useEffect, useRef, useState } from "react";
import { API_URL } from "../src/config";

export function useFases({
    fase,
    setFase,
    perguntas,
    indiceAtual,
    setIndiceAtual,
    pontos,
    setTempo,
    setRespondido,
    setCodigo,
    setPerguntas,
    setPontos,
    setIdsUsados,
    codigo
}) {
    const timerPerguntaRef = useRef(null);
    const timerFaseRef = useRef(null);
    const timerIniciadoRef = useRef(false);
    const [contador, setContador] = useState(0);

    /* =========================
       TIMER DA PERGUNTA
    ========================= */
    function iniciarTimerPergunta() {
        clearInterval(timerPerguntaRef.current);

        // tempo inicial visível
        setTempo(15);

        timerPerguntaRef.current = setInterval(() => {
            setTempo(t => {
                if (t <= 1) {
                    clearInterval(timerPerguntaRef.current);
                    timerIniciadoRef.current = false;
                    avancar();
                    return 0;
                }
                return t - 1;
            });
        }, 1000);
    }

    /* =========================
       DISPARO DO TIMER (PÓS-RENDER)
    ========================= */
    useEffect(() => {
        if (
            fase === "jogando" &&
            perguntas.length > 0 &&
            !timerIniciadoRef.current
        ) {
            timerIniciadoRef.current = true;
            iniciarTimerPergunta();
        }
    }, [fase, indiceAtual, perguntas]);

    /* =========================
       PREPARAÇÃO
    ========================= */
    function iniciarPreparacao(q, montarJogo) {
        clearInterval(timerFaseRef.current);
        clearInterval(timerPerguntaRef.current);
        timerIniciadoRef.current = false;

        setFase("preparando");
        setContador(5);

        timerFaseRef.current = setInterval(() => {
            setContador(c => {
                if (c <= 1) {
                    clearInterval(timerFaseRef.current);

                    montarJogo(q);
                    setIndiceAtual(0);
                    setRespondido(false);
                    setFase("jogando");

                    return 0;
                }
                return c - 1;
            });
        }, 1000);
    }

    /* =========================
       AVANÇAR
    ========================= */
    function avancar(pontosFinais = pontos) {
        clearInterval(timerPerguntaRef.current);
        timerIniciadoRef.current = false;

        if (indiceAtual + 1 < perguntas.length) {
            setFase("intervalo");
            setContador(3);

            clearInterval(timerFaseRef.current);
            timerFaseRef.current = setInterval(() => {
                setContador(c => {
                    if (c <= 1) {
                        clearInterval(timerFaseRef.current);

                        setIndiceAtual(i => i + 1);
                        setRespondido(false);
                        setFase("jogando");

                        return 0;
                    }
                    return c - 1;
                });
            }, 1000);
        } else {
            finalizarJogo(pontosFinais);
        }
    }

    /* =========================
       FINALIZAR
    ========================= */
    async function finalizarJogo(pontosFinais) {
        clearInterval(timerPerguntaRef.current);
        timerIniciadoRef.current = false;
        setFase("final");

        await fetch(`${API_URL}/jogos/msb/pontos`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ codigo, pontos: pontosFinais })
        });

        setTimeout(() => {
            window.location.reload();
        }, 10000);
    }

    function resetarSistema() {
        clearInterval(timerPerguntaRef.current);
        clearInterval(timerFaseRef.current);
        timerIniciadoRef.current = false;

        setCodigo("");
        setPerguntas([]);
        setIndiceAtual(0);
        setPontos(0);
        setIdsUsados([]);
        setFase("codigo");
    }

    return { iniciarPreparacao, avancar, contador };
}
