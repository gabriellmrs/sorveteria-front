import React from 'react';
import styles from '../styles/ConsultarVendas.module.css';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useConsultarVendas } from '../hooks/ConsultarVenda';

const ConsultarVendas = () => {
    const {
        vendas,
        filtros,
        mostrarFiltro,
        popup,
        formData,
        setPopup,
        setMostrarFiltro,
        handleFiltroChange,
        handleBuscarClick,
        handleVoltarClick,
        handleExcluirVenda,
        handleEditChange,
        handleEditSubmit,
    } = useConsultarVendas();

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

                <button className={styles.botaoAcao} onClick={handleBuscarClick}>Buscar</button>

                <button className={styles.botaoAcao} onClick={handleVoltarClick} title="Voltar à Lista">↩</button>
            </div>

            {mostrarFiltro && (
                <div className={styles.filtros}>
                    <input type="number" name="ano" placeholder="Ano" value={filtros.ano} onChange={handleFiltroChange} />
                    <input type="number" name="mes" placeholder="Mês" value={filtros.mes} onChange={handleFiltroChange} />
                    <input type="number" name="dia" placeholder="Dia" value={filtros.dia} onChange={handleFiltroChange} />
                    <input type="number" name="valorVenda" placeholder="Valor da Venda" value={filtros.valorVenda} onChange={handleFiltroChange} />
                    <select name="formaDePagamento" value={filtros.formaDePagamento} onChange={handleFiltroChange} className={styles.select}>
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
                            <button className={styles.icone} onClick={() => setPopup({ tipo: 'editar', venda })} title="Editar">
                                <FaEdit />
                            </button>
                            <button className={styles.icone} onClick={() => handleExcluirVenda(venda.ID)} title="Excluir">
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
