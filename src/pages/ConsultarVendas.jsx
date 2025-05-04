import React, { useEffect, useState } from 'react';
import styles from '../styles/ConsultarVendas.module.css';
import { FaEdit, FaTrash } from 'react-icons/fa';

const URL = 'http://localhost:5000'; // Substitua pelo seu backend

const ConsultarVendas = () => {
    const [vendas, setVendas] = useState([]);
    const [filtros, setFiltros] = useState({
        ano: '',
        mes: '',
        dia: '',
        valorVenda: '',
        formaDePagamento: '',
    });
    const [mostrarFiltro, setMostrarFiltro] = useState(false);
    const [popup, setPopup] = useState({ tipo: '', venda: null });
    const [formData, setFormData] = useState({});

    const handleVoltarClick = () => {
        // Limpa os filtros
        setFiltros({
            ano: '',
            mes: '',
            dia: '',
            valorVenda: '',
            formaDePagamento: '',
        });

        // Oculta a área de filtros
        setMostrarFiltro(false);

        // Busca todas as vendas do dia
        fetchVendasDoDia();
    };

    useEffect(() => {
        fetchVendasDoDia();
    }, []);

    const fetchVendasDoDia = async () => {
        try {
            const res = await fetch(`${URL}/venda`);
            const data = await res.json();
            setVendas(data);
        } catch (error) {
            console.error('Erro ao buscar vendas do dia:', error);
        }
    };

    const handleFiltroChange = (e) => {
        const { name, value } = e.target;
        setFiltros((prev) => ({ ...prev, [name]: value }));
    };

    const handleBuscarClick = async () => {
        try {
            const res = await fetch(`${URL}/venda/filtro`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(filtros),
            });
            const data = await res.json();
            setVendas(data);
        } catch (error) {
            console.error('Erro ao buscar vendas com filtro:', error);
        }
    };

    const handleExcluirVenda = async (id) => {
        const confirmacao = window.confirm('Tem certeza que deseja excluir esta venda?');
        if (!confirmacao) return;

        try {
            const res = await fetch(`${URL}/venda/${id}`, {
                method: 'DELETE',
            });

            if (!res.ok) {
                throw new Error('Erro ao excluir venda');
            }

            alert('Venda excluída com sucesso!');
            fetchVendasDoDia();
        } catch (error) {
            alert('Erro ao excluir venda');
        }
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${URL}/venda/${formData.ID}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error('Erro ao atualizar venda');

            alert('Venda atualizada com sucesso!');
            setPopup({ tipo: '', venda: null });
            fetchVendasDoDia();
        } catch (err) {
            alert('Erro ao atualizar venda');
        }
    };

    const renderPopup = () => {
        if (!popup.tipo || !popup.venda) return null;

        return (
            <div className={styles.popupOverlay}>
                <div className={styles.popup}>
                    <button
                        className={styles.fecharPopup}
                        onClick={() => setPopup({ tipo: '', venda: null })}
                    >
                        &times;
                    </button>

                    {popup.tipo === 'editar' && (
                        <>
                            <h3>Editar Venda</h3>
                            <form onSubmit={handleEditSubmit} className={styles.formEditar}>
                                <div className={styles.formGroup}>
                                    <label>Valor da Venda</label>
                                    <input
                                        name="valorVenda"
                                        value={formData.valorVenda || ''}
                                        onChange={handleEditChange}
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Forma de Pagamento</label>
                                    <select
                                        name="formaDePagamento"
                                        value={formData.formaDePagamento || ''}
                                        onChange={handleEditChange}
                                    >
                                        <option value="Dinheiro">Dinheiro</option>
                                        <option value="Pix">Pix</option>
                                        <option value="Cartão">Cartão</option>
                                    </select>
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Valor Pago</label>
                                    <input
                                        name="valorPago"
                                        value={formData.valorPago || ''}
                                        onChange={handleEditChange}
                                    />
                                </div>
                                <button type="submit" className={styles.botaoSalvar}>Alterar</button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        );
    };

    useEffect(() => {
        if (popup.tipo === 'editar' && popup.venda) {
            setFormData({ ...popup.venda });
        }
    }, [popup]);

    return (
        <div className={styles.container}>
            <h2 className={styles.titulo}>Consultar Vendas</h2>

            <div className={styles.barraPesquisa}>
                <button
                    className={styles.botaoAcao}
                    onClick={() => setMostrarFiltro(!mostrarFiltro)}
                >
                    Filtros
                </button>

                <button
                    className={styles.botaoAcao}
                    onClick={handleBuscarClick}
                >
                    Buscar
                </button>

                <button
                    className={styles.botaoAcao}
                    onClick={handleVoltarClick}
                    title="Voltar à Lista"
                >
                    ↩
                </button>

            </div>

            {mostrarFiltro && (
                <div className={styles.filtros}>
                    <input
                        type="number"
                        name="ano"
                        placeholder="Ano"
                        value={filtros.ano}
                        onChange={handleFiltroChange}
                    />
                    <input
                        type="number"
                        name="mes"
                        placeholder="Mês"
                        value={filtros.mes}
                        onChange={handleFiltroChange}
                    />
                    <input
                        type="number"
                        name="dia"
                        placeholder="Dia"
                        value={filtros.dia}
                        onChange={handleFiltroChange}
                    />
                    <input
                        type="number"
                        name="valorVenda"
                        placeholder="Valor da Venda"
                        value={filtros.valorVenda}
                        onChange={handleFiltroChange}
                    />
                    <select
                        name="formaDePagamento"
                        value={filtros.formaDePagamento}
                        onChange={handleFiltroChange}
                        className={styles.select} // Se você estiver usando CSS Modules
                    >
                        <option value="">Forma de Pagamento</option>
                        <option value="Dinheiro">Dinheiro</option>
                        <option value="Pix">Pix</option>
                        <option value="Cartão">Cartão</option>
                    </select>
                </div>
            )}

            <div className={styles.listaVendas}>
                {vendas.map((venda) => (
                    <div key={venda.ID} className={styles.vendaItem}>
                        <div className={styles.vendaInfo}>
                            <p><strong>Valor da Venda:</strong> {venda.VALOR_VENDA}</p>
                            <p><strong>Forma de Pagamento:</strong> {venda.FORMA_PAGAMENTO}</p>
                            <p><strong>Valor Pago:</strong> {venda.VALOR_PAGO}</p>
                            <p><strong>Data da Venda:</strong> {new Date(venda.DATA_VENDA).toLocaleDateString()}</p>
                        </div>
                        <div className={styles.botoes}>
                            <button
                                className={styles.icone}
                                onClick={() => setPopup({ tipo: 'editar', venda })}
                                title="Editar"
                            >
                                <FaEdit />
                            </button>
                            <button
                                className={styles.icone}
                                onClick={() => handleExcluirVenda(venda.ID)}
                                title="Excluir"
                            >
                                <FaTrash />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {renderPopup()}
        </div>
    );
};

export default ConsultarVendas;
