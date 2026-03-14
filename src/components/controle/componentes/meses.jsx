import React, { useState, useEffect } from "react";
import "./meses.css";

export default function Meses({ onChange }) {

    const hoje = new Date();

    const [mesSelecionado, setMesSelecionado] = useState(hoje.getMonth());
    const [anoSelecionado, setAnoSelecionado] = useState(hoje.getFullYear());

    const [mesBase, setMesBase] = useState(hoje.getMonth());
    const [anoBase, setAnoBase] = useState(hoje.getFullYear());

    const nomes = [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];

    function gerarMeses() {

        let lista = [];

        for (let i = -3; i <= 3; i++) {

            let data = new Date(anoBase, mesBase + i, 1);

            lista.push({
                mes: data.getMonth(),
                ano: data.getFullYear()
            });

        }

        return lista;
    }

    function selecionarMes(m, a) {

        setMesSelecionado(m);
        setAnoSelecionado(a);

    }

    function mudarInput(e) {

        const valor = e.target.value;

        if (!valor) return;

        const partes = valor.split("-");

        const ano = parseInt(partes[0]);
        const mes = parseInt(partes[1]) - 1;

        setMesBase(mes);
        setAnoBase(ano);

        setMesSelecionado(mes);
        setAnoSelecionado(ano);

    }

    useEffect(() => {

        if (onChange) {
            onChange(mesSelecionado + 1, anoSelecionado);
        }

    }, [mesSelecionado, anoSelecionado]);

    return (

        <div className="financeiro-meses-container">

            <div className="financeiro-meses-input">

                <input
                    type="month"
                    onChange={mudarInput}
                    className="financeiro-mes-seletor"
                />

            </div>

            <div className="financeiro-meses-botoes">

                {gerarMeses().map((item, index) => (

                    <button
                        key={index}
                        onClick={() => selecionarMes(item.mes, item.ano)}
                        className={`financeiro-mes-botao ${mesSelecionado === item.mes && anoSelecionado === item.ano
                                ? "financeiro-mes-ativo"
                                : ""
                            }`}
                    >

                        {nomes[item.mes]} {item.ano}

                    </button>

                ))}

            </div>

        </div>

    );
}