import React from 'react';
import styles from '../styles/ConsultarVendas.module.css';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useSaidas } from '../hooks/ConsultarSaida';

const ConsultarSaida = () => {
  const {
    saidas,
    filtros,
    setMostrarFiltro,
    mostrarFiltro,
    popup,
    setPopup,
    formData,
    handleFiltroChange,
    handleBuscarClick,
    handleVoltarClick,
    handleExcluirSaida,
    handleEditChange,
    handleEditSubmit,
  } = useSaidas();

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
          <input type="number" name="ano" placeholder="Ano" value={filtros.ano} onChange={handleFiltroChange} />
          <input type="number" name="mes" placeholder="Mês" value={filtros.mes} onChange={handleFiltroChange} />
          <input type="number" name="dia" placeholder="Dia" value={filtros.dia} onChange={handleFiltroChange} />
          <input type="number" name="valor" placeholder="Valor" value={filtros.valor} onChange={handleFiltroChange} />
          <input type="text" name="descricao" placeholder="Descrição" value={filtros.descricao} onChange={handleFiltroChange} />
          <input type="text" name="nome" placeholder="Nome" value={filtros.nome} onChange={handleFiltroChange} />
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
