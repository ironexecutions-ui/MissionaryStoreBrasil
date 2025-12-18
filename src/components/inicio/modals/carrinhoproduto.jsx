import React, { useEffect, useState } from "react";
import { API_URL } from "../../../config";
import "./carrinhoproduto.css";
import QuantidadeControle from "./qtd";

export default function CarrinhoProduto({ produto, atualizarQuantidadeLocal, fechar }) {

    const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");

    const [quantos, setQuantos] = useState(produto.quantos);
    const [loadingQuantos, setLoadingQuantos] = useState(false);

    // RESETAR QUANTIDADE ao trocar de produto
    useEffect(() => {
        setQuantos(produto.quantos);
    }, [produto]);

    // Enviar quantidade ao backend e atualizar localmente
    async function salvarQuantidade(novoValor) {
        setQuantos(novoValor);
        setLoadingQuantos(true);

        await fetch(`${API_URL}/processo/quantos`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                processo_id: produto.processo_id,
                usuario_id: usuario.id,
                produto_id: produto.produto_id,
                quantos: novoValor
            })
        });

        setLoadingQuantos(false);

        atualizarQuantidadeLocal(produto.processo_id, novoValor);
    }

    function aumentar() {
        salvarQuantidade(quantos + 1);
    }

    function diminuir() {
        if (quantos > 1) salvarQuantidade(quantos - 1);
    }

    function aumentar5() {
        salvarQuantidade(quantos + 5);
    }

    const imagens = [
        produto.imagem_um,
        produto.imagem_dois,
        produto.imagem_tres,
        produto.imagem_quatro
    ].filter(img => img);

    return (
        <div className="carrinho-produto-box">

            {fechar && (
                <button className="carrinho-prod-fechar" onClick={fechar}>
                    fechar
                </button>
            )}

            <div className="carrinho-prod-imgs">
                {imagens.map((img, i) => (
                    <img key={i} src={img} className="carrinho-prod-img" />
                ))}
            </div>

            <h2 className="carrinho-prod-nome">{produto.produto}</h2>

            <p className="carrinho-prod-preco">
                Preço unitário: R$ {Number(produto.preco).toFixed(2)}
            </p>

            <p className="carrinho-prod-desc">{produto.descricao}</p>

            <ul className="carrinho-prod-caracts">
                {(produto.caracteristicas || "")
                    .split(";")
                    .map((c, i) => <li key={i}>{c}</li>)}
            </ul>

            <div className="quantidade-box2">

                <h3>Quantidade</h3>

                <QuantidadeControle
                    quantos={quantos}
                    loading={loadingQuantos}
                    aumentar={aumentar}
                    diminuir={diminuir}
                    aumentar5={aumentar5}
                />

                <p className="total-preco2">
                    Total deste item: R$ {(Number(produto.preco) * quantos).toFixed(2)}
                </p>

            </div>

        </div>
    );
}
