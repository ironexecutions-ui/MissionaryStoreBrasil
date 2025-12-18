import React from "react";
import "./carrinhoproduto.css";

export default function ModalProdutoEntregue({ produto, fechar }) {

    const imagens = [
        produto.imagem_um,
        produto.imagem_dois,
        produto.imagem_tres,
        produto.imagem_quatro
    ].filter(img => img);

    return (
        <div className="modal-overlay" onClick={fechar}>
            <div className="modal-produto" onClick={e => e.stopPropagation()}>

                <button className="btn-fechar" onClick={fechar}>
                    fechar
                </button>

                <div className="modal-imagens">
                    {imagens.map((img, i) => (
                        <img key={i} src={img} className="imagem-item" />
                    ))}
                </div>

                <h2 className="modal-nome">{produto.produto}</h2>

                <p className="modal-preco">R$ {Number(produto.preco).toFixed(2)}</p>

                <p className="modal-desc">{produto.descricao}</p>

                <ul className="modal-caracts">
                    {(produto.caracteristicas || "")
                        .split(";")
                        .map((c, i) => <li key={i}>{c}</li>)}
                </ul>

                {/* QUANTIDADE SOMENTE VISUAL */}
                <div className="quantidade-box">
                    <p className="total-preco">
                        Quantidade: <strong>{produto.quantos}</strong>
                    </p>

                    <p className="total-preco">
                        Total: R$ {(Number(produto.preco) * produto.quantos).toFixed(2)}
                    </p>
                </div>

            </div>
        </div>
    );
}
