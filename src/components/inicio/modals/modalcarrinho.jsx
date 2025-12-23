import React, { useEffect, useState, useCallback, useRef } from "react";
import "./modalcarrinho.css";
import { API_URL } from "../../../config";
import CarrinhoProduto from "./carrinhoproduto";

export default function ModalCarrinho({ fechar }) {

    const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");
    const [localEntrega, setLocalEntrega] = useState("");
    const [dataReceber, setDataReceber] = useState("");
    const [endereco, setEndereco] = useState(null);
    const [calculandoFrete, setCalculandoFrete] = useState(false);

    const [lista, setLista] = useState([]);
    const [produtoSelecionado, setProdutoSelecionado] = useState(null);
    const [loading, setLoading] = useState(true);
    const [largura, setLargura] = useState(window.innerWidth);

    const [frete, setFrete] = useState(0);
    const [subtotal, setSubtotal] = useState(0);
    const [total, setTotal] = useState(0);

    const primeiraCarga = useRef(true);

    /* ===============================
       RESPONSIVO
    =============================== */
    useEffect(() => {
        const mudar = () => setLargura(window.innerWidth);
        window.addEventListener("resize", mudar);
        return () => window.removeEventListener("resize", mudar);
    }, []);
    useEffect(() => {
        async function carregarEndereco() {
            if (!usuario?.id) return;

            const r = await fetch(`${API_URL}/usuario/endereco`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ usuario_id: usuario.id })
            });

            const json = await r.json();
            if (json.ok) {
                setEndereco(json.endereco);
            }
        }

        carregarEndereco();
    }, [usuario.id]);

    function enderecoValido() {
        if (!endereco) return false;
        return endereco.cep && endereco.rua && endereco.numero && endereco.cidade && endereco.estado;
    }

    function enderecoFormatado() {
        if (!endereco) return "";
        return `${endereco.rua}, ${endereco.numero} - ${endereco.bairro}, ${endereco.cidade}/${endereco.estado} • ${endereco.cep}`;
    }

    /* ===============================
       SUBTOTAL
    =============================== */
    useEffect(() => {
        let soma = 0;
        lista.forEach(p => {
            soma += Number(p.preco) * Number(p.quantos);
        });
        setSubtotal(soma);
    }, [lista]);

    /* ===============================
       TOTAL FINAL
    =============================== */
    useEffect(() => {
        const totalFinal = subtotal + frete;
        setTotal(totalFinal);
    }, [subtotal, frete]);

    /* ===============================
       ATUALIZAR QUANTIDADE LOCAL
    =============================== */
    function atualizarQuantidadeLocal(processo_id, novoValor) {
        setLista(prev =>
            prev.map(item =>
                item.processo_id === processo_id
                    ? { ...item, quantos: novoValor }
                    : item
            )
        );
    }

    /* ===============================
       CARREGAR CARRINHO
    =============================== */
    const atualizarLista = useCallback(async () => {
        const resp = await fetch(`${API_URL}/processo/carrinho/listar`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ usuario_id: usuario.id })
        });

        const json = await resp.json();
        const produtos = json.produtos || [];

        setLista(produtos);

        if (
            primeiraCarga.current &&
            produtos.length > 0 &&
            window.innerWidth > 900
        ) {
            setProdutoSelecionado(produtos[0]);
            primeiraCarga.current = false;
        }


        setLoading(false);
    }, [usuario.id]);

    useEffect(() => {
        atualizarLista();
    }, [atualizarLista]);

    /* ===============================
       SINCRONIZAR PRODUTO SELECIONADO
    =============================== */
    useEffect(() => {
        if (!produtoSelecionado) return;

        const atualizado = lista.find(
            p => p.processo_id === produtoSelecionado.processo_id
        );

        if (atualizado) {
            setProdutoSelecionado(atualizado);
        }
    }, [lista]);

    /* ===============================
       CALCULAR FRETE DO CARRINHO
    =============================== */
    useEffect(() => {
        if (!lista.length) return;
        if (localEntrega !== "0") {
            setFrete(0);
            return;
        }
        if (!enderecoValido()) return;

        async function calcularFreteCarrinho() {
            setCalculandoFrete(true);

            const itens = lista.map(p => ({
                produto_id: p.produto_id,
                quantidade: p.quantos
            }));

            const r = await fetch(`${API_URL}/frete/calcular-carrinho`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    cep: endereco.cep,
                    itens
                })
            });

            const json = await r.json();

            if (json.ok) {
                const freteBase = Number(json.frete);

                const adicional = Math.floor(freteBase / 10) * 1.5;

                setFrete(freteBase + adicional);
            } else {
                setFrete(0);
            }


            setCalculandoFrete(false);
        }


        calcularFreteCarrinho();
    }, [lista, localEntrega, endereco]);


    function dataMinima() {
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);
        return hoje.toISOString().split("T")[0];
    }

    function validarData(valor) {
        const data = new Date(valor + "T00:00:00");
        const diaSemana = data.getDay(); // 0 domingo | 6 sábado

        if (diaSemana === 0 || diaSemana === 6) {
            alert("Não é possível escolher sábado ou domingo");
            setDataReceber("");
            return;
        }

        setDataReceber(valor);
    }

    /* ===============================
       REMOVER ITEM
    =============================== */
    async function removerItem(id) {
        await fetch(`${API_URL}/processo/carrinho/remover`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ processo_id: id })
        });

        atualizarLista();
    }
    async function comprarTudo() {

        let recebe = 0;
        if (localEntrega === "1") recebe = 1;
        if (localEntrega === "2") recebe = 2;

        if ((recebe === 1 || recebe === 2) && !dataReceber) {
            alert("Selecione a data para retirada");
            return;
        }

        const resp = await fetch(`${API_URL}/checkout/finalizar`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                usuario_id: usuario.id,
                frete,
                recebe,
                modo: "real"
            })
        });

        const json = await resp.json();

        if (!json.ok || !json.link_pagamento) {
            alert("Erro ao iniciar pagamento");
            return;
        }

        window.location.href = json.link_pagamento;
    }



    /* ===============================
       LOADING
    =============================== */
    if (loading) {
        return (
            <div className="carrinho-container">
                <div className="modal-carrinho-loading">
                    <div className="loader-ring"></div>
                </div>
            </div>
        );
    }
    const produtosSemCaracteristica = lista.filter(
        p =>
            p.caracteristicas &&
            p.caracteristicas.trim() !== "" &&
            (!p.carateristica || p.carateristica.trim() === "")
    );

    const compraBloqueada =
        lista.length === 0 ||
        !localEntrega ||
        calculandoFrete ||
        produtosSemCaracteristica.length > 0 ||
        ((localEntrega === "1" || localEntrega === "2") && !dataReceber);
    function atualizarCaracteristicaLocal(processo_id, caracteristica) {
        setLista(prev =>
            prev.map(item =>
                item.processo_id === processo_id
                    ? { ...item, carateristica: caracteristica }
                    : item
            )
        );
    }


    async function comprarTudoTeste() {

        let recebe = 0;
        if (localEntrega === "1") recebe = 1;
        if (localEntrega === "2") recebe = 2;

        if ((recebe === 1 || recebe === 2) && !dataReceber) {
            alert("Selecione a data para retirada");
            return;
        }

        const resp = await fetch(`${API_URL}/checkout/finalizar`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                usuario_id: usuario.id,
                frete,
                recebe,
                modo: "teste"
            })
        });

        const json = await resp.json();

        if (!json.ok) {
            alert("Erro na compra de teste");
            return;
        }

        alert(`Compra teste realizada.`);
        fechar();
    }



    return (
        <div className="carrinho-container">

            <div className="carrinho-conteudo">

                <div className="carrinho-lista">

                    {lista.length === 0 && (
                        <p className="carrinho-vazio">Seu carrinho está vazio</p>
                    )}

                    {lista.map(item => (
                        <div
                            key={item.processo_id}
                            className={`carrinho-item ${produtoSelecionado?.processo_id === item.processo_id ? "ativo" : ""}`}
                            onClick={() => setProdutoSelecionado(item)}
                        >
                            <img src={item.imagem_um} className="carrinho-img" />

                            <div className="carrinho-info">
                                <p>{item.produto}</p>

                                <span>Qtd: {item.quantos}</span>

                                {item.carateristica && item.carateristica.trim() !== "" && (
                                    <span className="carrinho-caracteristica">
                                        {item.carateristica}
                                    </span>
                                )}
                                {item.caracteristicas &&
                                    item.caracteristicas.trim() !== "" &&
                                    (!item.carateristica || item.carateristica.trim() === "") && (
                                        <span className="carrinho-alerta-caracteristica">
                                            Escolha uma característica para continuar
                                        </span>
                                    )}

                                <span>R$ {(item.preco * item.quantos).toFixed(2)}</span>
                            </div>


                            <button
                                className="btn-remover"
                                onClick={e => {
                                    e.stopPropagation();
                                    removerItem(item.processo_id);
                                }}
                            >
                                Remover
                            </button>
                        </div>
                    ))}

                    {lista.length > 0 && (
                        <div className="carrinho-total-box">

                            <p className="resumo-subtotal">
                                Subtotal: R$ {subtotal.toFixed(2)}
                            </p>

                            <p className="resumo-frete">
                                Valor de entrega: {calculandoFrete ? "Calculando..." : `R$ ${frete.toFixed(2)}`}
                            </p>


                            <div className="frete-entrega">
                                <label className="frete-label">
                                    Onde deseja receber?
                                </label>

                                <select
                                    className="frete-select"
                                    value={localEntrega}
                                    onChange={e => {
                                        setLocalEntrega(e.target.value);
                                        setDataReceber("");
                                    }}
                                >
                                    <option value="">Selecione</option>

                                    <option value="0" disabled={!enderecoValido()}>
                                        {enderecoValido()
                                            ? enderecoFormatado()
                                            : "Seu endereço (cadastre um endereço)"}
                                    </option>

                                    <option value="1">
                                        Centro de Treinamento Missionário
                                    </option>

                                    <option value="2">
                                        Loja Missionary Store (ao lado do CTM)
                                    </option>
                                </select>
                            </div>

                            {(localEntrega === "1" || localEntrega === "2") && (
                                <div className="frete-data">
                                    <label className="frete-label">
                                        Data para retirar
                                    </label>

                                    <input style={{ width: "90%" }}
                                        className="frete-input-date"
                                        type="date"
                                        value={dataReceber}
                                        min={dataMinima()}
                                        onChange={e => validarData(e.target.value)}
                                    />
                                </div>
                            )}


                            <p className="resumo-total">
                                Total: R$ {total.toFixed(2)}
                            </p>
                            {produtosSemCaracteristica.length > 0 && (
                                <p className="aviso-global-caracteristica">
                                    Alguns produtos precisam de uma característica selecionada
                                </p>
                            )}

                            <button
                                className="btn-comprar-tudo"
                                onClick={comprarTudo}
                                disabled={compraBloqueada}
                            >
                                Comprar tudo
                            </button>
                            <button
                                className="btn-comprar-tudo btn-teste"
                                onClick={comprarTudoTeste}
                            >
                                Comprar (teste)
                            </button>

                        </div>
                    )}

                </div>

                {largura > 900 && produtoSelecionado && (
                    <div className="carrinho-detalhes">
                        <CarrinhoProduto
                            produto={produtoSelecionado}
                            atualizarQuantidadeLocal={atualizarQuantidadeLocal}
                            atualizarCaracteristicaLocal={atualizarCaracteristicaLocal}
                            fechar={() => setProdutoSelecionado(null)}
                        />

                    </div>
                )}
            </div>

            {largura <= 900 && produtoSelecionado && (
                <div className="modal-overlay" onClick={() => setProdutoSelecionado(null)}>
                    <div className="modal-produto" onClick={e => e.stopPropagation()}>
                        <CarrinhoProduto
                            produto={produtoSelecionado}
                            atualizarQuantidadeLocal={atualizarQuantidadeLocal}
                            fechar={() => setProdutoSelecionado(null)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
