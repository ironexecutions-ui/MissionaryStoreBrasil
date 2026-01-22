import React, { useEffect } from "react";
import "./valor.css";

const moedasAmerica = [
    { codigo: "USD", nome: "Dólar Americano (EUA)", simbolo: "US$", cotacao: 5.0 },
    { codigo: "CAD", nome: "Dólar Canadense (Canadá)", simbolo: "C$", cotacao: 3.7 },
    { codigo: "MXN", nome: "Peso Mexicano (México)", simbolo: "MX$", cotacao: 0.29 },
    { codigo: "ARS", nome: "Peso Argentino (Argentina)", simbolo: "AR$", cotacao: 0.005 },
    { codigo: "CLP", nome: "Peso Chileno (Chile)", simbolo: "CLP$", cotacao: 0.0058 },
    { codigo: "COP", nome: "Peso Colombiano (Colômbia)", simbolo: "COL$", cotacao: 0.0013 },
    { codigo: "PEN", nome: "Sol Peruano (Peru)", simbolo: "S/", cotacao: 1.35 },
    { codigo: "UYU", nome: "Peso Uruguaio (Uruguai)", simbolo: "$U", cotacao: 0.13 },
    { codigo: "BOB", nome: "Boliviano (Bolívia)", simbolo: "Bs.", cotacao: 0.73 },
    { codigo: "PYG", nome: "Guarani (Paraguai)", simbolo: "₲", cotacao: 0.00073 },
    { codigo: "CRC", nome: "Colón (Costa Rica)", simbolo: "₡", cotacao: 0.0098 },
    { codigo: "DOP", nome: "Peso Dominicano (Rep. Dominicana)", simbolo: "RD$", cotacao: 0.085 }
];

export default function ConversaoValor({
    valor,
    setValor,
    moeda,
    setMoeda,
    taxaLoja,
    setEstimativa
}) {

    const moedaSelecionada = moedasAmerica.find(m => m.codigo === moeda);

    useEffect(() => {
        if (!valor || Number(valor) <= 0 || !moedaSelecionada) {
            setEstimativa(0);
            return;
        }

        const valorReais = Number(valor);
        const convertido = valorReais / moedaSelecionada.cotacao;
        const convertidoFinal = Number(convertido.toFixed(2));

        setEstimativa(convertidoFinal);

    }, [valor, moedaSelecionada, setEstimativa]);

    return (
        <div className="conversao-box">

            <h3>Conversão estimada</h3>

            <div className="conversao-campos">

                <div className="campo">
                    <label>Valor que o missionário deseja receber (R$)</label>
                    <input
                        type="number"
                        placeholder="Ex: 100"
                        value={valor}
                        onChange={(e) => setValor(e.target.value)}
                    />
                </div>

                <div className="campo">
                    <label>Moeda utilizada para pagamento</label>
                    <select
                        value={moeda}
                        onChange={(e) => setMoeda(e.target.value)}
                    >
                        <option value="">Selecione a moeda</option>
                        {moedasAmerica.map((m) => (
                            <option key={m.codigo} value={m.codigo}>
                                {m.nome}
                            </option>
                        ))}
                    </select>
                </div>

            </div>

            {valor > 0 && moedaSelecionada && (
                <div className="conversao-resultado">
                    <p>
                        Valor desejado em reais:
                        <strong> R$ {Number(valor).toFixed(2)}</strong>
                    </p>

                    <p>
                        Valor convertido (sem taxa):
                        <strong>
                            {" "}
                            {moedaSelecionada.simbolo}{" "}
                            {(Number(valor) / moedaSelecionada.cotacao).toFixed(2)}
                        </strong>
                    </p>

                    <small>
                        Este valor é apenas uma estimativa.
                        O valor final será definido pelo banco ou operadora do cartão
                        no momento do pagamento.
                    </small>
                </div>
            )}

        </div>
    );
}
