import React, { useState, useEffect, useRef } from "react";
import { API_URL } from "../../../config";
import "./novo.css";

export default function Novo() {

    const [tipo, setTipo] = useState("fixa");
    const [dados, setDados] = useState({});
    const refs = useRef([]);
    function calcularStatus(data) {

        const hoje = new Date();
        const d = new Date(data);

        const diff = (hoje - d) / (1000 * 60 * 60 * 24);

        if (diff >= 1) return "pago";
        if (diff === 0) return "andamento";

        return "nao pago";
    }
    function handleEnter(e, index) {

        if (e.key !== "Enter") return;

        e.preventDefault();

        const proximo = refs.current[index + 1];

        if (proximo) {
            proximo.focus();
        } else {

            if (validarCampos()) {
                salvar();
            }

        }
    }
    function calcularSemana(data) {

        const d = new Date(data);

        const inicio = new Date(d);
        inicio.setDate(d.getDate() - d.getDay());

        const fim = new Date(inicio);
        fim.setDate(inicio.getDate() + 7);

        return `Semana de ${inicio.toLocaleDateString()} até ${fim.toLocaleDateString()}`;
    }

    function validarCampos() {

        if (tipo !== "ganho") {

            if (!dados.descricao) {
                alert("Preencha a descrição");
                return false;
            }

            if (!dados.tipo_pagamento) {
                alert("Preencha o tipo de pagamento");
                return false;
            }

            if (!dados.data) {
                alert("Preencha a data");
                return false;
            }

            if (!dados.valor) {
                alert("Preencha o valor");
                return false;
            }

        }

        if (tipo === "ganho") {

            if (!dados.data) {
                alert("Preencha a data");
                return false;
            }

            if (!dados.lucro) {
                alert("Preencha o lucro");
                return false;
            }

        }

        return true;
    }

    async function salvar() {

        if (!validarCampos()) return;

        let enviar = { ...dados };

        enviar.tabela = tipo;

        if (tipo !== "ganho") {
            enviar.status = calcularStatus(dados.data);
        }

        if (tipo === "ganho") {
            enviar.semana = calcularSemana(dados.data);
        }

        await fetch(`${API_URL}/financeiro/novo`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(enviar)
        });

        window.location.reload();
    }
    useEffect(() => {

        function carregarEdicao() {

            const dadosSalvos = localStorage.getItem("financeiro_editar");

            if (!dadosSalvos) return;

            const registro = JSON.parse(dadosSalvos);

            setDados(registro);

            if (registro.tabela) {
                setTipo(registro.tabela);
            }

        }

        window.addEventListener("financeiroEditar", carregarEdicao);

        return () => {
            window.removeEventListener("financeiroEditar", carregarEdicao);
        };

    }, []);
    return (

        <div className="financeiro-novo-container">

            <div className="financeiro-novo-header">

                <h2 className="financeiro-novo-titulo">
                    Novo Registro
                </h2>

                <select
                    className="financeiro-novo-select"
                    value={tipo}
                    onChange={(e) => setTipo(e.target.value)}
                >
                    <option value="fixa">Despesas Fixas</option>
                    <option value="variada">Despesas Variadas</option>
                    <option value="ganho">Ganhos</option>
                </select>

            </div>

            <div className="financeiro-novo-form">

                {tipo !== "ganho" && (

                    <>

                        <input
                            ref={(el) => refs.current[0] = el}
                            onKeyDown={(e) => handleEnter(e, 0)}
                            className="financeiro-input"
                            placeholder="Descrição"
                            value={dados.descricao || ""}
                            onChange={(e) =>
                                setDados({ ...dados, descricao: e.target.value })
                            }
                        />

                        <input
                            ref={(el) => refs.current[1] = el}
                            onKeyDown={(e) => handleEnter(e, 1)}
                            className="financeiro-input"
                            list="pagamento"
                            placeholder="Tipo pagamento"
                            value={dados.tipo_pagamento || ""}
                            onChange={(e) =>
                                setDados({ ...dados, tipo_pagamento: e.target.value })
                            }
                        />

                        <datalist id="pagamento">
                            <option>credito</option>
                            <option>debito</option>
                            <option>pix</option>
                        </datalist>

                        <input
                            ref={(el) => refs.current[2] = el}
                            onKeyDown={(e) => handleEnter(e, 2)}
                            className="financeiro-input"
                            type="date"
                            value={dados.data || ""}
                            onChange={(e) =>
                                setDados({ ...dados, data: e.target.value })
                            }
                        />

                        <input
                            ref={(el) => refs.current[3] = el}
                            onKeyDown={(e) => handleEnter(e, 3)}
                            className="financeiro-input"
                            type="number"
                            placeholder="Valor"
                            value={dados.valor || ""}
                            onChange={(e) =>
                                setDados({ ...dados, valor: e.target.value })
                            }
                        />

                        <input
                            ref={(el) => refs.current[4] = el}
                            onKeyDown={(e) => handleEnter(e, 4)}
                            className="financeiro-input"
                            placeholder="Observação"
                            value={dados.observacao || ""}
                            onChange={(e) =>
                                setDados({ ...dados, observacao: e.target.value })
                            }
                        />

                    </>

                )}

                {tipo === "ganho" && (

                    <>

                        <input
                            className="financeiro-input"
                            type="date"
                            value={dados.data || ""}
                            onChange={(e) =>
                                setDados({ ...dados, data: e.target.value })
                            }
                        />

                        <input
                            className="financeiro-input"
                            type="number"
                            placeholder="Lucro"
                            value={dados.lucro || ""}
                            onChange={(e) =>
                                setDados({ ...dados, lucro: e.target.value })
                            }
                        />

                        <input
                            className="financeiro-input"
                            placeholder="Observações"
                            value={dados.observacoes || ""}
                            onChange={(e) =>
                                setDados({ ...dados, observacoes: e.target.value })
                            }
                        />

                    </>

                )}

            </div>

            <div className="financeiro-novo-acoes">

                <button
                    className="financeiro-botao-salvar"
                    onClick={salvar}
                >
                    Salvar
                </button>

            </div>

        </div>

    );
}