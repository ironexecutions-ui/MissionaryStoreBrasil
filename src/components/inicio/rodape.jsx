import React, { useEffect, useRef, useState } from "react";
import "./rodape.css";
import instagramIcon from "./rodape/instagram.png";
import tiktokIcon from "./rodape/tiktok.png";
import zapIcon from "./rodape/zap.png";

export default function Rodape() {

    const numero = "5511994381409";

    const rodapeRef = useRef(null);
    const [mostrarBarraMobile, setMostrarBarraMobile] = useState(false);

    function abrirZap(texto) {
        const msg = encodeURIComponent(texto);
        window.open(`https://wa.me/${numero}?text=${msg}`, "_blank");
    }

    useEffect(() => {

        function verificarScroll() {

            if (window.innerWidth >= 500) {
                setMostrarBarraMobile(false);
                return;
            }

            const rodape = rodapeRef.current;
            if (!rodape) return;

            const rect = rodape.getBoundingClientRect();

            // Se o topo do rodapé ainda não apareceu na tela
            if (rect.top > window.innerHeight) {
                setMostrarBarraMobile(true);
            } else {
                setMostrarBarraMobile(false);
            }
        }

        verificarScroll();

        window.addEventListener("scroll", verificarScroll);
        window.addEventListener("resize", verificarScroll);

        return () => {
            window.removeEventListener("scroll", verificarScroll);
            window.removeEventListener("resize", verificarScroll);
        };

    }, []);

    return (
        <>
            {/* ================= MOBILE FIXO ================= */}
            {mostrarBarraMobile && (
                <div className="rodape-mobile-fixo">

                    <a
                        href="https://www.instagram.com/missionarystore.brasil/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rodape-mobile-icon"
                    >
                        <img src={instagramIcon} alt="Instagram" />
                    </a>

                    <a
                        href="https://www.tiktok.com/@missionary.store"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rodape-mobile-icon"
                    >
                        <img src={tiktokIcon} alt="TikTok" />
                    </a>

                    <button
                        className="rodape-mobile-icon"
                        onClick={() => abrirZap("Olá, gostaria de falar com a Missionary Store Brasil.")}
                    >
                        <img src={zapIcon} alt="WhatsApp" />
                    </button>

                </div>

            )}

            {/* ================= RODAPÉ NORMAL ================= */}
            <footer ref={rodapeRef} className="rodape-box">

                <div className="rodape-conteudo">

                    <div className="rodape-coluna">
                        <h3>Missionary Store Brasil</h3>
                        <p>
                            Produtos de qualidade para apoiar<br />
                            sua missão com conforto e estilo.
                        </p>
                    </div>

                    <div className="rodape-coluna">
                        <h4>Fale conosco</h4>
                        <ul>
                            <li onClick={() => abrirZap("Olá, tudo bem? Gostaria de entrar em contato com o atendimento da Missionary Store Brasil.")}>
                                Contato
                            </li>

                            <li onClick={() => abrirZap("Olá, poderia me ajudar? Tenho uma dúvida sobre um produto da Missionary Store Brasil.")}>
                                Ajuda
                            </li>

                            <li onClick={() => abrirZap("Oi, queria saber mais informações sobre envio e entrega dos produtos.")}>
                                Envio e entrega
                            </li>

                            <li onClick={() => abrirZap("Olá, gostaria de saber como funcionam as trocas e devoluções.")}>
                                Trocas e devoluções
                            </li>
                        </ul>
                    </div>

                    <div className="rodape-coluna">
                        <h4>Redes sociais</h4>
                        <ul>
                            <li>
                                <a
                                    href="https://www.instagram.com/missionarystore.brasil/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Instagram
                                </a>
                            </li>

                            <li>
                                <a
                                    href="https://www.tiktok.com/@missionary.store"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    TikTok
                                </a>
                            </li>

                            <li onClick={() => abrirZap("Olá, gostaria de falar com a Missionary Store Brasil.")}>
                                WhatsApp
                            </li>

                        </ul>
                    </div>

                </div>

                <div className="rodape-final">
                    <p>
                        Desenvolvido por
                        <a href="https://ironexecutions.com.br" target="_blank" rel="noopener noreferrer">
                            {" "}Iron Executions
                        </a>
                    </p>
                </div>

            </footer>
        </>
    );
}
