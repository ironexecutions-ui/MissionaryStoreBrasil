import React, { useEffect, useState } from "react";
import { API_URL } from "../../../config";
import "./despesasfixas.css";

export default function Despesasfixas({ mes, ano }) {

    const [lista, setLista] = useState([]);
    const [loading, setLoading] = useState(true);
    const [menu, setMenu] = useState(null);

    useEffect(() => {

        if (!mes || !ano) return;

        carregar();

    }, [mes, ano]);

    useEffect(() => {

        function fecharMenu() {
            setMenu(null);
        }

        window.addEventListener("click", fecharMenu);

        return () => {
            window.removeEventListener("click", fecharMenu);
        };

    }, []);

    async function carregar() {

        try {

            setLoading(true);

            const res = await fetch(`${API_URL}/financeiro/listar?mes=${mes}&ano=${ano}`);

            if (!res.ok) {
                throw new Error("Erro ao buscar dados do servidor");
            }

            const dados = await res.json();

            const filtrado = (dados.fixas || []).filter((item) => {

                if (!item.data) return false;

                const d = new Date(item.data);

                return (
                    d.getMonth() + 1 === Number(mes) &&
                    d.getFullYear() === Number(ano)
                );

            });

            setLista(filtrado);

        } catch (erro) {

            console.error("Erro ao carregar despesas fixas:", erro);

        } finally {

            setLoading(false);

        }
    }

    function abrirMenu(e, item) {

        e.stopPropagation();

        setMenu({
            x: e.clientX,
            y: e.clientY,
            item: item
        });

    }

    function editar() {

        localStorage.setItem(
            "financeiro_editar",
            JSON.stringify({
                ...menu.item,
                tabela: "fixa"
            })
        );

        window.dispatchEvent(new Event("financeiroEditar"));

        const topo = document.getElementById("financeiro-topo-formulario");

        if (topo) {
            topo.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }

        setMenu(null);
    }

    async function apagar() {

        if (!window.confirm("Deseja apagar este registro?")) return;

        try {

            await fetch(`${API_URL}/financeiro/apagar/${menu.item.id}`, {
                method: "DELETE"
            });

            carregar();

        } catch (erro) {

            console.error("Erro ao apagar:", erro);

        }

        setMenu(null);
    }

    function classeStatus(status) {

        if (status === "pago") return "financeiro-status-pago";
        if (status === "andamento") return "financeiro-status-andamento";
        if (status === "nao pago") return "financeiro-status-naopago";

        return "";
    }

    function textoStatus(status) {

        if (status === "pago") return "✔ Pago";
        if (status === "andamento") return "⏳ Andamento";
        if (status === "nao pago") return "⚠ Não Pago";

        return status;
    }

    function formatarData(data) {

        if (!data) return "";

        const d = new Date(data);

        return d.toLocaleDateString("pt-BR");
    }

    return (

        <div className="financeiro-despesas-container">

            <h2 className="financeiro-despesas-titulo">
                Despesas Fixas
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

                                    <span
                                        style={{ fontSize: "16px" }}
                                        className="financeiro-status-badge"
                                    >
                                        {textoStatus(item.status)}
                                    </span>

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
                        top: menu.y,
                        left: menu.x,
                        position: "fixed"
                    }}
                >

                    <button onClick={editar}>
                        ✏️ Editar
                    </button>

                    <button onClick={apagar}>
                        🗑 Apagar
                    </button>

                </div>

            )}

        </div>

    );
}