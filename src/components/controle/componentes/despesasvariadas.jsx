import React, { useEffect, useState } from "react";
import { API_URL } from "../../../config";
import "./despesasvariadas.css";

export default function Despesasvariadas({ mes, ano }) {

    const [lista, setLista] = useState([]);
    const [loading, setLoading] = useState(true);

    const [menu, setMenu] = useState(null);

    useEffect(() => {

        if (!mes || !ano) return;

        carregar();

    }, [mes, ano]);

    useEffect(() => {

        function fechar() {
            setMenu(null);
        }

        window.addEventListener("click", fechar);

        return () => {
            window.removeEventListener("click", fechar);
        };

    }, []);

    async function carregar() {

        try {

            setLoading(true);

            const res = await fetch(`${API_URL}/financeiro/listar?mes=${mes}&ano=${ano}`);

            if (!res.ok) {
                throw new Error("Erro ao buscar dados");
            }

            const dados = await res.json();

            const filtrado = (dados.variaveis || []).filter((item) => {

                if (!item.data) return false;

                const d = new Date(item.data);

                return (
                    d.getMonth() + 1 === Number(mes) &&
                    d.getFullYear() === Number(ano)
                );

            });

            setLista(filtrado);

        } catch (erro) {

            console.error("Erro ao carregar despesas variadas:", erro);

        } finally {

            setLoading(false);

        }
    }

    function classeStatus(status) {

        if (status === "pago") return "financeiro-status-pago";
        if (status === "andamento") return "financeiro-status-andamento";
        if (status === "nao pago") return "financeiro-status-naopago";

        return "";
    }

    function formatarData(data) {

        if (!data) return "";

        const d = new Date(data);

        return d.toLocaleDateString("pt-BR");
    }

    function abrirMenu(e, item) {

        e.stopPropagation();

        setMenu({
            x: e.clientX,
            y: e.clientY,
            item
        });
    }

    async function apagar(item) {

        await fetch(`${API_URL}/financeiro/apagar/${item.id}`, {
            method: "DELETE"
        });

        carregar();
    }

    function editar(item) {

        localStorage.setItem(
            "financeiro_editar",
            JSON.stringify({
                ...item,
                tabela: "variada"
            })
        );

        window.dispatchEvent(new Event("financeiroEditar"));

        setTimeout(() => {

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        }, 50);

        setMenu(null);
    }

    return (

        <div className="financeiro-despesas-container">

            <h2 className="financeiro-despesas-titulo">
                Despesas Variadas
            </h2>

            <div className="financeiro-despesas-tabela-wrapper">

                <table className="financeiro-despesas-tabela">

                    <thead className="financeiro-despesas-head">

                        <tr>
                            <th>Descrição</th>
                            <th>Pagamento</th>
                            <th>Data</th>
                            <th>Valor</th>
                            <th>Status</th>
                            <th>Obs</th>
                        </tr>

                    </thead>

                    <tbody className="financeiro-despesas-body">

                        {loading && (
                            <tr>
                                <td colSpan="6" className="financeiro-despesas-vazio">
                                    Carregando...
                                </td>
                            </tr>
                        )}

                        {!loading && lista.length === 0 && (
                            <tr>
                                <td colSpan="6" className="financeiro-despesas-vazio">
                                    Nenhuma despesa registrada neste mês
                                </td>
                            </tr>
                        )}

                        {!loading && lista.map((item) => (

                            <tr
                                key={item.id}
                                onClick={(e) => abrirMenu(e, item)}
                                className={`financeiro-despesas-linha ${classeStatus(item.status)}`}
                            >

                                <td className="financeiro-despesas-coluna">
                                    {item.descricao}
                                </td>

                                <td className="financeiro-despesas-coluna">
                                    {item.tipo_pagamento}
                                </td>

                                <td className="financeiro-despesas-coluna">
                                    {formatarData(item.data)}
                                </td>

                                <td className="financeiro-despesas-coluna financeiro-despesas-valor">
                                    R$ {Number(item.valor).toFixed(2)}
                                </td>

                                <td className="financeiro-despesas-coluna">
                                    {item.status}
                                </td>

                                <td className="financeiro-despesas-coluna">
                                    {item.observacao}
                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

            {menu && (

                <div
                    className="financeiro-menu"
                    style={{
                        position: "fixed",
                        top: menu.y,
                        left: menu.x,
                        background: "white",
                        borderRadius: "8px",
                        boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
                        padding: "8px",
                        zIndex: 999
                    }}
                >

                    <div
                        className="financeiro-menu-item"
                        onClick={() => editar(menu.item)}
                    >
                        ✏️ Editar
                    </div>

                    <div
                        className="financeiro-menu-item"
                        onClick={() => apagar(menu.item)}
                    >
                        🗑 Apagar
                    </div>

                </div>

            )}

        </div>

    );
}