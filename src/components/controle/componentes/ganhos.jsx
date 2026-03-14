import React, { useEffect, useState } from "react";
import { API_URL } from "../../../config";
import "./ganhos.css";

export default function Ganhos() {

    const [lista, setLista] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        carregar();
    }, []);

    async function carregar() {

        try {

            setLoading(true);

            await fetch(`${API_URL}/financeiro/atualizar_faturamento`);

            const res = await fetch(`${API_URL}/financeiro/listar?mes=1&ano=2000`);

            if (!res.ok) {
                throw new Error("Erro ao buscar ganhos");
            }

            const dados = await res.json();

            const ganhos = dados.ganhos || [];

            const agrupado = {};

            ganhos.forEach((item) => {

                if (!item.semana) return;

                if (!agrupado[item.semana]) {

                    agrupado[item.semana] = {
                        semana: item.semana,
                        lucro: Number(item.lucro || 0),
                        faturamento: Number(item.faturamento || 0),
                        observacoes: item.observacoes
                    };

                } else {

                    agrupado[item.semana].lucro += Number(item.lucro || 0);

                    if (!agrupado[item.semana].faturamento && item.faturamento) {
                        agrupado[item.semana].faturamento = Number(item.faturamento);
                    }

                }

            });

            const listaOrdenada = Object.values(agrupado).sort((a, b) => {

                function pegarTimestamp(texto) {

                    const inicio = texto
                        .replace("Semana de ", "")
                        .split(" até ")[0];

                    const [dia, mes, ano] = inicio.split("/");

                    return new Date(ano, mes - 1, dia).getTime();

                }

                return pegarTimestamp(b.semana) - pegarTimestamp(a.semana);

            });

            setLista(listaOrdenada);
        } catch (erro) {

            console.error("Erro ao carregar ganhos:", erro);

        } finally {

            setLoading(false);

        }
    }

    return (

        <div className="financeiro-ganhos-container">

            <h2 className="financeiro-ganhos-titulo">
                Ganhos
            </h2>

            <div className="financeiro-ganhos-tabela-wrapper">

                <table className="financeiro-ganhos-tabela">

                    <thead className="financeiro-ganhos-head">

                        <tr>
                            <th>Semana</th>
                            <th>Lucro</th>
                            <th>Faturamento</th>
                            <th>Observações</th>
                        </tr>

                    </thead>

                    <tbody className="financeiro-ganhos-body">

                        {loading && (
                            <tr>
                                <td colSpan="4" className="financeiro-ganhos-vazio">
                                    Carregando...
                                </td>
                            </tr>
                        )}

                        {!loading && lista.length === 0 && (
                            <tr>
                                <td colSpan="4" className="financeiro-ganhos-vazio">
                                    Nenhum ganho registrado
                                </td>
                            </tr>
                        )}

                        {!loading && lista.map((item, index) => (

                            <tr
                                key={index}
                                className="financeiro-ganhos-linha"
                            >

                                <td className="financeiro-ganhos-coluna">
                                    {item.semana}
                                </td>

                                <td className="financeiro-ganhos-coluna financeiro-ganhos-lucro">
                                    R$ {Number(item.lucro).toFixed(2)}
                                </td>

                                <td className="financeiro-ganhos-coluna">
                                    R$ {Number(item.faturamento).toFixed(2)}
                                </td>

                                <td className="financeiro-ganhos-coluna">
                                    {item.observacoes}
                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

        </div>

    );

}