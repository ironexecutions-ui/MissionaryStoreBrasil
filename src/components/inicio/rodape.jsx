import React from "react";
import "./rodape.css";

export default function Rodape() {

    const numero = "5511994381409";

    function abrirZap(texto) {
        const msg = encodeURIComponent(texto);
        window.open(`https://wa.me/${numero}?text=${msg}`, "_blank");
    }

    return (
        <footer className="rodape-box">

            <div className="rodape-conteudo">

                <div className="rodape-coluna">
                    <h3>Missionary Store Brasil</h3>
                    <p>Produtos de qualidade para apoiar<br /> sua missão  com conforto e estilo.</p>
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
                            <a href="https://www.instagram.com/missionarystore.brasil/"
                                target="_blank"
                                rel="noopener noreferrer">
                                Instagram
                            </a>
                        </li>

                        <li>
                            <a href="https://www.tiktok.com/@missionary.store"
                                target="_blank"
                                rel="noopener noreferrer">
                                TikTok
                            </a>
                        </li>

                        <li>
                            <a href="#" target="_blank" rel="noopener noreferrer">
                                WhatsApp
                            </a>
                        </li>

                    </ul>
                </div>

            </div>

            <div className="rodape-final">
                <p>
                    Feito por
                    <a href="https://ironexecutions.com.br" target="_blank" rel="noopener noreferrer">
                        {" "}Iron Executions
                    </a>
                </p>
            </div>

        </footer>
    );
}
