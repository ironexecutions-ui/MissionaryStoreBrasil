import React, { useEffect, useState } from "react";
import ModalLogin from "../inicio/modals/modallogin";
import HeaderCambio from "./components/headercambio";
import CorpoCambio from "./components/corpocambio";
import "./cambio.css"
export default function Cambio() {

    const [usuario, setUsuario] = useState(null);
    const [abrirLogin, setAbrirLogin] = useState(false);

    // verificar login ao entrar
    useEffect(() => {
        const u = localStorage.getItem("usuario");

        if (!u) {
            setAbrirLogin(true);
        } else {
            setUsuario(JSON.parse(u));
        }
    }, []);

    // callback após login
    function onLoginSucesso() {
        const u = localStorage.getItem("usuario");
        if (u) {
            setUsuario(JSON.parse(u));
            setAbrirLogin(false);
        }
    }

    return (
        <>
            {/* HEADER ESPECÍFICO DO CÂMBIO */}
            <HeaderCambio />

            {/* CONTEÚDO */}
            {!usuario ? (
                <>
                    <div style={{ padding: "40px", textAlign: "center" }}>
                        <h2 className="cambio-login-titulo">
                            Faça login para acessar o câmbio
                        </h2>

                        <button
                            className="cambio-login-btn"
                            onClick={() => setAbrirLogin(true)}
                        >
                            Entrar
                        </button>

                    </div>

                    {abrirLogin && (
                        <div className="modal-area">
                            <ModalLogin
                                fechar={() => setAbrirLogin(false)}
                                onSucesso={onLoginSucesso}
                            />
                        </div>
                    )}
                </>
            ) : (
                <div style={{ padding: "30px" }}>

                    <CorpoCambio />
                </div>


            )}
        </>
    );
}
