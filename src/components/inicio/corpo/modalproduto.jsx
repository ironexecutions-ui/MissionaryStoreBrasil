import React from "react";
import "./modalproduto.css";
import { API_URL } from "../../../config";
import Frete from "./frete";
import ModalLogin from "../modals/modallogin";


export default function ModalProduto({ produto, fechar }) {

    const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");
    const estaLogado = !!usuario.id;

    const [quantos, setQuantos] = React.useState(1);
    const [loadingQuantos, setLoadingQuantos] = React.useState(true);
    const [calculandoFrete, setCalculandoFrete] = React.useState(false);
    const [opcaoSelecionada, setOpcaoSelecionada] = React.useState("");
    const [abrirLogin, setAbrirLogin] = React.useState(false);


    // Carregar quantidade real do banco quando abrir o modal
    React.useEffect(() => {
        async function carregar() {
            const resp = await fetch(`${API_URL}/processo/historico`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    usuario_id: usuario.id,
                    produto_id: produto.id
                })
            });

            // Agora buscar a quantidade
            const r = await fetch(`${API_URL}/processo/get`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    usuario_id: usuario.id,
                    produto_id: produto.id
                })
            });

            const json = await r.json();
            if (json.quantos) setQuantos(json.quantos);
            setLoadingQuantos(false);
        }

        carregar();
    }, []);

    React.useEffect(() => {
        // trava o scroll da página principal
        document.body.classList.add("modal-aberto");

        return () => {
            // libera o scroll ao fechar o modal
            document.body.classList.remove("modal-aberto");
        };
    }, []);

    // Enviar quantidade ao backend
    async function salvarQuantidade(novoValor) {
        setQuantos(novoValor);

        await fetch(`${API_URL}/processo/quantos`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                usuario_id: usuario.id,
                produto_id: produto.id,
                quantos: novoValor
            })
        });
    }


    // Botões de alteração
    function aumentar() {
        salvarQuantidade(quantos + 1);
    }

    function diminuir() {
        if (quantos > 1) salvarQuantidade(quantos - 1);
    }

    function aumentar5() {
        salvarQuantidade(quantos + 5);
    }


    async function enviarHistorico() {
        if (!usuario.id) return;

        await fetch(`${API_URL}/processo/historico`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                usuario_id: usuario.id,
                produto_id: produto.id
            })
        });
    }

    async function adicionarCarrinho() {
        if (!usuario.id) return;

        animarCarta(); // dispara a animação

        await fetch(`${API_URL}/processo/carrinho`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                usuario_id: usuario.id,
                produto_id: produto.id
            })
        });
    }

    function animarCarta() {
        const carta = document.createElement("div");
        carta.className = "carta-animada";
        carta.innerText = "✓";

        // posição inicial no centro do modal
        carta.style.left = "50%";
        carta.style.top = "50%";
        carta.style.transform = "translate(-50%, -50%)";

        document.body.appendChild(carta);

        setTimeout(() => {
            carta.remove();
        }, 800);
    }

    async function marcarComprado() {
        if (!usuario.id) return;

        await fetch(`${API_URL}/processo/comprado`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                usuario_id: usuario.id,
                produto_id: produto.id
            })
        });
    }
    async function comprarAgora() {

        // NÃO está logado
        if (!usuario.id) {

            // salva intenção de compra
            localStorage.setItem("compra_pendente", JSON.stringify({
                produto_id: produto.id,
                quantidade: quantos,
                opcao: opcaoSelecionada
            }));

            setAbrirLogin(true);
            return;
        }

        // fluxo normal quando está logado
        const resp = await fetch(`${API_URL}/processo/comprar`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                produto_id: produto.id,
                quantidade: quantos
            })
        });

        const json = await resp.json();

        if (json.link_pagamento) {
            window.location.href = json.link_pagamento;
        }
    }



    // Envia histórico assim que abrir o modal
    React.useEffect(() => {
        enviarHistorico();
    }, []);

    const imagens = [
        produto.imagem_um,
        produto.imagem_dois,
        produto.imagem_tres,
        produto.imagem_quatro
    ].filter(img => img);

    return (
        <div className="modal-overlay" onClick={fechar}>
            <div className="modal-produto" onClick={e => e.stopPropagation()}>

                <button className="btn-ffechar" onClick={fechar}>
                    fechar
                </button>
                <br />
                <div className="modal-imagens">
                    {imagens.map((img, i) => (
                        <img key={i} src={img} className="imagem-item" />
                    ))}
                </div>

                <h2 className="modal-nome">{produto.produto}</h2>

                <p className="modal-preco">R$ {Number(produto.preco).toFixed(2)}</p>

                <p className="modal-desc">{produto.descricao}</p>

                <ul className="modal-caracts">
                    {produto.caracteristicas
                        .split(";")
                        .map((c, i) => (
                            <li key={i}>{c}</li>
                        ))
                    }
                </ul>
                {estaLogado && (
                    <>
                        {loadingQuantos ? (
                            <div className="quantidade-loading">
                                <div className="loader-line"></div>
                            </div>
                        ) : (
                            <div className="quantidade-box">

                                <h3>Quantidade</h3>

                                <div className="quantidade-controle">
                                    <button onClick={diminuir} className="q-btn">−</button>
                                    <div className="quantidade-numero">{quantos}</div>
                                    <button onClick={aumentar} className="q-btn">+</button>
                                    <button onClick={aumentar5} className="q-btn">+5</button>
                                </div>

                                <Frete
                                    preco={produto.preco}
                                    quantidade={quantos}
                                    usuario={usuario}
                                    produtoId={produto.id}
                                    setCalculandoFrete={setCalculandoFrete}
                                />

                            </div>
                        )}
                    </>
                )}


                {!estaLogado && (
                    <p className="msg-login-info">
                        Ao clicar em <strong>Comprar</strong>, você será direcionado para o login.
                        Após entrar, o produto <strong>{produto.produto}</strong> ficará salvo no seu carrinho.
                    </p>
                )}

                <div className="modal-botoes">
                    <button
                        className="btn-comprar"
                        onClick={comprarAgora}
                        disabled={
                            loadingQuantos ||
                            calculandoFrete ||
                            !produto.id
                        }
                    >
                        {!estaLogado
                            ? "Fazer login para comprar"
                            : calculandoFrete
                                ? "Calculando frete..."
                                : "Comprar"
                        }
                    </button>

                    {estaLogado && (
                        <button
                            className="btn-carrinho"
                            onClick={adicionarCarrinho}
                            disabled={loadingQuantos}
                        >
                            Adicionar ao carrinho
                        </button>
                    )}


                </div>

            </div>
            {abrirLogin && (
                <ModalLogin fechar={() => setAbrirLogin(false)} />
            )}

        </div>
    );
}
