import React, { useEffect, useState } from "react";
import { API_URL } from "../../../config";
import "./botoes.css";

export default function Botoes({ onSelect }) {

    const [pendentes, setPendentes] = useState(0);

    useEffect(() => {
        carregarPendentes();
    }, []);

    async function carregarPendentes() {
        try {
            const resp = await fetch(`${API_URL}/sincronizar/pendentes`);
            const data = await resp.json();
            setPendentes(data.pendentes || 0);
        } catch {
            setPendentes(0);
        }
    }

    return (
        <aside className="botoes-lateral">

            <button onClick={() => onSelect("produtos")}>
                Produtos
            </button>

            <button onClick={() => onSelect("grafico")}>
                Gráfico
            </button>

            <button onClick={() => onSelect("mais_menos")}>
                Mais e menos vendidos
            </button>

            <button onClick={() => onSelect("conexoes")}>
                Conexões simultâneas
            </button>

            <button onClick={() => onSelect("pesquisas")}>
                Carrinhos ativos
            </button>

            <button onClick={() => onSelect("avaliacao")}>
                Avaliações
            </button>

            <button onClick={() => onSelect("sincronizar")}>
                Sincronizar
                {pendentes > 0 && (
                    <span className="badge-sincronizar">
                        {pendentes}
                    </span>
                )}
            </button>

        </aside>
    );
}
