import React, { useEffect, useState } from "react";
import Produtos from "../src/components/painel/components/botoes/produtos";
import { API_URL } from "../src/config";

export default function PublicProdutos() {

    const [autorizado, setAutorizado] = useState(null);

    useEffect(() => {
        async function verificarPermissao() {
            try {
                const resp = await fetch(`${API_URL}/perm/verificar`);

                if (!resp.ok) {
                    setAutorizado(false);
                    return;
                }

                setAutorizado(true);
            } catch {
                setAutorizado(false);
            }
        }

        verificarPermissao();
    }, []);

    if (autorizado === null) {
        return (
            <div style={{ padding: 40, color: "#ccc" }}>
                Verificando permissão...
            </div>
        );
    }

    if (!autorizado) {
        return (
            <div
                style={{
                    padding: 40,
                    color: "#000000ff",
                    fontSize: 18,
                    fontWeight: 600
                }}
            >
                Não autorizado
            </div>
        );
    }

    return <Produtos />;
}
