import { useEffect } from "react";
import { API_URL } from "../src/config";

export function useCodigo({
    codigo,
    setCodigo,
    setQuantos,
    setFase,
    setErroCodigo,
    setPontos
}) {

    function handleCodigo(valor) {
        const limpo = valor.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 4);
        setCodigo(limpo);
        setFase("codigo");
    }

    useEffect(() => {
        if (codigo.length === 4) {
            verificarCodigo();
        }
    }, [codigo]);

    async function verificarCodigo() {
        try {
            const r = await fetch(`${API_URL}/jogos/msb/verificar?codigo=${codigo}`);
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


            setQuantos(res.quantos);
            setFase("idioma");
        } catch {
            setErroCodigo(true);
            setTimeout(() => setErroCodigo(false), 500);
        }
    }

    return { handleCodigo };
}
