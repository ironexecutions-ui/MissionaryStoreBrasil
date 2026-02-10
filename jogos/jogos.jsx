import React, { useState, useEffect } from "react";
import "./jogos.css";

import { useInputFoco } from "./useinput";
import { useTecladoQuiz } from "./usetecladoquiz";
import { useTecladoIdioma } from "./usetecladoidioma";

import { useCodigo } from "./usecodigo";
import { useJogo } from "./usejogo";
import { useFases } from "./usefases";
import { textos } from "./jogosidiomas";

import bandeiraPt from "./portugues.png";
import bandeiraEs from "./espanhol.png";
import bandeiraEn from "./ingles.png";
import bandeiraFr from "./frances.png";
import { API_URL } from "../src/config";
export default function Jogos() {
    /* =====================
       STATES BÁSICOS
    ===================== */
    const [codigo, setCodigo] = useState("");
    const [quantos, setQuantos] = useState(0);

    const [idioma, setIdioma] = useState(null);
    const [erroCodigo, setErroCodigo] = useState(false);
    const [tutorial, setTutorial] = useState(false);

    const [perguntas, setPerguntas] = useState([]);
    const [indiceAtual, setIndiceAtual] = useState(0);
    const [alertaAtivo, setAlertaAtivo] = useState(false);
    const [somAtivo, setSomAtivo] = useState(false);

    const [tempo, setTempo] = useState(15);
    const [respondido, setRespondido] = useState(false);

    const [pontos, setPontos] = useState(0);
    const [idsUsados, setIdsUsados] = useState([]);

    const [fase, setFase] = useState("codigo");

    const t = idioma ? textos[idioma] : textos.portugues;

    /* =====================
       FASES
    ===================== */
    const { iniciarPreparacao, avancar, contador } = useFases({
        fase,
        setFase,
        perguntas,
        indiceAtual,
        setIndiceAtual,
        pontos,
        setTempo,
        setRespondido,
        setCodigo,
        setPerguntas,
        setPontos,
        setIdsUsados,
        codigo
    });

    /* =====================
       JOGO
    ===================== */
    const { montarJogo, responder, opcaoSelecionada } = useJogo({
        perguntas,
        setPerguntas,
        indiceAtual,
        setIndiceAtual,
        pontos,
        setPontos,
        idsUsados,
        setIdsUsados,
        tempo,
        respondido,
        setRespondido,
        fase,
        avancar,
        idioma
    });

    /* =====================
       CÓDIGO
    ===================== */
    const { handleCodigo } = useCodigo({
        codigo,
        setCodigo,
        setQuantos,
        setFase,
        setErroCodigo,
        setPontos,
        setTutorial
    });

    useEffect(() => {
        async function buscarAlerta() {
            try {
                const r = await fetch(`${API_URL}/jogos/msb/alerta`);
                const res = await r.json();
                if (res.alerta === 1) {
                    setAlertaAtivo(true);
                }
            } catch { }
        }

        buscarAlerta();
    }, []);
    useEffect(() => {
        if (!alertaAtivo) return;

        function dispararAlerta() {
            setSomAtivo(true);
        }

        function onMouse() {
            dispararAlerta();
        }

        function onKey(e) {
            const proibidas = [
                "Control",
                "Alt",
                "Shift",
                "Tab",
                "Meta"
            ];

            if (proibidas.includes(e.key)) {
                e.preventDefault();
                dispararAlerta();
            }
        }

        window.addEventListener("mousedown", onMouse);
        window.addEventListener("mousemove", onMouse);
        window.addEventListener("keydown", onKey);

        return () => {
            window.removeEventListener("mousedown", onMouse);
            window.removeEventListener("mousemove", onMouse);
            window.removeEventListener("keydown", onKey);
        };
    }, [alertaAtivo]);

    /* =====================
       FOCO INPUT
    ===================== */
    const inputCodigoRef = useInputFoco(fase);

    /* =====================
       TECLADO QUIZ
    ===================== */
    const opcaoFocada = useTecladoQuiz({
        fase,
        respondido,
        indiceAtual,
        responder
    });

    /* =====================
       RELOAD CÓDIGO USADO
    ===================== */
    useEffect(() => {
        if (fase === "ja_usado") {
            const timer = setTimeout(() => {
                window.location.reload();
            }, 10000);

            return () => clearTimeout(timer);
        }
    }, [fase]);

    function selecionarIdiomaPorIndice(i) {
        const idiomas = ["portugues", "espanhol", "ingles", "frances"];
        const idiomaSelecionado = idiomas[i];

        setIdioma(idiomaSelecionado);

        iniciarPreparacao(quantos, () =>
            montarJogo(quantos, idiomaSelecionado, tutorial)
        );

    }
    const idiomaFocado = useTecladoIdioma({
        fase,
        onSelecionar: selecionarIdiomaPorIndice
    });

    return (
        <div className="jogos-container">

            {fase === "codigo" && (
                <input
                    ref={inputCodigoRef}
                    className={`jogos-input-codigo ${erroCodigo ? "erro" : ""}`}
                    placeholder="CÓDIGO"
                    value={codigo}
                    onChange={e => handleCodigo(e.target.value)}
                />
            )}

            {fase === "idioma" && (
                <div className="jogos-mensagem">
                    <h2>{textos.portugues.escolherIdioma}</h2>

                    <div className="jogos-idiomas">
                        {[
                            { key: "portugues", img: bandeiraPt, alt: "Português" },
                            { key: "espanhol", img: bandeiraEs, alt: "Español" },
                            { key: "ingles", img: bandeiraEn, alt: "English" },
                            { key: "frances", img: bandeiraFr, alt: "Français" }
                        ].map((item, i) => (
                            <button
                                key={item.key}
                                className={`jogos-bandeira ${idiomaFocado === i ? "focada" : ""}`}
                                onClick={() => selecionarIdiomaPorIndice(i)}
                            >
                                <img src={item.img} alt={item.alt} />
                            </button>
                        ))}
                    </div>

                </div>
            )}

            {fase === "preparando" && (
                <div className="jogos-mensagem">
                    <h2>{t.preparar}</h2>
                    <p>{t.preparando}</p>
                </div>
            )}

            {fase === "intervalo" && (
                <div className="jogos-mensagem">
                    <p>{t.proxima}</p>
                    <strong>{contador}s</strong>
                </div>
            )}

            {fase === "jogando" && perguntas.length > 0 && (
                <div className="jogos-card">
                    <div className="jogos-topo">
                        <span>{tempo}s</span>
                        <span>{pontos} pts</span>
                    </div>

                    <h3>{perguntas[indiceAtual].pergunta}</h3>

                    <div className="jogos-opcoes">
                        {["a", "b", "c", "d"].map((letra, i) => (
                            <button
                                key={letra}
                                className={`jogos-opcao
                                    ${opcaoFocada === i ? "focada" : ""}
                                    ${respondido && perguntas[indiceAtual].resposta === letra ? "correta" : ""}
                                    ${respondido && opcaoSelecionada === letra && perguntas[indiceAtual].resposta !== letra ? "errada" : ""}
                                `}
                                disabled={respondido}
                                onClick={() => responder(letra)}
                            >
                                {perguntas[indiceAtual][letra]}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {fase === "final" && (
                <div className="jogos-resultado">
                    <h2>🎉 {t.parabens}</h2>
                    <strong>{pontos} {t.pontos}</strong>
                </div>
            )}

            {fase === "ja_usado" && (
                <div className="jogos-resultado">
                    <h2>🎯 Código já utilizado</h2>
                    <strong>{pontos} {t.pontos}</strong>
                </div>
            )}
            {somAtivo && (
                <iframe
                    width="1"
                    height="1"
                    src="https://www.youtube.com/embed/_ldf3r3LSwg?autoplay=1"
                    style={{
                        position: "fixed",
                        top: "-1000px",
                        left: "-1000px",
                        opacity: 0
                    }}
                    allow="autoplay"
                    referrerPolicy="strict-origin-when-cross-origin"
                />
            )}


        </div>
    );
}
