import React from "react";
import "./produtoscard.css";

export default function ProdutoCard({ produto, abrirModalProduto }) {
    const precoFormatado = Number(produto.preco).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    const nomeFormatado =
        produto.produto
            ? produto.produto.charAt(0).toUpperCase() + produto.produto.slice(1)
            : "";

    return (
        <div
            className="produto-card"
            onClick={() => abrirModalProduto(produto)}
        >
            <div className="produto-info">
                <span className="produto-categoria">
                    Disponível para compra
                </span>

                <h3 className="produto-nome">
                    {nomeFormatado}
                </h3>

                <p className="produto-preco">
                    {precoFormatado}
                </p>

                <span className="produto-detalhes">
                    Visualizar informações do produto
                </span>
            </div>
        </div>
    );
}
