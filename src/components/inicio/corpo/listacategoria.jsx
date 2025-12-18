import React from "react";
import ProdutoCard from "./produtoscard";
import "./listacategoria.css";
import { API_URL } from "../../../config";

export default function ListaCategorias({ produtos, abrirModalProduto }) {

    const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");

    const [loading, setLoading] = React.useState(true);
    const [interesse, setInteresse] = React.useState([]);
    const [buscou, setBuscou] = React.useState(false);
    React.useEffect(() => {
        if (!loading) {
            setBuscou(true);
        }
    }, [produtos]);

    // Sempre começar a página no topo
    React.useEffect(() => {
        if (!loading) {
            window.scrollTo({ top: 0, behavior: "instant" });
        }
    }, [loading]);

    // Buscar produtos do interesse
    React.useEffect(() => {
        async function carregar() {

            if (usuario.id) {
                const resp = await fetch(`${API_URL}/produtos/interesse`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ usuario_id: usuario.id })
                });

                const json = await resp.json();

                // remove produtos apagados
                const filtrados = (json.produtos || []).filter(p => p.apagado !== 1);
                setInteresse(filtrados);
            }

            setLoading(false);
        }

        carregar();
    }, []);

    function produtoTemMedidas(p) {
        const campos = [p.peso, p.altura, p.largura, p.comprimento];

        return campos.some(v =>
            v !== null &&
            v !== undefined &&
            v !== "" &&
            Number(v) > 0
        );
    }

    // filtrar produtos apagados da lista principal
    const produtosVisiveis = produtos.filter(
        p => p.apagado !== 1 && produtoTemMedidas(p)
    );

    // Organizar categorias
    const categorias = {};
    produtosVisiveis.forEach(p => {
        if (!categorias[p.categoria]) categorias[p.categoria] = [];
        categorias[p.categoria].push(p);
    });

    const nenhumaCategoria =
        interesse.length === 0 && Object.keys(categorias).length === 0;

    // Loader
    if (loading) {
        return (
            <div className="categorias-loading">
                <div className="loader-ring"></div>
            </div>
        );
    }

    return (
        <div style={{ width: "100%" }} className="categorias-box">

            {buscou && nenhumaCategoria && (
                <div className="categoria-vazia">
                    <h2>Nenhum produto encontrado</h2>
                    <p>
                        Não encontramos produtos com os filtros selecionados.
                        Tente ajustar o nome, a categoria ou o preço.
                    </p>
                </div>
            )}

            {interesse.length > 0 && (
                <div className="categoria-grupo">
                    <h2 className="categoria-titulo">Do seu interesse</h2>

                    <div className="categoria-lista">
                        {interesse.map(prod => (
                            <ProdutoCard
                                key={prod.id}
                                produto={prod}
                                abrirModalProduto={abrirModalProduto}
                            />
                        ))}
                    </div>
                </div>
            )}

            {Object.keys(categorias).map(cat => (
                <div key={cat} className="categoria-grupo">
                    <h2 className="categoria-titulo">{cat}</h2>

                    <div className="categoria-lista">
                        {categorias[cat].map(p => (
                            <ProdutoCard
                                key={p.id}
                                produto={p}
                                abrirModalProduto={abrirModalProduto}
                            />
                        ))}
                    </div>
                </div>
            ))}

        </div>
    );
}
