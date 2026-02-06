import React, {
    useEffect,
    useState,
    forwardRef,
    useImperativeHandle
} from "react";
import { API_URL } from "../../../../config";
import "./dadospessoais.css";

const estadoInicial = {
    nome_missionario: "",
    missao: "",
    data_inicio_missao: "",
    ano_nascimento: ""
};

const DadosPessoais = forwardRef(
    ({ dados = {}, setDados }, ref) => {

        const [local, setLocal] = useState(estadoInicial);

        // ===============================
        // HIDRATAR A PARTIR DO PAI (SE JÁ EXISTIR)
        // ===============================
        useEffect(() => {
            if (dados && Object.keys(dados).length > 0) {
                const normalizado = {
                    nome_missionario: dados.nome_missionario || "",
                    missao: dados.missao || "",
                    data_inicio_missao: dados.data_inicio || dados.data_inicio_missao || "",
                    ano_nascimento: dados.ano_nascimento || ""
                };

                setLocal(normalizado);
            }
        }, [dados]);

        // ===============================
        // BUSCAR DO BACKEND (SE TIVER USUARIO)
        // ===============================
        useEffect(() => {
            const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");
            if (!usuario.id) return;

            async function carregar() {
                try {
                    const r = await fetch(
                        `${API_URL}/cambio/dados-pessoais/${usuario.id}`
                    );
                    const json = await r.json();

                    if (r.ok && json && Object.keys(json).length > 0) {
                        const normalizado = {
                            nome_missionario: json.nome_missionario || "",
                            missao: json.missao || "",
                            data_inicio_missao: json.data_inicio || "",
                            ano_nascimento: json.ano_nascimento || ""
                        };

                        setLocal(normalizado);
                        setDados(normalizado);
                    }
                } catch { }
            }

            carregar();
        }, []);

        function atualizar(campo, valor) {
            const novo = { ...local, [campo]: valor };
            setLocal(novo);
            setDados(novo);
        }

        async function salvarAgora() {
            const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");
            if (!usuario.id) return;

            await fetch(`${API_URL}/cambio/salvar-dados-pessoais`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    usuario_id: Number(usuario.id),
                    nome_missionario: local.nome_missionario || "",
                    missao: local.missao || "",
                    ano_nascimento: local.ano_nascimento
                        ? Number(local.ano_nascimento)
                        : null,
                    data_inicio: local.data_inicio_missao || "0001-01-01"
                })
            });
        }

        useImperativeHandle(ref, () => ({
            salvarAgora
        }));

        return (
            <div className="dados-container">

                <h2 className="dados-titulo">
                    Dados pessoais do missionário
                </h2>

                <div className="dados-aviso">
                    <p>
                        Estas informações são utilizadas apenas como apoio caso o missionário
                        não consiga apresentar o comprovante oficial no momento do recebimento
                        do valor.
                    </p>
                    <p>
                        Sempre que possível, leve o documento oficial que será enviado por email
                        após a compra. Ao finalizar o pagamento, também será disponibilizado um
                        comprovante em PDF para download e impressão.
                    </p>
                    <p>
                        O missionário não está autorizado a imprimir este documento no CTM.
                        A impressão deve ser realizada antes da chegada ao CTM.
                        No dia da saída, o missionário não poderá estar com celular.
                        Apenas o instrutor pode ter celular conforme as regras do CTM.
                    </p>
                </div>

                <div className="dados-form">

                    <div className="campo">
                        <label>Nome do missionário</label>
                        <input
                            type="text"
                            value={local.nome_missionario}
                            onChange={(e) =>
                                atualizar("nome_missionario", e.target.value)
                            }
                        />
                    </div>

                    <div className="campo">
                        <label>Missão</label>
                        <input
                            type="text"
                            value={local.missao}
                            onChange={(e) =>
                                atualizar("missao", e.target.value)
                            }
                        />
                    </div>

                    <div className="campo">
                        <label>Data de início da missão</label>
                        <input
                            type="date"
                            value={local.data_inicio_missao || ""}
                            onChange={(e) =>
                                atualizar("data_inicio_missao", e.target.value)
                            }
                        />
                    </div>

                    <div className="campo">
                        <label>Ano de nascimento</label>
                        <input
                            type="number"
                            value={local.ano_nascimento || ""}
                            onChange={(e) =>
                                atualizar("ano_nascimento", e.target.value)
                            }
                        />
                    </div>

                </div>

            </div>
        );
    }
);

export default DadosPessoais;
