import { useEffect, useRef } from "react";

export function useInputFoco(fase) {
    const ref = useRef(null);

    useEffect(() => {
        if (fase !== "codigo") return;

        function forcarFoco() {
            if (ref.current) {
                ref.current.focus();
            }
        }

        // foca ao entrar na fase
        forcarFoco();

        // força foco ao clicar em qualquer lugar
        window.addEventListener("mousedown", forcarFoco);
        window.addEventListener("keydown", forcarFoco);

        return () => {
            window.removeEventListener("mousedown", forcarFoco);
            window.removeEventListener("keydown", forcarFoco);
        };
    }, [fase]);

    return ref;
}
