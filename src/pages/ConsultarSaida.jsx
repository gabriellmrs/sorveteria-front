import React, { useEffect, useState } from 'react';
import styles from '../styles/ConsultarVendas.module.css';
import { FaEdit, FaTrash } from 'react-icons/fa';

const URL = 'http://localhost:5000';

const ConsultarSaida = () => {
    const [saidas, setSaidas] = useState([]);
    const [filtros, setFiltros] = useState({
        ano: '',
        mes: '',
        dia: '',
        valor: '',
        descricao: '',
    });
    const [mostrarFiltro, setMostrarFiltro] = useState(false);
    const [popup, setPopup] = useState({ tipo: '', saida: null });
    const [formData, setFormData] = useState({});

    const handleVoltarClick = () => {
        setFiltros({
            ano: '',
            mes: '',
            dia: '',
            valor: '',
            descricao: '',
            nome: '',
        });
        setMostrarFiltro(false);
        fetchSaidasDoDia();
    };

    useEffect(() => {
        fetchSaidasDoDia();
    }, []);

    const fetchSaidasDoDia = async () => {
        try {
            const res = await fetch(`${URL}/saida`);
            const data = await res.json();
            setSaidas(data);
        } catch (error) {
            console.error('Erro ao buscar saídas do dia:', error);
        }
    };

    const handleFiltroChange = (e) => {
        const { name, value } = e.target;
        setFiltros((prev) => ({ ...prev, [name]: value }));
    };

    const handleBuscarClick = async () => {
        try {
            const res = await fetch(`${URL}/saida/filtro`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(filtros),
            });
            const data = await res.json();
            setSaidas(data);
        } catch (error) {
            console.error('Erro ao buscar saídas com filtro:', error);
        }
    };

    const handleExcluirSaida = async (id) => {
        const confirmacao = window.confirm('Tem certeza que deseja excluir esta saída?');
        if (!confirmacao) return;

        try {
            const res = await fetch(`${URL}/saida/${id}`, {
                method: 'DELETE',
            });

            if (!res.ok) throw new Error('Erro ao excluir saída');

            alert('Saída excluída com sucesso!');
            fetchSaidasDoDia();
        } catch (error) {
            alert('Erro ao excluir saída');
        }
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${URL}/saida/${formData.ID}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error('Erro ao atualizar saída');

            alert('Saída atualizada com sucesso!');
            setPopup({ tipo: '', saida: null });
            fetchSaidasDoDia();
        } catch (err) {
            alert('Erro ao atualizar saída');
        }
    };

    const renderPopup = () => {
        if (!popup.tipo || !popup.saida) return null;

        return (
            <div className={styles.popupOverlay}>
                <div className={styles.popup}>
                    <button
                        className={styles.fecharPopup}
                        onClick={() => setPopup({ tipo: '', saida: null })}
                    >
                        &times;
                    </button>

                    {popup.tipo === 'editar' && (
                        <>
                            <h3>Editar Saída</h3>
                            <form onSubmit={handleEditSubmit} className={styles.formEditar}>
                                <div className={styles.formGroup}>
                                    <label>Nome</label>
                                    <input
                                        name="nome"
                                        value={formData.nome || ''}
                                        onChange={handleEditChange}
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label>Valor</label>
                                    <input
                                        name="valor"
                                        value={formData.valor || ''}
                                        onChange={handleEditChange}
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label>Descrição</label>
                                    <input
                                        name="descricao"
                                        value={formData.descricao || ''}
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
        if (popup.tipo === 'editar' && popup.saida) {
            setFormData({
                id: popup.saida.ID,
                nome: popup.saida.NOME,
                valor: popup.saida.VALOR,
                descricao: popup.saida.DESCRICAO,
            });
        }
    }, [popup]);

    return (
        <div className={styles.container}>
            <h2 className={styles.titulo}>Consultar Saídas</h2>

            <div className={styles.barraPesquisa}>
                <button className={styles.botaoAcao} onClick={() => setMostrarFiltro(!mostrarFiltro)}>
                    Filtros
                </button>

                <button className={styles.botaoAcao} onClick={handleBuscarClick}>
                    Buscar
                </button>

                <button className={styles.botaoAcao} onClick={handleVoltarClick}>
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
                        name="valor"
                        placeholder="Valor"
                        value={filtros.valor}
                        onChange={handleFiltroChange}
                    />
                    <input
                        type="text"
                        name="descricao"
                        placeholder="Descrição"
                        value={filtros.descricao}
                        onChange={handleFiltroChange}
                    />
                    <input
                        type="text"
                        name="nome"
                        placeholder="Nome"
                        value={filtros.nome}
                        onChange={handleFiltroChange}
                    />
                </div>
            )}

            <div className={styles.listaVendas}>
                {saidas.map((saida) => (
                    <div key={saida.ID} className={styles.vendaItem}>
                        <div className={styles.vendaInfo}>
                            <p><strong>Nome:</strong> {saida.NOME}</p>
                            <p><strong>Descrição:</strong> {saida.DESCRICAO}</p>
                            <p><strong>Valor:</strong> {saida.VALOR}</p>
                            <p><strong>Data da Saída:</strong> {new Date(saida.DATA_SAIDA).toLocaleDateString()}</p>
                        </div>
                        <div className={styles.botoes}>
                            <button
                                className={styles.icone}
                                onClick={() => setPopup({ tipo: 'editar', saida })}
                                title="Editar"
                            >
                                <FaEdit />
                            </button>
                            <button
                                className={styles.icone}
                                onClick={() => handleExcluirSaida(saida.ID)}
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

export default ConsultarSaida;
