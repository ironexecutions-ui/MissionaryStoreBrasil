import React, { useEffect, useState } from "react";
import ListaCategorias from "./corpo/listacategoria";
import ModalProduto from "./corpo/modalproduto";
import ModalFiltro from "./corpo/modalfiltro";
import { API_URL } from "../../config";
import "./corpo.css";

export default function Corpo({ abrirFiltro, setAbrirFiltro }) {

    const [produtos, setProdutos] = useState([]);
    const [produtoAberto, setProdutoAberto] = useState(null);
    const [produtosFiltrados, setProdutosFiltrados] = useState(null);
    const [filtroAtivo, setFiltroAtivo] = useState(null);

    useEffect(() => {
        async function carregar() {
            try {
                const resp = await fetch(`${API_URL}/produtos/raw`);
                const json = await resp.json();
                setProdutos(json.produtos || []);
            } catch (e) {
                console.log("Erro ao carregar produtos");
            }
        }
        carregar();
    }, []);

    return (
        <div className="corpo-box">

            <ListaCategorias
                produtos={produtos}
                abrirModalProduto={setProdutoAberto}
                produtosFiltrados={produtosFiltrados}
                filtroAtivo={filtroAtivo}
                setFiltroAtivo={setFiltroAtivo}
                setProdutosFiltrados={setProdutosFiltrados}
            />


            {produtoAberto && (
                <ModalProduto
                    produto={produtoAberto}
                    fechar={() => setProdutoAberto(null)}
                />
            )}

            {abrirFiltro && (
                <ModalFiltro
                    fechar={() => setAbrirFiltro(false)}
                    setProdutosFiltrados={setProdutosFiltrados}
                    setFiltroAtivo={setFiltroAtivo}
                />

            )}
        </div>
    );
}
