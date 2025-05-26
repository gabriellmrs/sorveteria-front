import { FaSearch, FaFilter, FaTimes } from 'react-icons/fa';
import styles from '../styles/Consultar.module.css';
import ItemList from '../components/ItemList/ItemList';
import { useVendedores } from '../hooks/useVendedores';

const ConsultarVendedor = () => {
  const {
    vendedores,
    busca,
    setBusca,
    filtroSelecionado,
    mostrarFiltro,
    setMostrarFiltro,
    popup,
    setPopup,
    formData,
    filtros,
    handleBuscarClick,
    handleFiltroClick,
    handleVoltarListaClick,
    handleExcluirVendedor,
    handleEditChange,
    handleEditSubmit,
  } = useVendedores();

  const renderPopup = () => {
    if (!popup.tipo || !popup.vendedor) return null;

    return (
      <div className={styles.popupOverlay}>
        <div className={styles.popup}>
          <button className={styles.fecharPopup} onClick={() => setPopup({ tipo: '', vendedor: null })}>
            <FaTimes />
          </button>

          {popup.tipo === 'detalhes' && (
            <>
              <h3>Detalhes do Vendedor</h3>
              {['ID', 'NOME', 'BAIRRO', 'RUA', 'NUMERO_CASA', 'TELEFONE'].map((key) => (
                <p key={key}><strong>{key}:</strong> {popup.vendedor[key]}</p>
              ))}
            </>
          )}

          {popup.tipo === 'editar' && (
            <>
              <h3>Editar Vendedor</h3>
              <form onSubmit={handleEditSubmit} className={styles.formEditar}>
                {['NOME', 'BAIRRO', 'RUA', 'NUMERO_CASA', 'TELEFONE'].map((field) => (
                  <div key={field} className={styles.formGroup}>
                    <label>{field}</label>
                    <input
                      name={field}
                      value={formData[field] || ''}
                      onChange={handleEditChange}
                    />
                  </div>
                ))}
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
      <h2 className={styles.titulo}>Consultar Vendedor</h2>

      <div className={styles.barraPesquisa}>
        <div className={styles.inputWrapper}>
          <FaSearch className={styles.iconeDentroInput} />
          <input
            type="text"
            placeholder={`Buscar por ${filtroSelecionado.toLowerCase()}...`}
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>

        <div className={styles.boxButton}>
          <button className={styles.botaoAcao} onClick={() => setMostrarFiltro(!mostrarFiltro)}>
            <FaFilter />
          </button>
          <button className={styles.botaoAcao} onClick={handleBuscarClick}>
            <FaSearch />
          </button>
          <button className={styles.botaoAcao} onClick={handleVoltarListaClick}>
            ↩
          </button>
        </div>

        {mostrarFiltro && (
          <ul className={styles.filtroLista}>
            {filtros.map((f, index) => (
              <li key={index} onClick={() => handleFiltroClick(f)}>
                {f}
              </li>
            ))}
          </ul>
        )}
      </div>

      {filtroSelecionado && (
        <div className={styles.filtroSelecionado}>
          Filtro atual: {filtroSelecionado}
        </div>
      )}

      <ItemList
        itens={vendedores}
        campos={[
          { key: 'NOME', label: 'Nome' },
          { key: 'BAIRRO', label: 'Bairro' },
          { key: 'RUA', label: 'Rua' },
          { key: 'TELEFONE', label: 'Telefone' },
        ]}
        onDetalhes={(vendedor) => setPopup({ tipo: 'detalhes', vendedor })}
        onEditar={(vendedor) => setPopup({ tipo: 'editar', vendedor })}
        onExcluir={handleExcluirVendedor}
      />

      {renderPopup()}
    </div>
  );
};

export default ConsultarVendedor;
