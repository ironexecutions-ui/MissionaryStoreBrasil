import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../config";

import HeaderPainel from "./components/headerpainel";
import Botoes from "./components/botoes";
import CorpoPainel from "./components/corpopainel";

import "./painel.css";

export default function Painel() {

    const navigate = useNavigate();

    const [telaHeader, setTelaHeader] = useState("inicio");
    const [telaBotao, setTelaBotao] = useState(null);

    useEffect(() => {
        async function validar() {
            const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");
            const token = localStorage.getItem("token");
            const autorizado = localStorage.getItem("painel_autorizado");

            if (!usuario.id || !token || autorizado !== "sim") {
                navigate("/");
                return;
            }

            try {
                const resp = await fetch(`${API_URL}/auth/validar-admin`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                    body: JSON.stringify({ email: usuario.email }),
                });

                const json = await resp.json();
                if (!resp.ok || !json.ok) navigate("/");

            } catch {
                navigate("/");
            }
        }

        validar();
    }, [navigate]);

    // 👇 FUNÇÕES CERTAS
    function selecionarHeader(tela) {
        setTelaHeader(tela);
        setTelaBotao(null); // limpa os botões
    }

    function selecionarBotao(tela) {
        setTelaBotao(tela);
    }

    return (
        <div className="painel-container-pp">

            <HeaderPainel onSelect={selecionarHeader} />

            <div className="painel-conteudo">
                <Botoes onSelect={selecionarBotao} />
                <CorpoPainel
                    telaHeader={telaHeader}
                    telaBotao={telaBotao}
                />
            </div>

        </div>
    );
}
