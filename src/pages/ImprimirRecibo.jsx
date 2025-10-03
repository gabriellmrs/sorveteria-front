// ImprimirRecibo.jsx
import React, { useEffect, useState, useRef } from "react";
import URL from "../service/url.js";
import styles from "../styles/ImprimirRecibo.module.css";

/*
  Comportamento:
  - Busca clientes e produtos do backend (mesmas rotas que você já usa).
  - Permite adicionar linhas (produto + qtd).
  - Calcula subtotal, aplica desconto (valor absoluto).
  - Ao clicar em "Imprimir", faz POST para `${URL}/v-cliente` com { nome: cliente, valor: total } (como seu RegistrarVendaCliente)
    e em seguida chama window.print().
  - Opção "duas cópias" gera duas cópias lado a lado via CSS para impressão.
*/

const ImprimirRecibo = () => {
    const token = localStorage.getItem("token");
    const [clientes, setClientes] = useState([]);
    const [produtos, setProdutos] = useState([]);
    const [clienteSelecionado, setClienteSelecionado] = useState("");
    const [itens, setItens] = useState([
        { produto: "", nomeProduto: "", quantidade: 1, valorUnitario: 0, total: 0 },
    ]);
    const [desconto, setDesconto] = useState(0); // em reais (valor absoluto)
    const [duasCopias, setDuasCopias] = useState(false);
    const [mostrarSugestoes, setMostrarSugestoes] = useState(false);
    const sugestoesRef = useRef(null);

    useEffect(() => {
        fetchClientes();
        fetchProdutos();
        // fechar sugestões ao clicar fora
        const handler = (e) => {
            if (sugestoesRef.current && !sugestoesRef.current.contains(e.target)) {
                setMostrarSugestoes(false);
            }
        };
        window.addEventListener("click", handler);
        return () => window.removeEventListener("click", handler);
    }, []);

    const fetchClientes = async () => {
        try {
            const res = await fetch(`${URL}/clientes`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            setClientes(data);
        } catch (err) {
            console.error("Erro ao buscar clientes:", err);
        }
    };

    const fetchProdutos = async () => {
        try {
            const res = await fetch(`${URL}/produto`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            setProdutos(data);
        } catch (err) {
            console.error("Erro ao buscar produtos:", err);
        }
    };

    // helpers
    const atualizarItem = (index, campo, valor) => {
        const novo = [...itens];
        if (campo === "produto") {
            // achar produto e preencher valorUnitario e nomeProduto
            const p = produtos.find((x) => x.NOME === valor);
            novo[index].produto = p ? p.ID : "";
            novo[index].nomeProduto = p ? p.NOME : valor;
            novo[index].valorUnitario = p ? Number(p.VALOR) : Number(novo[index].valorUnitario || 0);
            // recalcula total
            novo[index].total = Number(novo[index].quantidade || 0) * Number(novo[index].valorUnitario || 0);
        } else if (campo === "quantidade") {
            novo[index].quantidade = Number(valor || 0);
            novo[index].total = Number(novo[index].quantidade || 0) * Number(novo[index].valorUnitario || 0);
        } else if (campo === "valorUnitario") {
            novo[index].valorUnitario = Number(valor || 0);
            novo[index].total = Number(novo[index].quantidade || 0) * Number(novo[index].valorUnitario || 0);
        }
        setItens(novo);
    };

    const adicionarLinha = () => {
        setItens([...itens, { produto: "", nomeProduto: "", quantidade: 1, valorUnitario: 0, total: 0 }]);
    };

    const removerLinha = (index) => {
        const novo = itens.filter((_, i) => i !== index);
        setItens(novo.length ? novo : [{ produto: "", nomeProduto: "", quantidade: 1, valorUnitario: 0, total: 0 }]);
    };

    const subtotal = itens.reduce((acc, it) => acc + Number(it.total || 0), 0);
    const totalComDesconto = Math.max(0, subtotal - Number(desconto || 0));

    // Registra venda no backend (usando mesma rota do RegistrarVendaCliente)
    const registrarVendaNoBackend = async (nomeCliente, valorTotal) => {
        try {
            const resp = await fetch(`${URL}/v-cliente`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ nome: nomeCliente, valor: Number(valorTotal) }),
            });

            if (!resp.ok) {
                const txt = await resp.text();
                throw new Error(txt || "Erro ao registrar venda no backend");
            }

            return true;
        } catch (err) {
            console.error("Erro registrar venda:", err);
            return false;
        }
    };

    // Função chamada ao imprimir
    const handleImprimir = async () => {
        if (!clienteSelecionado || clienteSelecionado.trim() === "") {
            alert("Selecione um cliente antes de imprimir.");
            return;
        }
        // registrar venda (somente total) - repete se imprimir duas cópias? vamos registrar apenas 1 vez.
        const registrado = await registrarVendaNoBackend(clienteSelecionado, totalComDesconto);
        if (!registrado) {
            alert("Não foi possível registrar a venda. Verifique o console.");
            return;
        }

        // pequena espera para garantir persistência antes de imprimir
        setTimeout(() => {
            window.print();
        }, 300);
    };

    // Auto-seleção por digitação simples (autocomplete)
    const handleChangeCliente = (val) => {
        setClienteSelecionado(val);
        if (val.trim().length > 0) {
            setMostrarSugestoes(true);
        } else {
            setMostrarSugestoes(false);
        }
    };

    const selecionarCliente = (c) => {
        setClienteSelecionado(c.NOME);
        setMostrarSugestoes(false);
    };

    // Formatação local BR
    const formatMoney = (v) =>
        Number(v || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

    return (
        <div className={styles.wrapper}>
            <h2 className={styles.titulo}> EMITIR NOTA</h2>

            <div className={styles.formArea}>
                <label>Cliente</label>
                <div className={styles.autocomplete} ref={sugestoesRef}>
                    <input
                        type="text"
                        value={clienteSelecionado}
                        onChange={(e) => handleChangeCliente(e.target.value)}
                        placeholder="Digite o nome do cliente"
                        className={styles.input}
                        autoComplete="off"
                    />
                    {mostrarSugestoes && clientes.length > 0 && (
                        <ul className={styles.sugestoes}>
                            {clientes
                                .filter((c) => c.NOME.toLowerCase().includes(clienteSelecionado.toLowerCase()))
                                .slice(0, 8)
                                .map((c) => (
                                    <li key={c.ID} onClick={() => selecionarCliente(c)}>
                                        {c.NOME} — {c.CIDADE}/{c.BAIRRO}
                                    </li>
                                ))}
                        </ul>
                    )}
                </div>

                <div className={styles.itensHeader}>
                    <h3>Itens</h3>
                    <button type="button" className={styles.smallButton} onClick={adicionarLinha}>
                        + Adicionar linha
                    </button>
                </div>

                <div className={styles.itensTableWrapper}>
                    <table className={styles.itensTable}>
                        <thead>
                            <tr>
                                <th>Qnt.</th>
                                <th>Descrição</th>
                                <th>V. Unit.</th>
                                <th>Total R$</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {itens.map((it, idx) => (
                                <tr key={idx}>
                                    <td>
                                        <input
                                            type="text"
                                            className={styles.qtdInput}
                                            value={it.quantidade}
                                            onChange={(e) => atualizarItem(idx, "quantidade", e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <select
                                            className={styles.prodSelect}
                                            value={it.nomeProduto}
                                            onChange={(e) => atualizarItem(idx, "produto", e.target.value)}
                                        >
                                            <option value="">Produto</option>
                                            {produtos.map((p) => (
                                                <option key={p.ID} value={p.NOME}>
                                                    {p.NOME}
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            step="0.01"
                                            className={styles.valorInput}
                                            value={it.valorUnitario}
                                            onChange={(e) => atualizarItem(idx, "valorUnitario", e.target.value)}
                                        />
                                    </td>
                                    <td>{formatMoney(it.total)}</td>
                                    <td>
                                        <button className={styles.minDelete} onClick={() => removerLinha(idx)}>
                                            Remover
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className={styles.summaryRow}>
                    <div>
                        <label>Desconto (R$)</label>
                        <input
                            type="number"
                            value={desconto === 0 ? "" : desconto} // se for zero mostra vazio
                            onChange={(e) => setDesconto(e.target.value === "" ? 0 : Number(e.target.value))}
                            className={styles.input}
                        />

                        <div className={styles.checkboxRow}>
                            <label>
                                <input type="checkbox" checked={duasCopias} onChange={(e) => setDuasCopias(e.target.checked)} />{" "}
                                Imprimir 2 cópias por página
                            </label>
                        </div>
                    </div>

                    <div className={styles.valuesBox}>
                        <div>Subtotal: <strong>{formatMoney(subtotal)}</strong></div>
                        <div>Desconto: <strong>- {formatMoney(desconto)}</strong></div>
                        <div className={styles.totalFinal}>Total: <strong>{formatMoney(totalComDesconto)}</strong></div>
                        <div className={styles.actions}>
                            <button className={styles.primary} onClick={handleImprimir}>Imprimir e Registrar Venda</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Área para impressão — duas cópias se duasCopias === true */}
            <div className={styles.printArea} data-duascopias={duasCopias ? "true" : "false"}>
                {/* Renderiza 1 ou 2 cópias lado a lado */}
                <div className={styles.receipt}>
                    <div className={styles.header}>
                        <div className={styles.logo}>
                            <img src="/logo_sorvemix.png" alt="Sorvemix" />
                        </div>
                        <div className={styles.company}>
                            <div>SORVEMIX</div>
                            <div>RUA GIRASSOL, N 121</div>
                            <div>Tomba - Feira de Santana - BA</div>
                            <div>Tel: (75) 98189-1429</div>
                        </div>
                        <div className={styles.meta}>
                            <div><strong>CLIENTE</strong><div>{clienteSelecionado}</div></div>
                            <div><strong>DATA</strong><div>{new Date().toLocaleDateString("pt-BR")}</div></div>
                        </div>
                    </div>

                    <table className={styles.printTable}>
                        <thead>
                            <tr>
                                <th>QUANT.</th>
                                <th>DESCRIÇÃO DO PRODUTO</th>
                                <th>V.UNITÁRIO</th>
                                <th>TOTAL R$</th>
                            </tr>
                        </thead>
                        <tbody>
                            {itens.map((it, i) => (
                                <tr key={i}>
                                    <td>{it.quantidade}</td>
                                    <td>{it.nomeProduto || "-"}</td>
                                    <td>{formatMoney(it.valorUnitario)}</td>
                                    <td>{formatMoney(it.total)}</td>
                                </tr>
                            ))}
                            {/* preencher linhas vazias até 10 linhas (opcional) */}
                            {Array.from({ length: Math.max(0, 10 - itens.length) }).map((_, i) => (
                                <tr key={`empty-${i}`}>
                                    <td>&nbsp;</td>
                                    <td>&nbsp;</td>
                                    <td>&nbsp;</td>
                                    <td>&nbsp;</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className={styles.footer}>
                        <div className={styles.signatureBox}>
                            <div>Assinatura e Carimbo</div>
                            <div className={styles.signatureLine}></div>
                        </div>

                        <div className={styles.totalsBox}>
                            <div><span>Total R$</span><strong>{formatMoney(totalComDesconto)}</strong></div>
                            <div><span>Valor AD R$</span><strong>{formatMoney(0)}</strong></div>
                            <div><span>Desconto</span><strong>{formatMoney(desconto)}</strong></div>
                            <div><span>Valor REST R$</span><strong>{formatMoney(totalComDesconto)}</strong></div>
                        </div>
                    </div>
                </div>

                {duasCopias && (
                    <div className={styles.receipt}>
                        {/* segunda cópia — pode ser igual à primeira */}
                        <div className={styles.header}>
                            <div className={styles.logo}>
                                <img src="/logo_sorvemix.png" alt="Sorvemix" />
                            </div>
                            <div className={styles.company}>
                                <div>SORVEMIX</div>
                                <div>RUA GIRASSOL, N 121</div>
                                <div>Tomba - Feira de Santana - BA</div>
                                <div>Tel: (75) 98189-1429</div>
                            </div>
                            <div className={styles.meta}>
                                <div><strong>CLIENTE</strong><div>{clienteSelecionado}</div></div>
                                <div><strong>DATA</strong><div>{new Date().toLocaleDateString("pt-BR")}</div></div>
                            </div>
                        </div>

                        <table className={styles.printTable}>
                            <thead>
                                <tr>
                                    <th>QUANT.</th>
                                    <th>DESCRIÇÃO DO PRODUTO</th>
                                    <th>V.UNITÁRIO</th>
                                    <th>TOTAL R$</th>
                                </tr>
                            </thead>
                            <tbody>
                                {itens.map((it, i) => (
                                    <tr key={`c2-${i}`}>
                                        <td>{it.quantidade}</td>
                                        <td>{it.nomeProduto || "-"}</td>
                                        <td>{formatMoney(it.valorUnitario)}</td>
                                        <td>{formatMoney(it.total)}</td>
                                    </tr>
                                ))}
                                {Array.from({ length: Math.max(0, 10 - itens.length) }).map((_, i) => (
                                    <tr key={`c2-empty-${i}`}>
                                        <td>&nbsp;</td>
                                        <td>&nbsp;</td>
                                        <td>&nbsp;</td>
                                        <td>&nbsp;</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className={styles.footer}>
                            <div className={styles.signatureBox}>
                                <div>Assinatura e Carimbo</div>
                                <div className={styles.signatureLine}></div>
                            </div>

                            <div className={styles.totalsBox}>
                                <div><span>Total R$</span><strong>{formatMoney(totalComDesconto)}</strong></div>
                                <div><span>Valor AD R$</span><strong>{formatMoney(0)}</strong></div>
                                <div><span>Desconto</span><strong>{formatMoney(desconto)}</strong></div>
                                <div><span>Valor REST R$</span><strong>{formatMoney(totalComDesconto)}</strong></div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

        </div>
    );
};

export default ImprimirRecibo;
