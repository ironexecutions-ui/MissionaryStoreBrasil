import React, { useEffect, useState, useRef } from "react";
import ProdutoCard from "./produtoscard";
import "./listacategoria.css";
import { API_URL } from "../../../config";
import MenuCategoriasVertical from "./menucategoriasvertical";

export default function ListaCategorias({
    produtos,
    abrirModalProduto,
    produtosFiltrados,
    filtroAtivo,
    setFiltroAtivo,
    setProdutosFiltrados
}) {


    const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");

    const [loading, setLoading] = useState(true);
    const [interesse, setInteresse] = useState([]);
    const [categoriaAtiva, setCategoriaAtiva] = useState("Do seu interesse");
    const [isMobile, setIsMobile] = useState(false);
    const [quantidadeVisivel, setQuantidadeVisivel] = useState(0);
    const [categoriasOrganizadas, setCategoriasOrganizadas] = useState({});

    const observerRef = useRef(null);

    /* ===============================
       DETECTAR MOBILE
    =============================== */
    useEffect(() => {
        function verificar() {
            setIsMobile(window.innerWidth <= 768);
        }
        verificar();
        window.addEventListener("resize", verificar);
        return () => window.removeEventListener("resize", verificar);
    }, []);

    /* ===============================
       DEFINIR LIMITE INICIAL
    =============================== */
    useEffect(() => {
        const limiteInicial = isMobile ? 3 : 9;
        setQuantidadeVisivel(limiteInicial);
    }, [isMobile, categoriaAtiva, filtroAtivo]);


    /* ===============================
       SHUFFLE
    =============================== */
    function shuffleArray(array) {
        const arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    /* ===============================
       CARREGAR INTERESSE
    =============================== */
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
    }, [usuario.id]);

    /* ===============================
       FILTRAR PRODUTOS VÁLIDOS
    =============================== */
    function produtoTemMedidas(p) {
        return [p.peso, p.altura, p.largura, p.comprimento].some(
            v => v !== null && v !== undefined && v !== "" && Number(v) > 0
        );
    }

    const produtosValidos = produtos.filter(
        p => p.apagado !== 1 && produtoTemMedidas(p)
    );

    /* ===============================
       AGRUPAR POR CATEGORIA
    =============================== */
    useEffect(() => {
        if (produtosValidos.length === 0) return;

        const agrupadas = {};

        produtosValidos.forEach(p => {
            if (!agrupadas[p.categoria]) agrupadas[p.categoria] = [];
            agrupadas[p.categoria].push(p);
        });

        const embaralhadas = {};
        Object.keys(agrupadas).forEach(cat => {
            embaralhadas[cat] = shuffleArray(agrupadas[cat]);
        });

        setCategoriasOrganizadas(embaralhadas);
    }, [produtos]);

    /* ===============================
       INTERESSE ÚNICO
    =============================== */
    const interesseUnico = Object.values(
        interesse.reduce((acc, p) => {
            const chave = `${p.produto}-${p.preco}`;
            if (!acc[chave] || p.id > acc[chave].id) {
                acc[chave] = p;
            }
            return acc;
        }, {})
    );

    /* ===============================
       PRODUTOS ATIVOS
    =============================== */
    let produtosCategoria = [];

    if (filtroAtivo && produtosFiltrados) {
        produtosCategoria = produtosFiltrados;
    } else if (categoriaAtiva === "Do seu interesse") {
        produtosCategoria = interesseUnico;
    } else {
        produtosCategoria = categoriasOrganizadas[categoriaAtiva] || [];
    }



    const produtosRenderizados = produtosCategoria.slice(0, quantidadeVisivel);

    /* ===============================
       LAZY LOAD
    =============================== */
    useEffect(() => {
        if (!observerRef.current) return;

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setQuantidadeVisivel(prev => {
                        const incremento = isMobile ? 3 : 9;
                        return Math.min(prev + incremento, produtosCategoria.length);
                    });
                }
            });
        }, { threshold: 1 });

        observer.observe(observerRef.current);
        return () => observer.disconnect();

    }, [categoriaAtiva, filtroAtivo, isMobile, produtosCategoria.length]);

    if (loading) {
        return (
            <div className="categorias-loading">
                <div className="loader-ring"></div>
            </div>
        );
    }

    const categoriasFixas = [
        "Do seu interesse",
        "Geral",
        "Papelaria",
        "Adesivos",
        "Vestuario",
        "Sisteres Exclusiva",
        "Vestidos",
        "Chaveiros"
    ];

    return (
        <div className="layout-categorias">

            <MenuCategoriasVertical
                categorias={categoriasFixas}
                categoriaAtiva={categoriaAtiva}
                setCategoriaAtiva={setCategoriaAtiva}
                setFiltroAtivo={setFiltroAtivo}
                setProdutosFiltrados={setProdutosFiltrados}
            />



            <div className="conteudo-categoria">

                <h2 className="categoria-titulo">
                    {filtroAtivo ? filtroAtivo : categoriaAtiva}
                </h2>

                <div className="grid-produtos">

                    {produtosRenderizados.map(prod => (
                        <ProdutoCard
                            key={prod.id}
                            produto={prod}
                            abrirModalProduto={abrirModalProduto}
                        />
                    ))}

                </div>

                <div ref={observerRef} className="lazy-trigger" />

            </div>
        </div>
    );
}
