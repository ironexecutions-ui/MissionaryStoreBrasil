import React, { useState } from "react";
import "./confirmacao.css";
import { API_URL } from "../../../../config";

export default function Confirmacao({ dadosPessoais, dadosPagamento }) {

    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState("");
    const [sucesso, setSucesso] = useState("");
    const [clientSecret, setClientSecret] = useState(null);

    async function iniciarPagamento() {
        setErro("");
        setSucesso("");
        setLoading(true);

        try {
            if (!dadosPessoais?.usuario_id) {
                throw new Error("Usuário não identificado");
            }

            const resp = await fetch(
                `${API_URL}/cambio/stripe/criar-intencao/${dadosPessoais.usuario_id}`,
                { method: "POST" }
            );

            const json = await resp.json();

            if (!resp.ok) {
                throw new Error(json.detail || "Erro ao iniciar pagamento");
            }

            // MODO MOCK
            if (json.mock) {
                setSucesso(
                    "Pagamento iniciado em modo de simulação. " +
                    "Quando o Stripe estiver ativo, o pagamento real será processado."
                );
                return;
            }

            // STRIPE REAL
            if (json.client_secret) {
                setClientSecret(json.client_secret);
            } else {
                throw new Error("Client secret não recebido do Stripe");
            }

        } catch (e) {
            setErro(e.message || "Erro inesperado");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="confirmacao-container">

            <h2 className="confirmacao-titulo">
                Confirmação das informações
            </h2>

            <div className="confirmacao-info">
                <p>
                    Confira atentamente todas as informações abaixo.
                    Ao confirmar, você declara que os dados estão corretos.
                    O pagamento será realizado na próxima etapa.
                </p>
            </div>

            {/* DADOS DO MISSIONÁRIO */}
            <div className="confirmacao-bloco">
                <h3>Dados do missionário</h3>

                <div className="linha">
                    <span>Nome</span>
                    <strong>{dadosPessoais?.nome_missionario || "-"}</strong>
                </div>

                <div className="linha">
                    <span>Missão</span>
                    <strong>{dadosPessoais?.missao || "-"}</strong>
                </div>

                <div className="linha">
                    <span>Início da missão</span>
                    <strong>{dadosPessoais?.data_inicio_missao || "-"}</strong>
                </div>

                <div className="linha">
                    <span>Ano de nascimento</span>
                    <strong>{dadosPessoais?.ano_nascimento || "-"}</strong>
                </div>
            </div>

            {/* RESUMO DO CÂMBIO */}
            <div className="confirmacao-bloco">
                <h3>Resumo do câmbio</h3>

                <div className="linha">
                    <span>Valor a receber no Brasil</span>
                    <strong>
                        R$ {Number(dadosPagamento?.valorReais || 0).toFixed(2)}
                    </strong>
                </div>

                <div className="linha">
                    <span>Moeda utilizada</span>
                    <strong>{dadosPagamento?.moeda || "-"}</strong>
                </div>

                <div className="linha">
                    <span>Valor estimado na moeda</span>
                    <strong>
                        {dadosPagamento?.moeda}{" "}
                        {Number(dadosPagamento?.valorMoeda || 0).toFixed(2)}
                    </strong>
                </div>

                <div className="linha">
                    <span>Valor final estimado</span>
                    <strong>
                        {dadosPagamento?.moeda}{" "}
                        {Number(dadosPagamento?.valorFinal || 0).toFixed(2)}
                    </strong>
                </div>
            </div>

            <div className="confirmacao-alerta">
                <p>
                    O valor exibido é uma estimativa.
                    O valor final será confirmado pelo banco emissor
                    no momento do pagamento.
                </p>
            </div>

            {erro && (
                <div className="confirmacao-erro">
                    {erro}
                </div>
            )}

            {sucesso && (
                <div className="confirmacao-sucesso">
                    {sucesso}
                </div>
            )}

            {!clientSecret && (
                <button
                    className="confirmacao-botao"
                    onClick={iniciarPagamento}
                    disabled={loading}
                >
                    {loading ? "Iniciando pagamento..." : "Prosseguir para pagamento"}
                </button>
            )}

            {clientSecret && (
                <div className="confirmacao-sucesso">
                    Pagamento preparado com segurança.
                    Aguarde a confirmação na próxima etapa.
                </div>
            )}

        </div>
    );
}
