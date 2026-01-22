import React, { useEffect, useState } from "react";
import { API_URL } from "../../../../config";
import ConversaoValor from "./valor";
import StripeCard from "./stripecard";
import "./pagamento.css";

export default function Pagamento({ onAvancar }) {

    const [usuarioId, setUsuarioId] = useState(null);

    const [valor, setValor] = useState("");
    const [moeda, setMoeda] = useState("");
    const taxaLoja = 30;

    const [estimativa, setEstimativa] = useState(0);
    const [valorFinal, setValorFinal] = useState(0);

    const [cartaoValido, setCartaoValido] = useState(false);

    const [erro, setErro] = useState("");
    const [salvando, setSalvando] = useState(false);

    // ===============================
    // USUÁRIO
    // ===============================
    useEffect(() => {
        const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");
        if (usuario.id) {
            setUsuarioId(usuario.id);
        }
    }, []);

    // ===============================
    // CÁLCULO FINAL
    // ===============================
    useEffect(() => {
        if (!valor || !moeda || estimativa <= 0) {
            setValorFinal(0);
            setCartaoValido(false);
            return;
        }

        const final = estimativa + (estimativa * taxaLoja / 100);
        setValorFinal(Number(final.toFixed(2)));

    }, [valor, moeda, estimativa]);

    // ===============================
    // SALVAR VALORES
    // ===============================
    async function salvarEAvancar() {
        setErro("");

        if (!usuarioId) {
            setErro("Usuário não identificado");
            return;
        }

        if (!valor || Number(valor) <= 0 || !moeda || estimativa <= 0) {
            setErro("Preencha corretamente o valor e a moeda");
            return;
        }

        if (!cartaoValido) {
            setErro("Preencha corretamente os dados do cartão");
            return;
        }

        try {
            setSalvando(true);

            await fetch(`${API_URL}/cambio/salvar-valores`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    usuario_id: usuarioId,
                    valor_recebe: Number(valor),
                    moeda_origem: moeda,
                    taxa_percentual: taxaLoja,
                    valor_estimado_moeda: Number(estimativa),
                    valor_final_cobrado: Number(valorFinal)
                })
            });

            onAvancar();

        } catch {
            setErro("Erro ao salvar valores do câmbio");
        } finally {
            setSalvando(false);
        }
    }

    return (
        <div className="pagamento-container">

            <h2>Valores do câmbio</h2>

            <ConversaoValor
                valor={valor}
                setValor={setValor}
                moeda={moeda}
                setMoeda={setMoeda}
                taxaLoja={taxaLoja}
                setEstimativa={setEstimativa}
            />

            {/* CARTÃO SÓ APARECE QUANDO HÁ VALOR */}
            {estimativa > 0 && valorFinal > 0 && (
                <StripeCard
                    valorFinal={valorFinal}
                    moeda={moeda}
                    usuarioId={usuarioId}
                    onCartaoValido={setCartaoValido}
                />
            )}

            {erro && (
                <div className="pagamento-erro">
                    {erro}
                </div>
            )}

            <button
                className="btn-primario"
                onClick={salvarEAvancar}
                disabled={salvando || estimativa <= 0 || !cartaoValido}
            >
                {salvando ? "Salvando..." : "Continuar"}
            </button>

        </div>
    );
}
