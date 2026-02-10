import { useEffect } from "react";
import { API_URL } from "../src/config";

export function useCodigo({
    codigo,
    setCodigo,
    setQuantos,
    setFase,
    setErroCodigo,
    setPontos,
    setTutorial
}) {

    function handleCodigo(valor) {
        const limpo = valor
            .toUpperCase()
            .replace(/[^A-Z0-9]/g, "")
            .slice(0, 4);

        setCodigo(limpo);
        setFase("codigo");
    }

    useEffect(() => {
        if (codigo.length === 4 || codigo === "CTM") {
            verificarCodigo();
        }

    }, [codigo]);

    async function verificarCodigo() {

        /* ======== MODO TUTORIAL ======== */
        if (codigo === "CTM") {
            setTutorial(true);
            setQuantos(1); // 1 x 3 perguntas
            setErroCodigo(false);
            setPontos(0);
            setFase("idioma");
            return;
        }

        /* ======== JOGO NORMAL ======== */
        try {
            const r = await fetch(
                `${API_URL}/jogos/msb/verificar?codigo=${codigo}`
            );
            const res = await r.json();

            if (!res.existe) {
                setErroCodigo(true);
                setTimeout(() => setErroCodigo(false), 500);
                return;
            }

            if (res.pontos > 0) {
                setQuantos(0);
                setErroCodigo(false);
                setPontos(res.pontos);
                setFase("ja_usado");
                return;
            }

            setTutorial(false);
            setQuantos(res.quantos);
            setFase("idioma");

        } catch {
            setErroCodigo(true);
            setTimeout(() => setErroCodigo(false), 500);
        }
    }

    return { handleCodigo };
}
