import React, { useEffect, useRef, useState } from "react";
import { API_URL } from "../../../../config";
import "./produtos.css";
import { supabase } from "../../../../../supabase";

export default function Produtos() {

    const [produtos, setProdutos] = useState([]);
    const [filtroNome, setFiltroNome] = useState("");
    const [filtroCategoria, setFiltroCategoria] = useState("");
    const [modoForm, setModoForm] = useState(false);
    const inputFileRef = useRef(null);
    const [categorias, setCategorias] = useState([]);

    const [form, setForm] = useState({
        id: null,
        produto: "",
        categoria: "",
        descricao: "",
        caracteristicas: [],
        novaCaracteristica: "",
        imagens: [null, null, null, null],
        peso: "",
        altura: "",
        largura: "",
        comprimento: "",
        preco: ""
    });

    function parseCaracteristicas(valor) {
        if (!valor) return [];
        if (Array.isArray(valor)) return valor;
        try {
            return JSON.parse(valor);
        } catch {
            return valor.split(";").map(v => v.trim()).filter(Boolean);
        }
    }

    async function carregarProdutos() {
        const resp = await fetch(`${API_URL}/produtos`);
        const json = await resp.json();
        if (json.ok) {
            const listaFiltrada = json.lista.filter(p => p.apagado !== 1);
            setProdutos(listaFiltrada);
        }
    }

    useEffect(() => {
        carregarProdutos();

        async function carregarCategorias() {
            const resp = await fetch(`${API_URL}/produtos/categorias`);
            const json = await resp.json();
            if (json.ok) setCategorias(json.categorias);
        }

        carregarCategorias();
    }, []);
    async function removerImagem(index, url) {
        const nomeArquivo = url.split("/").pop();

        const { error } = await supabase
            .storage
            .from("produtos")
            .remove([nomeArquivo]);

        if (error) {
            console.error(error);
            alert("Erro ao remover imagem");
            return;
        }

        const imgs = [...form.imagens];
        imgs[index] = null;

        setForm({ ...form, imagens: imgs });
    }


    function abrirNovo() {
        setForm({
            id: null,
            produto: "",
            categoria: "",
            descricao: "",
            caracteristicas: [],
            novaCaracteristica: "",
            imagens: [null, null, null, null],
            peso: "",
            altura: "",
            largura: "",
            comprimento: "",
            preco: ""
        });
        setModoForm(true);
    }

    function editar(p) {
        setForm({
            id: p.id,
            produto: p.produto,
            categoria: p.categoria,
            descricao: p.descricao,
            caracteristicas: parseCaracteristicas(p.caracteristicas),
            novaCaracteristica: "",
            imagens: [p.imagem_um, p.imagem_dois, p.imagem_tres, p.imagem_quatro],
            peso: p.peso || "",
            altura: p.altura || "",
            largura: p.largura || "",
            comprimento: p.comprimento || "",
            preco: p.preco || ""
        });
        setModoForm(true);
    }

    async function apagarProduto(id) {
        const confirmar = window.confirm("Deseja realmente remover este produto?");
        if (!confirmar) return;

        const resp = await fetch(`${API_URL}/produtos/apagar/${id}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" }
        });

        const json = await resp.json();
        if (json.ok) carregarProdutos();
    }

    function adicionarCaracteristica() {
        if (!form.novaCaracteristica.trim()) return;
        setForm({
            ...form,
            caracteristicas: [...form.caracteristicas, form.novaCaracteristica],
            novaCaracteristica: ""
        });
    }

    function removerCaracteristica(i) {
        const nova = [...form.caracteristicas];
        nova.splice(i, 1);
        setForm({ ...form, caracteristicas: nova });
    }

    function escolherImagem(i) {
        inputFileRef.current.dataset.index = i;
        inputFileRef.current.click();
    }

    async function enviarImagem(e) {
        const file = e.target.files[0];
        if (!file) return;

        const index = inputFileRef.current.dataset.index;

        const nomeArquivo = `${Date.now()}-${file.name}`;

        const { error } = await supabase
            .storage
            .from("produtos")
            .upload(nomeArquivo, file, { upsert: false });

        if (error) {
            alert("Erro ao enviar imagem");
            return;
        }

        const { data } = supabase
            .storage
            .from("produtos")
            .getPublicUrl(nomeArquivo);

        const imgs = [...form.imagens];
        imgs[index] = data.publicUrl;

        setForm({ ...form, imagens: imgs });

        inputFileRef.current.value = "";
    }


    async function salvar() {
        const resp = await fetch(`${API_URL}/produtos/salvar`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                ...form,
                caracteristicas: form.caracteristicas.join("; ")
            })
        });

        const json = await resp.json();
        if (json.ok) {
            carregarProdutos();
            setModoForm(false);
        }
    }

    return (
        <main className="ppp-produtos-container">

            <h2 className="ppp-titulo">Produtos</h2>

            {!modoForm && (
                <>
                    <div className="ppp-filtros">
                        <input
                            placeholder="Filtrar por nome"
                            value={filtroNome}
                            onChange={e => setFiltroNome(e.target.value)}
                        />
                        <input
                            placeholder="Filtrar por categoria"
                            value={filtroCategoria}
                            onChange={e => setFiltroCategoria(e.target.value)}
                        />
                        <button className="ppp-btn-add" onClick={abrirNovo}>
                            + Adicionar Produto
                        </button>
                    </div>

                    <div className="ppp-tabela-box">
                        <table className="ppp-tabela">
                            <thead>
                                <tr>
                                    <th>Imagens</th>
                                    <th>Produto</th>
                                    <th>Categoria</th>
                                    <th>Descrição</th>
                                    <th>Características</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {produtos
                                    .filter(p => p.produto.toLowerCase().includes(filtroNome.toLowerCase()))
                                    .filter(p => p.categoria.toLowerCase().includes(filtroCategoria.toLowerCase()))
                                    .map(p => (
                                        <tr key={p.id}>
                                            <td>
                                                <div className="ppp-imgs-mini">
                                                    {[p.imagem_um, p.imagem_dois, p.imagem_tres, p.imagem_quatro].map((img, i) =>
                                                        img ? (
                                                            <img key={i} src={img} className="ppp-mini" />
                                                        ) : (
                                                            <div key={i} className="ppp-mini ppp-mini-vazio"></div>
                                                        )
                                                    )}
                                                </div>
                                            </td>
                                            <td>{p.produto}</td>
                                            <td>{p.categoria}</td>
                                            <td>{p.descricao}</td>
                                            <td>{parseCaracteristicas(p.caracteristicas).join(", ")}</td>
                                            <td style={{ display: "flex", gap: "8px" }}>
                                                <button className="ppp-btn-editar" onClick={() => editar(p)}>
                                                    Editar
                                                </button>
                                                <button
                                                    className="ppp-btn-editar"
                                                    style={{ borderColor: "#ff5c5c", color: "#ff5c5c" }}
                                                    onClick={() => apagarProduto(p.id)}
                                                >
                                                    Apagar
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}

            {modoForm && (
                <div className="ppp-form-box">
                    <button className="ppp-btn-voltar" onClick={() => setModoForm(false)}>
                        ← Voltar
                    </button>

                    <h3>{form.id ? "Editar Produto" : "Novo Produto"}</h3>

                    <div className="ppp-imgs-form">
                        {form.imagens.map((img, i) => (
                            <div
                                key={i}
                                className="ppp-img-slot"
                                onClick={() => {
                                    inputFileRef.current.dataset.index = i;
                                    inputFileRef.current.click();
                                }}
                                onDragOver={e => e.preventDefault()}
                                onDrop={e => {
                                    e.preventDefault();
                                    inputFileRef.current.dataset.index = i;

                                    const file = e.dataTransfer.files[0];
                                    if (!file) return;

                                    enviarImagem({ target: { files: [file] } });
                                }}
                            >


                                <span className="ppp-img-num">{i + 1}</span>
                                {img ? (
                                    <>
                                        <img src={img} className="ppp-img-preview" />
                                        <button
                                            className="ppp-img-delete"
                                            onClick={e => {
                                                e.stopPropagation();
                                                removerImagem(i, img);
                                            }}
                                        >
                                            🗑
                                        </button>
                                    </>
                                ) : (
                                    <div className="ppp-img-vazia">Arraste</div>
                                )}


                            </div>
                        ))}
                    </div>

                    <input
                        ref={inputFileRef}
                        type="file"
                        accept="image/*"
                        capture="environment"
                        style={{ display: "none" }}
                        onChange={enviarImagem}
                    />


                    <label>Produto</label>
                    <input value={form.produto} onChange={e => setForm({ ...form, produto: e.target.value })} />

                    <label>Categoria</label>
                    <input
                        list="lista-categorias"
                        value={form.categoria}
                        onChange={e => setForm({ ...form, categoria: e.target.value })}
                    />

                    <datalist id="lista-categorias">
                        {categorias.map((cat, i) => (
                            <option key={i} value={cat} />
                        ))}
                    </datalist>

                    <label>Descrição</label>
                    <textarea value={form.descricao} onChange={e => setForm({ ...form, descricao: e.target.value })} />

                    <label>Peso (kg)</label>
                    <input type="number" step="0.01" value={form.peso} onChange={e => setForm({ ...form, peso: e.target.value })} />

                    <label>Altura (cm)</label>
                    <input type="number" step="0.01" value={form.altura} onChange={e => setForm({ ...form, altura: e.target.value })} />

                    <label>Largura (cm)</label>
                    <input type="number" step="0.01" value={form.largura} onChange={e => setForm({ ...form, largura: e.target.value })} />

                    <label>Comprimento (cm)</label>
                    <input type="number" step="0.01" value={form.comprimento} onChange={e => setForm({ ...form, comprimento: e.target.value })} />

                    <label>Preço do produto</label>
                    <input type="number" step="0.01" value={form.preco} onChange={e => setForm({ ...form, preco: e.target.value })} />

                    <label>Características</label>
                    <div className="ppp-caracts">
                        <input
                            placeholder="Digite e clique +"
                            value={form.novaCaracteristica}
                            onChange={e => setForm({ ...form, novaCaracteristica: e.target.value })}
                        />
                        <button className="ppp-btn-add-lista" onClick={adicionarCaracteristica}>
                            +
                        </button>
                    </div>

                    <ul className="ppp-lista-caracts">
                        {form.caracteristicas.map((c, i) => (
                            <li key={i}>
                                {c}
                                <button className="ppp-caract-del" onClick={() => removerCaracteristica(i)}>
                                    ×
                                </button>
                            </li>
                        ))}
                    </ul>

                    <button className="ppp-btn-salvar" onClick={salvar}>
                        Salvar
                    </button>
                    <br /><br /><br /><br />
                    <br />
                </div>
            )}
            <br /><br /><br /><br /><br /><br /><br /><br /><br />
        </main>
    );
}
