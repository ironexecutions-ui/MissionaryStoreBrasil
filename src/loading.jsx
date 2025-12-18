import { useEffect, useState } from "react";
import "./loading.css";

export default function TelaLoading() {

    const [mensagem, setMensagem] = useState(
        "Preparando estrutura inicial."
    );

    useEffect(() => {

        const timer1 = setTimeout(() => {
            setMensagem("Sincronizando dados essenciais.");
        }, 8000);

        const timer2 = setTimeout(() => {
            setMensagem("Processamento acima do normal, ajustando fluxo.");
        }, 20000);

        const timer3 = setTimeout(() => {
            setMensagem("Finalizando etapas críticas, obrigado por aguardar.");
        }, 35000);

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
            clearTimeout(timer3);
        };
    }, []);

    return (
        <div className="loading-global">
            <div className="loading-wrapper">

                <div className="tree-horizontal-loader">

                    {/* PRÉDIO AQUI */}
                    <div className="building"></div>

                    <div className="tree"></div>
                    <div className="line"></div>

                    <div className="person person1"></div>
                    <div className="person person2"></div>
                    <div className="person person3"></div>
                </div>

                <p className="loading-text">{mensagem}</p>
            </div>
        </div>
    );
}
