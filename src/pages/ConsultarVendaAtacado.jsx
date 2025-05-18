import styles from '../styles/ConsultarVendaAtacado.module.css';
import ItemList from '../components/ItemList/ItemList';
import Notification from '../components/Notification/Notification';
import useConsultarVendaAtacado from '../hooks/ConsultarVendaAtacado.js'; 

const ConsultarVendaAtacado = () => {
    const {
        vendas,
        filtros,
        popup,
        formData,
        notification,
        mostrarFiltro,
        handleFiltroChange,
        handleBuscarClick,
        handleVoltarClick,
        handleExcluirVenda,
        handleEditChange,
        handleEditSubmit,
        setFormData,
        setPopup,
        setNotification,
    } = useConsultarVendaAtacado();

    const renderPopup = () => {
        if (!popup.tipo || !popup.venda) return null;

        return (
            <div className={styles.popupOverlay}>
                <div className={styles.popup}>
                    <button className={styles.fecharPopup} onClick={() => setPopup({ tipo: '', venda: null })}>
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
                                        type="number"
                                        value={formData.valorVenda || ''}
                                        onChange={handleEditChange}
                                        required
                                    />
                                </div>
                                <button type="submit" className={styles.botaoSalvar}>Salvar</button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        );
    };

    const campos = [
        { key: 'NOME', label: 'Cliente' },
        { key: 'VALOR_COMPRA', label: 'Valor', format: (v) => `R$ ${Number(v || 0).toFixed(2)}` },
        { key: 'DATA_VENDA', label: 'Data', format: (d) => new Date(d).toLocaleDateString() },
        { key: 'CIDADE', label: 'Cidade' },
        { key: 'BAIRRO', label: 'Bairro' },
    ];

    return (
        <div className={styles.container}>
            <h2 className={styles.titulo}>Consultar Vendas por Atacado</h2>

            <button className={styles.botaoFiltro} onClick={handleVoltarClick}>
                {mostrarFiltro ? 'Ocultar Filtros' : 'Mostrar Filtros'}
            </button>

            {mostrarFiltro && (
                <div className={styles.filtros}>
                    <input name="ano" placeholder="Ano" value={filtros.ano} onChange={handleFiltroChange} />
                    <input name="mes" placeholder="Mês" value={filtros.mes} onChange={handleFiltroChange} />
                    <input name="dia" placeholder="Dia" value={filtros.dia} onChange={handleFiltroChange} />
                    <input name="valor_compra" placeholder="Valor" value={filtros.valor_compra} onChange={handleFiltroChange} />
                    <input name="nome" placeholder="Nome" value={filtros.nome} onChange={handleFiltroChange} />
                    <input name="cidade" placeholder="Cidade" value={filtros.cidade} onChange={handleFiltroChange} />
                    <input name="bairro" placeholder="Bairro" value={filtros.bairro} onChange={handleFiltroChange} />
                    <button onClick={handleBuscarClick} className={styles.botaoBuscar}>Buscar</button>
                </div>
            )}

            <ItemList
                itens={vendas}
                campos={campos}
                onEditar={(venda) => {
                    setFormData({ valorVenda: venda.VALOR_COMPRA });
                    setPopup({ tipo: 'editar', venda });
                }}
                onExcluir={handleExcluirVenda}
            />

            {renderPopup()}

            {notification && (
                <Notification
                    type={notification.type}
                    title={notification.title}
                    message={notification.message}
                    onClose={() => setNotification(null)}
                />
            )}
        </div>
    );
};

export default ConsultarVendaAtacado;
