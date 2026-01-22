import React, { useState, useRef } from "react";
import "./corpocambio.css";

import DadosPessoais from "./etapas/dadospessoais";
import Pagamento from "./etapas/pagamento";
import Confirmacao from "./etapas/confirmacao";

export default function CorpoCambio() {

    const [etapaAtual, setEtapaAtual] = useState(1);

    const [dadosPessoais, setDadosPessoais] = useState({});
    const [dadosPagamento, setDadosPagamento] = useState({});

    const [erro, setErro] = useState("");

    const dadosPessoaisRef = useRef(null);

    async function avancarEtapa() {
        setErro("");

        if (etapaAtual === 1) {
            const {
                nome_missionario,
                missao,
                data_inicio_missao,
                ano_nascimento
            } = dadosPessoais;

            if (
                !nome_missionario ||
                !missao ||
                !data_inicio_missao ||
                !ano_nascimento
            ) {
                setErro("Para continuar, é necessário preencher todos os dados do missionário.");
                return;
            }

            if (dadosPessoaisRef.current) {
                await dadosPessoaisRef.current.salvarAgora();
            }

            setEtapaAtual(2);
        }
    }

    function voltarEtapa() {
        setErro("");
        setEtapaAtual((prev) => (prev > 1 ? prev - 1 : prev));
    }

    return (
        <div className="cambio-container">

            <h1 className="cambio-titulo">
                Solicitação de Câmbio Missionário
            </h1>

            <p className="cambio-subtitulo">
                Preencha as informações abaixo com atenção.
                O processo é dividido em etapas para garantir segurança e clareza.
            </p>

            <div className="cambio-etapas">
                <span className={etapaAtual === 1 ? "ativa" : ""}>1</span>
                <span className={etapaAtual === 2 ? "ativa" : ""}>2</span>
                <span className={etapaAtual === 3 ? "ativa" : ""}>3</span>
            </div>

            {erro && <div className="cambio-erro">{erro}</div>}

            <div className="cambio-conteudo">

                {etapaAtual === 1 && (
                    <DadosPessoais
                        ref={dadosPessoaisRef}
                        dados={dadosPessoais}
                        setDados={setDadosPessoais}
                    />
                )}

                {etapaAtual === 2 && (
                    <Pagamento
                        setDadosPagamento={setDadosPagamento}
                        onAvancar={() => setEtapaAtual(3)}
                    />
                )}

                {etapaAtual === 3 && (
                    <Confirmacao
                        dadosPessoais={dadosPessoais}
                        dadosPagamento={dadosPagamento}
                    />
                )}

            </div>

            <div className="cambio-botoes">

                <button
                    className="btn-secundario"
                    onClick={voltarEtapa}
                    disabled={etapaAtual === 1}
                >
                    Voltar
                </button>

                {etapaAtual === 1 && (
                    <button
                        className="btn-primario"
                        onClick={avancarEtapa}
                    >
                        Próxima etapa
                    </button>
                )}

            </div>

        </div>
    );
}
