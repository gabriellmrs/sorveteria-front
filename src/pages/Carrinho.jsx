import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import URL from '../service/url.js';
import styles from '../styles/Carrinho.module.css';

const Carrinho = () => {
    const { nome } = useParams();

    const [retornos, setRetornos] = useState([]);
    const [totalPagar, setTotalPagar] = useState(null);
    const [showModalSaida, setShowModalSaida] = useState(false);
    const [showModalRetorno, setShowModalRetorno] = useState(false);
    const [produtosSaida, setProdutosSaida] = useState([{ produto: '', quantidade: '', valorUnidade: '' }]);
    const [produtoRetorno, setProdutoRetorno] = useState({ nomeProduto: '', quantidadeRetorno: '' });
    const [idSaidaAtual, setIdSaidaAtual] = useState(null);
    const [produtosDisponiveis, setProdutosDisponiveis] = useState([]);

    const buscarRetorno = async () => {
        try {
            const response = await fetch(`${URL}/carrinho/hoje/${nome}`);
            if (response.ok) {
                const data = await response.json();
                setRetornos(data);
            } else {
                setRetornos([]);
                setTotalPagar(0);
            }

            const totalRes = await fetch(`${URL}/carrinho/total-hoje/${nome}`);
            if (totalRes.ok) {
                const totalData = await totalRes.json();
                setTotalPagar(totalData.total_a_pagar);
            } else {
                setTotalPagar(0);
            }
        } catch (err) {
            console.error(err.message);
        }
    };

    const buscarProdutos = async () => {
        try {
            const res = await fetch(`${URL}/produto`);
            const data = await res.json();
            setProdutosDisponiveis(data);
        } catch (err) {
            console.error('Erro ao buscar produtos:', err.message);
        }
    };

    const criarOuObterSaidaDoDia = async () => {
        try {
            const checkSaidaRes = await fetch(`${URL}/carrinho/${nome}/saida-hoje`);
            if (checkSaidaRes.ok) {
                const data = await checkSaidaRes.json();
                setIdSaidaAtual(data.idSaida);
                return data.idSaida;
            } else if (checkSaidaRes.status === 404) {
                const response = await fetch(`${URL}/carrinho/${nome}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ nomeVendedor: nome }),
                });
                const data = await response.json();
                setIdSaidaAtual(data.idSaida);
                return data.idSaida;
            }
        } catch (err) {
            console.error(err.message);
        }
    };

    const deletarSaida = async () => {
        if (!idSaidaAtual) return;

        const confirmar = window.confirm('Tem certeza que deseja deletar toda a saída de hoje?');
        if (!confirmar) return;

        try {
            const response = await fetch(`${URL}/carrinho/${idSaidaAtual}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                alert('Saída deletada com sucesso!');
                setRetornos([]);
                setTotalPagar(0);
                setIdSaidaAtual(null);
            } else {
                const erro = await response.json();
                alert('Erro: ' + erro.erro);
            }
        } catch (err) {
            console.error('Erro ao deletar saída:', err.message);
        }
    };


    const enviarProdutosSaida = async () => {
        if (!idSaidaAtual) return;

        try {
            for (const p of produtosSaida) {
                if (!p.produto || !p.quantidade || !p.valorUnidade) return;

                await fetch(`${URL}/carrinho/${idSaidaAtual}/produtos`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        produto: p.produto,
                        quantidade_saida: p.quantidade,
                        valor_unidade: p.valorUnidade,
                        quantidade_retorno: 0,
                    }),
                });
            }
            setShowModalSaida(false);
            setProdutosSaida([{ produto: '', quantidade: '', valorUnidade: '' }]);
            buscarRetorno();
        } catch (err) {
            console.error(err.message);
        }
    };

    const enviarRetornoProduto = async () => {
        if (!produtoRetorno.nomeProduto || !produtoRetorno.quantidadeRetorno) return;

        try {
            const response = await fetch(`${URL}/carrinho/${nome}/retorno-produto`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    produto: produtoRetorno.nomeProduto,
                    quantidadeRetorno: Number(produtoRetorno.quantidadeRetorno),
                }),
            });

            if (response.ok) {
                setShowModalRetorno(false);
                setProdutoRetorno({ nomeProduto: '', quantidadeRetorno: '' });
                buscarRetorno();
            }
        } catch (err) {
            console.error(err.message);
        }
    };

    const handleChangeSaida = (index, field, value) => {
        const newProdutos = [...produtosSaida];
        newProdutos[index][field] = value;
        setProdutosSaida(newProdutos);
    };

    const handleChangeProdutoSaida = (index, value) => {
        const produtoSelecionado = produtosDisponiveis.find(p => p.NOME === value);
        const newProdutos = [...produtosSaida];
        newProdutos[index].produto = value;
        newProdutos[index].valorUnidade = produtoSelecionado ? produtoSelecionado.VALOR : '';
        setProdutosSaida(newProdutos);
    };

    const adicionarProdutoSaida = () => {
        setProdutosSaida([...produtosSaida, { produto: '', quantidade: '', valorUnidade: '' }]);
    };

    const handleChangeRetorno = (field, value) => {
        setProdutoRetorno(prev => ({ ...prev, [field]: value }));
    };

    useEffect(() => {
        buscarRetorno();
        criarOuObterSaidaDoDia();
        buscarProdutos();
    }, [nome]);

    return (
        <div className={styles.container}>
            <div className={styles.buttonGroup}>
                <button className={styles.button} onClick={() => { buscarProdutos(); setShowModalSaida(true); }}>Registrar Saída de Produtos</button>
                <button className={styles.button} onClick={() => setShowModalRetorno(true)}>Registrar Retorno</button>
                <button
                    className={`${styles.button} ${styles.deleteButton}`}
                    onClick={deletarSaida}
                    disabled={!idSaidaAtual}
                >
                    Deletar Saída de Hoje
                </button>
            </div>

            {/* Modal de Saída */}
            {showModalSaida && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <h3>Registrar Produtos de Saída</h3>
                        {produtosSaida.map((p, index) => (
                            <div key={index} className={styles.inputGroup}>
                                <select
                                    value={p.produto}
                                    onChange={(e) => handleChangeProdutoSaida(index, e.target.value)}
                                >
                                    <option value="">Selecione um produto</option>
                                    {produtosDisponiveis.map((produto) => (
                                        <option key={produto.ID} value={produto.NOME}>
                                            {produto.NOME}
                                        </option>
                                    ))}
                                </select>
                                <input
                                    type="number"
                                    placeholder="Qtd"
                                    value={p.quantidade}
                                    onChange={(e) => handleChangeSaida(index, 'quantidade', e.target.value)}
                                />
                                <input
                                    type="number"
                                    placeholder="Valor"
                                    step="0.01"
                                    value={p.valorUnidade}
                                    onChange={(e) => handleChangeSaida(index, 'valorUnidade', e.target.value)}
                                />
                            </div>
                        ))}
                    <div className={styles.buttonRow}>
                        <button className={styles.button} onClick={adicionarProdutoSaida}>Adicionar Mais</button>
                        <button className={styles.button} onClick={enviarProdutosSaida}>Confirmar Saída</button>
                        <button className={`${styles.button} ${styles.deleteButton}`} onClick={() => setShowModalSaida(false)}>Cancelar</button>
                    </div>
                    </div>

                </div>
            )}

            {/* Modal de Retorno */}
            {showModalRetorno && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <h3>Registrar Retorno de Produto</h3>
                        <div className={styles.inputGroup}>
                            <select
                                value={produtoRetorno.nomeProduto}
                                onChange={(e) => handleChangeRetorno('nomeProduto', e.target.value)}
                            >
                                <option value="">Selecione um produto</option>
                                {retornos.map((item, index) => (
                                    <option key={index} value={item.produto}>
                                        {item.produto} (Saída: {item.quantidade_saida})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className={styles.inputGroup}>
                            <input
                                type="number"
                                placeholder="Qtd Retorno"
                                value={produtoRetorno.quantidadeRetorno}
                                onChange={(e) => handleChangeRetorno('quantidadeRetorno', e.target.value)}
                            />
                        </div>
                        <div className={styles.buttonRow}>
                        <button className={styles.button} onClick={enviarRetornoProduto}>Confirmar Retorno</button>
                        <button className={`${styles.button} ${styles.deleteButton}`}  onClick={() => setShowModalRetorno(false)}>Cancelar</button>
                        </div>
                    </div>
                </div>
            )}

            <h3>Produtos Levados Hoje</h3>
            {retornos.length > 0 ? (
                <div className={styles.list}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Produto</th>
                                <th>Qtd Saída</th>
                                <th>Retorno</th>
                                <th>Vendido</th>
                                <th>Valor Unid</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {retornos.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.produto}</td>
                                    <td>{item.quantidade_saida}</td>
                                    <td>{item.quantidade_retorno}</td>
                                    <td>{item.quantidade_vendida}</td>
                                    <td>R$ {Number(item.valor_unidade).toFixed(2)}</td>
                                    <td>R$ {Number(item.total_unidade).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className={styles.txt}>Nenhum produto encontrado hoje para {nome}.</p>
            )}

            {totalPagar !== null && (
                <h4 className={styles.totalPagar}>
                    <strong>Total a Pagar Hoje:</strong> R$ {Number(totalPagar).toFixed(2)}
                </h4>
            )}
        </div>
    );
};

export default Carrinho;
