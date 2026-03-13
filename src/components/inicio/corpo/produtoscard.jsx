import React, { useState } from "react";
import "./produtoscard.css";

export default function ProdutoCard({ produto, abrirModalProduto }) {

    const extensoes = ["webp", "jpg", "png"];
    const [indiceExtensao, setIndiceExtensao] = useState(0);
    const [usarImagemBanco, setUsarImagemBanco] = useState(false);
    const [falhouTudo, setFalhouTudo] = useState(false);

    const precoFormatado = Number(produto.preco).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    const nomeFormatado =
        produto.produto
            ? produto.produto.charAt(0).toUpperCase() + produto.produto.slice(1)
            : "";

    const caminhoLocal = `cards/${produto.id}.${extensoes[indiceExtensao]}`;
    const imagemBanco = produto.imagem_um;

    function tratarErroImagem() {
        if (!usarImagemBanco) {
            if (indiceExtensao < extensoes.length - 1) {
                setIndiceExtensao(indiceExtensao + 1);
            } else if (imagemBanco) {
                setUsarImagemBanco(true);
            } else {
                setFalhouTudo(true);
            }
        } else {
            setFalhouTudo(true);
        }
    }

    const srcFinal = usarImagemBanco ? imagemBanco : caminhoLocal;

    return (
        <div
            className="produto-card"
            onClick={() => abrirModalProduto(produto)}
        >

            <div className="produto-imagem-container">

                {!falhouTudo ? (
                    <img
                        src={srcFinal}
                        alt={nomeFormatado}
                        className="produto-imagem"
                        onError={tratarErroImagem}
                    />
                ) : (
                    <div className="produto-imagem-fallback">
                        Sem imagem
                    </div>
                )}

            </div>

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


            </div>
        </div>
    );
}
