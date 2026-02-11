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
            <header className="cambioHeader__wrapper cambioHeader__wrapper--visible">

                {/* ESQUERDA */}
                <div className="cambioHeader__left">
                    <img
                        src="/m.png"
                        alt="Logo Missionary Store Brasil"
                        className="cambioHeader__logo"
                    />
                    <h2 className="cambioHeader__title">
                        Missionary Store Brasil
                    </h2>
                </div>

                {/* DIREITA */}
                <div className="cambioHeader__right">

                    {/* NÃO LOGADO */}
                    {!usuario && (
                        <div className="cambioHeader__authArea">
                            <span className="cambioHeader__loginText">
                                Faça login para continuar
                            </span>

                            <button
                                className="cambioHeader__button cambioHeader__button--primary"
                                onClick={() => setAbrirLogin(true)}
                            >
                                Entrar
                            </button>
                        </div>
                    )}

                    {/* LOGADO */}
                    {usuario && (
                        <div className="cambioHeader__userArea">

                            <div className="cambioHeader__userName">
                                {usuario.nome}
                            </div>

                            <button
                                className="cambioHeader__button cambioHeader__button--secondary"
                                onClick={irParaArtigos}
                            >
                                Ver artigos da loja online
                            </button>

                            <button
                                className={`cambioHeader__button cambioHeader__button--danger ${confirmarLogout ? "cambioHeader__button--confirming" : ""
                                    }`}
                                onClick={logout}
                            >
                                {confirmarLogout ? "Confirmar logout" : "Fazer logout"}
                            </button>

                        </div>
                    )}

                </div>

            </header>

            {/* MODAL LOGIN */}
            {abrirLogin && (
                <div className="cambioHeader__modalOverlay">
                    <div className="cambioHeader__modalContent">
                        <ModalLogin
                            fechar={() => {
                                setAbrirLogin(false);
                                const u = localStorage.getItem("usuario");
                                if (u) setUsuario(JSON.parse(u));
                            }}
                        />
                    </div>
                </div>
            )}
        </>
    );

}
