import React, { useRef, useEffect, useState } from "react";
import ProdutoCard from "./produtoscard";
import "./listacategoria.css";
import { API_URL } from "../../../config";

export default function ListaCategorias({ produtos, abrirModalProduto }) {

    const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");

    const [loading, setLoading] = useState(true);
    const [interesse, setInteresse] = useState([]);
    const [buscou, setBuscou] = useState(false);

    const [controleScroll, setControleScroll] = useState({});
    const listasRef = useRef({});

    useEffect(() => {
        if (!loading) setBuscou(true);
    }, [produtos, loading]);

    useEffect(() => {
        if (!loading) window.scrollTo({ top: 0, behavior: "instant" });
    }, [loading]);

    useEffect(() => {
        async function carregar() {
            if (usuario.id) {
                const resp = await fetch(`${API_URL}/produtos/interesse`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ usuario_id: usuario.id })
                });

                const json = await resp.json();
                const filtrados = (json.produtos || []).filter(p => p.apagado !== 1);
                setInteresse(filtrados);
            }
            setLoading(false);
        }
        carregar();
    }, []);

    function produtoTemMedidas(p) {
        return [p.peso, p.altura, p.largura, p.comprimento].some(
            v => v !== null && v !== undefined && v !== "" && Number(v) > 0
        );
    }

    const produtosVisiveis = produtos.filter(
        p => p.apagado !== 1 && produtoTemMedidas(p)
    );

    const categorias = {};
    produtosVisiveis.forEach(p => {
        if (!categorias[p.categoria]) categorias[p.categoria] = [];
        categorias[p.categoria].push(p);
    });

    const nenhumaCategoria =
        interesse.length === 0 && Object.keys(categorias).length === 0;

    if (loading) {
        return (
            <div className="categorias-loading">
                <div className="loader-ring"></div>
            </div>
        );
    }

    function atualizarBotoes(cat) {
        const el = listasRef.current[cat];
        if (!el) return;

        const podeEsquerda = el.scrollLeft > 0;
        const podeDireita = el.scrollLeft + el.clientWidth < el.scrollWidth - 1;

        setControleScroll(prev => ({
            ...prev,
            [cat]: {
                esquerda: podeEsquerda,
                direita: podeDireita
            }
        }));
    }

    function scroll(cat, direcao) {
        const el = listasRef.current[cat];
        if (!el) return;

        el.scrollBy({
            left: direcao === "direita" ? 320 : -320,
            behavior: "smooth"
        });

        setTimeout(() => atualizarBotoes(cat), 300);
    }

    function refLista(cat, el) {
        listasRef.current[cat] = el;
        if (el) requestAnimationFrame(() => atualizarBotoes(cat));
    }

    return (
        <div className="categorias-box">

            {buscou && nenhumaCategoria && (
                <div className="categoria-vazia">
                    <h2>Nenhum produto encontrado</h2>
                    <p>Não encontramos produtos com os filtros selecionados.</p>
                </div>
            )}

            {/* DO SEU INTERESSE */}
            {interesse.length > 0 && (
                <div className="categoria-grupo">
                    <h2 className="categoria-titulo">Do seu interesse</h2>

                    <div className="categoria-lista-wrapper">

                        {controleScroll["interesse"]?.esquerda && (
                            <button
                                className="scroll-btn esquerda"
                                onClick={() => scroll("interesse", "esquerda")}
                            >
                                ‹
                            </button>
                        )}

                        <div
                            className="categoria-lista"
                            ref={el => refLista("interesse", el)}
                            onScroll={() => atualizarBotoes("interesse")}
                        >
                            {interesse.map(prod => (
                                <ProdutoCard
                                    key={prod.id}
                                    produto={prod}
                                    abrirModalProduto={abrirModalProduto}
                                />
                            ))}
                        </div>

                        {controleScroll["interesse"]?.direita && (
                            <button
                                className="scroll-btn direita"
                                onClick={() => scroll("interesse", "direita")}
                            >
                                ›
                            </button>
                        )}

                    </div>
                </div>
            )}

            {/* CATEGORIAS */}
            {Object.keys(categorias).map(cat => (
                <div key={cat} className="categoria-grupo">
                    <h2 className="categoria-titulo">{cat}</h2>

                    <div className="categoria-lista-wrapper">

                        {controleScroll[cat]?.esquerda && (
                            <button
                                className="scroll-btn esquerda"
                                onClick={() => scroll(cat, "esquerda")}
                            >
                                ‹
                            </button>
                        )}

                        <div
                            className="categoria-lista"
                            ref={el => refLista(cat, el)}
                            onScroll={() => atualizarBotoes(cat)}
                        >
                            {categorias[cat].map(p => (
                                <ProdutoCard
                                    key={p.id}
                                    produto={p}
                                    abrirModalProduto={abrirModalProduto}
                                />
                            ))}
                        </div>

                        {controleScroll[cat]?.direita && (
                            <button
                                className="scroll-btn direita"
                                onClick={() => scroll(cat, "direita")}
                            >
                                ›
                            </button>
                        )}

                    </div>
                </div>
            ))}

        </div>
    );
}
