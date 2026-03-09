import { useEffect, useState } from "react";
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

    const [produto, setProduto] = useState(null);

    function handleCodigo(valor) {

        const limpo = valor
            .toUpperCase()
            .replace(/[^A-Z0-9]/g, "");

        setCodigo(limpo);
        setFase("codigo");

        if (limpo.length > 4) {
            buscarProduto(limpo);
        }

        if (limpo.length === 4 || limpo === "CTM") {
            verificarCodigo(limpo);
        }

    }

    async function buscarProduto(codigo) {

        try {

            const r = await fetch(
                `${API_URL}/jogos/msb/produto?codigo=${codigo}`
            );

            const res = await r.json();

            if (res.existe) {
                setProduto(res);
                setFase("produto");
            }

        } catch { }

    }

    async function verificarCodigo(codigoDigitado) {

        if (codigoDigitado === "CTM") {

            setTutorial(true);
            setQuantos(1);
            setErroCodigo(false);
            setPontos(0);
            setFase("idioma");
            return;

        }

        try {

            const r = await fetch(
                `${API_URL}/jogos/msb/verificar?codigo=${codigoDigitado}`
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

    return { handleCodigo, produto };

}