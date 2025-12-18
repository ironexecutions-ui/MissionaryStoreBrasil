import React from "react";
import "./produtoscard.css";

export default function ProdutoCard({ produto, abrirModalProduto }) {

    return (
        <div
            className="produto-card"
            onClick={() => abrirModalProduto(produto)}
        >
            <img
                src={produto.imagem_um}
                alt={produto.produto}
                className="produto-img"
            />

            <div className="produto-info">
                <h3 className="produto-nome">{produto.produto}</h3>
                <p className="produto-preco">
                    R$ {Number(produto.preco).toFixed(2)}
                </p>
            </div>
        </div>
    );
}
