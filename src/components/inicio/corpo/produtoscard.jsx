import React, { useState } from "react";
import "./produtoscard.css";

// importa todas as imagens da pasta cards
const imagens = import.meta.glob("./cards/*.{png,jpg,webp}", {
    eager: true,
    import: "default"
});

export default function ProdutoCard({ produto, abrirModalProduto }) {

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

    // procura automaticamente a imagem correta do produto
    const chaveImagem = Object.keys(imagens).find((caminho) =>
        caminho.includes(`/cards/${produto.id}.`)
    );

    const caminhoLocal = chaveImagem ? imagens[chaveImagem] : null;

    const imagemBanco = produto.imagem_um;

    function tratarErroImagem() {

        if (!usarImagemBanco && imagemBanco) {
            setUsarImagemBanco(true);
            return;
        }

        setFalhouTudo(true);
    }

    const srcFinal = usarImagemBanco ? imagemBanco : caminhoLocal;

    return (
        <div
            className="produto-card"
            onClick={() => abrirModalProduto(produto)}
        >

            <div className="produto-imagem-container">

                {!falhouTudo && srcFinal ? (
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