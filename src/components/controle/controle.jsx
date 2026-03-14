import React, { useState } from "react";
import Meses from "./componentes/meses";
import Despesasfixas from "./componentes/despesasfixas";
import Despesasvariadas from "./componentes/despesasvariadas";
import Ganhos from "./componentes/ganhos";
import Novo from "./componentes/novo";
import "./controle.css";

export default function Controle() {

    const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");

    const hoje = new Date();

    const [mes, setMes] = useState(hoje.getMonth() + 1);
    const [ano, setAno] = useState(hoje.getFullYear());

    const [aba, setAba] = useState("variadas");

    function mudarMes(m, a) {
        setMes(m);
        setAno(a);
    }

    if (usuario.permisso !== 1) {
        return (
            <div className="financeiro-acesso-negado">

                <h2 className="financeiro-acesso-titulo">
                    Acesso negado
                </h2>

                <p className="financeiro-acesso-texto">
                    Você não tem permissão para acessar esta área.
                </p>

            </div>
        );
    }

    return (

        <div className="financeiro-controle-container">
            <div id="financeiro-topo-formulario" className="financeiro-controle-novo">
                <Novo mes={mes} ano={ano} />

            </div>
            <br />
            <div className="financeiro-controle-topo">

                <Meses onChange={mudarMes} />

            </div>



            <div className="financeiro-abas">

                <button
                    className={`financeiro-aba ${aba === "variadas" ? "financeiro-aba-ativa" : ""}`}
                    onClick={() => setAba("variadas")}
                >
                    Despesas Variadas
                </button>

                <button
                    className={`financeiro-aba ${aba === "fixas" ? "financeiro-aba-ativa" : ""}`}
                    onClick={() => setAba("fixas")}
                >
                    Despesas Fixas
                </button>

                <button
                    className={`financeiro-aba ${aba === "ganhos" ? "financeiro-aba-ativa" : ""}`}
                    onClick={() => setAba("ganhos")}
                >
                    Ganhos
                </button>

            </div>

            <div className="financeiro-controle-tabelas">

                {aba === "variadas" && (
                    <Despesasvariadas mes={mes} ano={ano} />
                )}

                {aba === "fixas" && (
                    <Despesasfixas mes={mes} ano={ano} />
                )}

                {aba === "ganhos" && (
                    <Ganhos mes={mes} ano={ano} />
                )}
                <br /><br /><br /><br />
            </div>

        </div>

    );
}