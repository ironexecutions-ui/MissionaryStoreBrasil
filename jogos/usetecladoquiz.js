import { useEffect, useState } from "react";

export function useTecladoQuiz({
    fase,
    respondido,
    indiceAtual,
    responder
}) {
    const [opcaoFocada, setOpcaoFocada] = useState(0);

    // reseta ao trocar pergunta
    useEffect(() => {
        if (fase === "jogando") {
            setOpcaoFocada(0);
        }
    }, [fase, indiceAtual]);

    useEffect(() => {
        if (fase !== "jogando" || respondido) return;

        function onKey(e) {
            // evita que o input consuma as teclas
            if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Enter"].includes(e.key)) {
                e.preventDefault();
            }

            if (e.key === "ArrowRight" || e.key === "ArrowDown") {
                setOpcaoFocada(o => (o + 1) % 4);
            }

            if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
                setOpcaoFocada(o => (o + 3) % 4);
            }

            if (e.key === "Enter") {
                const letra = ["a", "b", "c", "d"][opcaoFocada];
                responder(letra);
            }
        }

        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);

    }, [fase, respondido, opcaoFocada, responder]);

    return opcaoFocada;
}
