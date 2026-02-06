// usetecladoidioma.js
import { useEffect, useState } from "react";

export function useTecladoIdioma({ fase, onSelecionar }) {
    const [idiomaFocado, setIdiomaFocado] = useState(0);

    // reset ao entrar na fase
    useEffect(() => {
        if (fase === "idioma") {
            setIdiomaFocado(0);
        }
    }, [fase]);

    useEffect(() => {
        if (fase !== "idioma") return;

        function onKey(e) {
            if (
                ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Enter"].includes(e.key)
            ) {
                e.preventDefault();
            }

            if (e.key === "ArrowRight" || e.key === "ArrowDown") {
                setIdiomaFocado(i => (i + 1) % 4);
            }

            if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
                setIdiomaFocado(i => (i + 3) % 4);
            }

            if (e.key === "Enter") {
                onSelecionar(idiomaFocado);
            }
        }

        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [fase, idiomaFocado, onSelecionar]);

    return idiomaFocado;
}
