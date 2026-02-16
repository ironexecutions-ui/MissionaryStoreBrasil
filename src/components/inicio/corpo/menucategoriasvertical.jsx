import React, { useEffect, useRef, useState } from "react";
import "./menucategoriasvertical.css";

const ICONES = {
    "Do seu interesse": "❤️",
    "Geral": "📦",
    "Papelaria": "📚",
    "Adesivos": "🏷️",
    "Vestuario": "👕",
    "Sisteres Exclusiva": "🌸",
    "Vestidos": "👗",
    "Chaveiros": "🔑"
};

export default function MenuCategoriasVertical({
    categorias,
    categoriaAtiva,
    setCategoriaAtiva,
    setFiltroAtivo,
    setProdutosFiltrados   // 👈 adicionar isso
}) {

    const [oculto, setOculto] = useState(false);
    const [indiceMobile, setIndiceMobile] = useState(0);
    const timeoutRef = useRef(null);
    const intervaloRef = useRef(null);

    const isMobile = window.innerWidth < 768;

    /* ===============================
       CONTROLE DE SCROLL
    =============================== */

    useEffect(() => {

        if (!isMobile) return; // 👈 só roda no mobile

        function handleScroll() {

            const scrollTop = window.scrollY;

            if (scrollTop < 40) {
                setOculto(false);
                return;
            }

            setOculto(true);

            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            timeoutRef.current = setTimeout(() => {
                setOculto(false);
            }, 10000);
        }

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };

    }, [isMobile]);


    /* ===============================
       ROTACIONAR TITLES NO MOBILE
    =============================== */

    useEffect(() => {

        if (!isMobile) return;

        intervaloRef.current = setInterval(() => {
            setIndiceMobile(prev =>
                prev + 1 >= categorias.length ? 0 : prev + 1
            );
        }, 10000);

        return () => {
            if (intervaloRef.current) clearInterval(intervaloRef.current);
        };

    }, [categorias, isMobile]);

    function handleClick(cat) {

        setFiltroAtivo(null);
        setProdutosFiltrados(null);
        setCategoriaAtiva(cat);

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

        const container = document.querySelector(".conteudo-categoria");
        if (container) {
            container.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        }
    }


    return (
        <>
            <aside className={`menu-categorias-vertical ${oculto ? "menu-oculto" : ""}`}>
                {categorias.map((cat, index) => {

                    const mostrarTexto = !isMobile || index === indiceMobile;

                    return (
                        <button
                            key={cat}
                            className={`menu-cat-btn ${categoriaAtiva === cat ? "menu-cat-active" : ""}`}
                            onClick={() => handleClick(cat)}
                            title={cat}
                        >
                            <span className="cat-emoji">{ICONES[cat]}</span>

                            {mostrarTexto && (
                                <span className="menu-cat-text mobile-animado">
                                    {cat}
                                </span>
                            )}
                        </button>
                    );
                })}
            </aside>

            {oculto && isMobile && (
                <button
                    className="menu-reveal-btn"
                    onClick={() => setOculto(false)}
                >
                    ←
                </button>
            )}

        </>
    );
}
