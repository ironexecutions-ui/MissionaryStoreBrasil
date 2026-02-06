import React, { useEffect, useState } from "react";
import ModalLogin from "../../inicio/modals/modallogin";
import "./headercambio.css";

export default function HeaderCambio() {

    const [usuario, setUsuario] = useState(null);
    const [abrirLogin, setAbrirLogin] = useState(false);
    const [confirmarLogout, setConfirmarLogout] = useState(false);

    // carregar usuário
    useEffect(() => {
        const u = localStorage.getItem("usuario");
        if (u) setUsuario(JSON.parse(u));
    }, []);

    // logout
    function logout() {
        if (!confirmarLogout) {
            setConfirmarLogout(true);

            // cancela se não confirmar em 3 segundos
            setTimeout(() => {
                setConfirmarLogout(false);
            }, 3000);

            return;
        }

        // logout confirmado
        localStorage.removeItem("usuario");
        localStorage.removeItem("token");
        window.location.reload();
    }


    // redirecionar para artigos (local ou online)
    function irParaArtigos() {
        const online = window.location.hostname !== "localhost";

        if (online) {
            window.location.href = "https://missionarystorebrasil.com";
        } else {
            window.location.href = "/";
        }
    }

    return (
        <>
            <header className="header-box header-visivel">

                {/* ESQUERDA */}
                <div className="header-esq">
                    <img
                        style={{ borderRadius: "40%" }}
                        src="https://mehkqondzeigwbgpotkr.supabase.co/storage/v1/object/public/produtos/m.png"
                        alt=""
                        className="logo-m"
                    />
                    <h2 className="header-titulo">Missionary Store Brasil</h2>
                </div>

                {/* DIREITA */}
                <div className="header-dir">

                    {/* NÃO LOGADO */}
                    {!usuario && (
                        <>
                            <span style={{ marginRight: "15px", opacity: 0.8 }}>
                                Faça login para continuar
                            </span>

                            <button
                                className="header-btn"
                                onClick={() => setAbrirLogin(true)}
                            >
                                Entrar
                            </button>
                        </>
                    )}

                    {/* LOGADO */}
                    {usuario && (
                        <>
                            <div
                                className="header-ttl-cambio"
                                style={{ marginRight: "20px" }}
                            >
                                {usuario.nome}
                            </div>

                            <button
                                className="header-btn"
                                onClick={irParaArtigos}
                            >
                                Ver artigos da loja online
                            </button>

                            <button
                                className="header-btn"
                                style={{ marginLeft: "10px" }}
                                onClick={logout}
                            >
                                fazer logout
                            </button>
                        </>
                    )}
                </div>

            </header>

            {/* MODAL LOGIN */}
            {abrirLogin && (
                <div className="modal-area">
                    <ModalLogin
                        fechar={() => {
                            setAbrirLogin(false);
                            const u = localStorage.getItem("usuario");
                            if (u) setUsuario(JSON.parse(u));
                        }}
                    />
                </div>
            )}
        </>
    );
}
