import React, { useEffect, useRef, useState } from "react";
import ModalCarrinho from "./modals/modalcarrinho";
import ModalCompras from "./modals/modalcompras";
import { criarIconeCarrinho } from "./icones/carrinho";
import ModalLogin from "./modals/modallogin";
import ModalPerfil from "./modals/modalperfil";
import "./header.css";
import { API_URL } from "../../config";

export default function Header({ abrirFiltro, painelAtivo, setPainelAtivo }) {

    const [usuario, setUsuario] = useState(null);
    const [compacto, setCompacto] = useState(false);
    const [abrirLogin, setAbrirLogin] = useState(false);
    const [abrirPerfil, setAbrirPerfil] = useState(false);
    const [qtdCarrinho, setQtdCarrinho] = useState(0);
    const [mostrarAvisoEndereco, setMostrarAvisoEndereco] = useState(false);

    const refCarrinho = useRef(null);
    async function carregarQtdCarrinho() {
        if (!usuario?.id) {
            setQtdCarrinho(0);
            return;
        }

        const r = await fetch(`${API_URL}/processo/carrinho/quantidade`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ usuario_id: usuario.id })
        });

        const json = await r.json();
        if (json.total !== undefined) {
            setQtdCarrinho(json.total);
        }
    }
    useEffect(() => {
        carregarQtdCarrinho();
    }, [usuario, painelAtivo]);
    useEffect(() => {
        if (!usuario?.id) return;

        if (!usuario.cep || usuario.cep.trim() === "") {

            const intervalo = setInterval(() => {
                setMostrarAvisoEndereco(true);

                setTimeout(() => {
                    setMostrarAvisoEndereco(false);
                }, 2000);

            }, 10000);

            return () => clearInterval(intervalo);
        }

    }, [usuario]);

    // --------------------------- GARANTIR ÍCONE ---------------------------
    function garantirIconeCarrinho() {

        if (!refCarrinho.current) return;

        if (painelAtivo === "carrinho") {
            refCarrinho.current.innerHTML = "";
            return;
        }

        if (refCarrinho.current.children.length === 0) {
            const icone = criarIconeCarrinho(22, "white");
            refCarrinho.current.innerHTML = "";
            refCarrinho.current.appendChild(icone);
        }
    }

    useEffect(() => {
        garantirIconeCarrinho();
    }, []);

    useEffect(() => {
        if (usuario) garantirIconeCarrinho();
    }, [usuario]);

    useEffect(() => {
        garantirIconeCarrinho();
    }, [painelAtivo]);

    useEffect(() => {
        const t = setInterval(() => garantirIconeCarrinho(), 300);
        return () => clearInterval(t);
    }, []);

    // Carrega usuário no início
    useEffect(() => {
        const u = localStorage.getItem("usuario");
        if (u) setUsuario(JSON.parse(u));
    }, []);

    // --------------------------- ATUALIZAR USUÁRIO A CADA 5 MINUTOS ---------------------------
    useEffect(() => {
        const interval = setInterval(() => {
            const u = localStorage.getItem("usuario");
            if (u) {
                const json = JSON.parse(u);

                // Só atualiza se mudou
                if (!usuario || json.nome !== usuario.nome) {
                    setUsuario(json);
                }
            }
        }, 300000); // 300 segundos = 5 minutos

        return () => clearInterval(interval);
    }, [usuario]);

    // --------------------------- HEADER COMPACTO ---------------------------
    useEffect(() => {
        function aoRolar() {
            setCompacto(window.scrollY > 34);
        }
        window.addEventListener("scroll", aoRolar);
        return () => window.removeEventListener("scroll", aoRolar);
    }, []);

    return (
        <>
            <header className={`header-box ${compacto ? "header-escondido" : "header-visivel"}`}>

                <div className="header-esq">
                    <img src="https://mehkqondzeigwbgpotkr.supabase.co/storage/v1/object/public/produtos/m.png" alt="" className="logo-m" />
                    <h2 className="header-titulo">Missionary Store Brasil</h2>
                </div>

                <div className="header-centro">
                    <input readOnly
                        className="header-input"
                        placeholder="Buscar produtos..."
                        onFocus={abrirFiltro}
                    />
                </div>

                <div className="header-dir">

                    {!usuario && (
                        <button
                            className="header-btn"
                            onClick={() => setAbrirLogin(true)}
                        >
                            Entrar
                        </button>
                    )}

                    {usuario && (
                        <>


                            {/* Botão Carrinho */}
                            <button
                                className={`header-btn header-btn-carrinho ${painelAtivo === "carrinho" ? "ativo" : ""}`}
                                onClick={() => {
                                    setPainelAtivo(painelAtivo === "carrinho" ? "corpo" : "carrinho");
                                }}
                            >
                                {painelAtivo === "carrinho" ? "Produtos" : (
                                    <span className="carrinho-icone-wrapper">
                                        <span ref={refCarrinho}></span>

                                        {qtdCarrinho > 0 && (
                                            <span className="carrinho-badge">
                                                {qtdCarrinho}
                                            </span>
                                        )}
                                    </span>
                                )}
                            </button>



                            {/* Botão Minhas Compras */}
                            <button
                                style={{ marginRight: "20px" }}
                                className={`header-btn ${painelAtivo === "compras" ? "ativo" : ""}`}
                                onClick={() => {
                                    setPainelAtivo(painelAtivo === "compras" ? "corpo" : "compras");
                                }}
                            >
                                {painelAtivo === "compras" ? "Produtos" : "Minhas compras"}
                            </button>
                            <div className="perfil-wrapper">
                                <div
                                    className={`header-ttl ${(!usuario.cep || usuario.cep === "") ? "perfil-piscando" : ""}`}
                                    onClick={() => {
                                        setPainelAtivo("corpo");
                                        setAbrirPerfil(true);
                                    }}
                                    style={{ cursor: "pointer", }}
                                >
                                    {usuario.nome} {usuario.sobrenome}
                                </div>

                                {mostrarAvisoEndereco && (
                                    <div className="aviso-endereco">
                                        Cadastre seu endereço por favor
                                    </div>
                                )}
                            </div>

                        </>
                    )}

                </div>
            </header>

            {compacto && (
                <div
                    className="header-bolinha"
                    onClick={() => {
                        setCompacto(false);
                        window.scrollTo({
                            top: 0,
                            behavior: "smooth"
                        });
                    }}
                >
                    <img src="https://mehkqondzeigwbgpotkr.supabase.co/storage/v1/object/public/produtos/m.png" className="bolinha-logo" />
                </div>

            )}

            {abrirLogin && (
                <div className="modal-area">
                    <ModalLogin fechar={() => setAbrirLogin(false)} />
                </div>
            )}

            {abrirPerfil && (
                <div className="modal-area">
                    <ModalPerfil fechar={() => setAbrirPerfil(false)} />
                </div>
            )}
        </>
    );
}
