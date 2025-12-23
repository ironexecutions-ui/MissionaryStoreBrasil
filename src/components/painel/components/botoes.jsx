import React from "react";
import "./botoes.css";

export default function Botoes({ onSelect }) {
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

        </aside>
    );
}
