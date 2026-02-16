import React, { useState } from "react";
import { API_URL } from "../../../config";
import "./modalfiltro.css";

export default function ModalFiltro({
    fechar,
    setProdutosFiltrados,
    setFiltroAtivo
}) {

    const [nome, setNome] = useState("");
    const [min, setMin] = useState("");
    const [max, setMax] = useState("");
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState("");

    async function buscar(e) {

        if (e) e.preventDefault(); // impede reload

        setErro("");

        if (!nome && !min && !max) {
            setErro("Digite pelo menos um critério de busca");
            return;
        }

        setLoading(true);

        try {

            const body = {
                nome: nome.trim(),
                min: min ? Number(min) : null,
                max: max ? Number(max) : null
            };

            const resp = await fetch(`${API_URL}/produtos/filtrar`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });

            const json = await resp.json();

            if (!resp.ok) {
                throw new Error(json.detail || "Erro ao buscar produtos");
            }

            const lista = json.produtos || [];

            setProdutosFiltrados(lista);

            if (nome) {
                setFiltroAtivo(nome);
            } else if (min || max) {
                setFiltroAtivo("Filtro por preço");
            } else {
                setFiltroAtivo("Resultado da busca");
            }

            fechar();

        } catch (err) {
            setErro(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="modal-overlay" onClick={fechar}>
            <form
                className="modal-filtro"
                onClick={e => e.stopPropagation()}
                onSubmit={buscar}
            >

                <h2>Filtrar produtos</h2>

                <input
                    type="text"
                    placeholder="Nome do produto"
                    value={nome}
                    onChange={e => setNome(e.target.value)}
                />

                <input
                    type="number"
                    placeholder="Preço mínimo"
                    value={min}
                    onChange={e => setMin(e.target.value)}
                />

                <input
                    type="number"
                    placeholder="Preço máximo"
                    value={max}
                    onChange={e => setMax(e.target.value)}
                />

                {erro && (
                    <div className="modal-erro">
                        {erro}
                    </div>
                )}

                <button
                    type="submit"
                    className="btnn-buscar"
                    disabled={loading}
                >
                    {loading ? "Buscando..." : "Buscar"}
                </button>

            </form>
        </div>
    );
}
