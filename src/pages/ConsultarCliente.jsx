import { FaSearch, FaFilter, FaTimes } from 'react-icons/fa';
import styles from '../styles/Consultar.module.css';
import ItemList from '../components/ItemList/ItemList';
import { useClientes } from '../hooks/ConsultarClientes';


const ConsultarCliente = () => {
  const {
    clientes,
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
    handleExcluirCliente,
    handleEditChange,
    handleEditSubmit,
  } = useClientes();

  const renderPopup = () => {
    if (!popup.tipo || !popup.cliente) return null;

    return (
      <div className={styles.popupOverlay}>
        <div className={styles.popup}>
          <button className={styles.fecharPopup} onClick={() => setPopup({ tipo: '', cliente: null })}>
            <FaTimes />
          </button>

          {popup.tipo === 'detalhes' && (
            <>
              <h3>Detalhes do Cliente</h3>
              {['ID', 'NOME', 'ESTADO', 'CIDADE', 'BAIRRO', 'ENDERECO', 'TELEFONE', 'CNPJ_CPF'].map((key) => (
                <p key={key}><strong>{key}:</strong> {popup.cliente[key]}</p>
              ))}
            </>
          )}

          {popup.tipo === 'editar' && (
            <>
              <h3>Editar Cliente</h3>
              <form onSubmit={handleEditSubmit} className={styles.formEditar}>
                {['NOME', 'ESTADO', 'CIDADE', 'BAIRRO', 'ENDERECO', 'TELEFONE', 'CNPJ_CPF'].map((field) => (
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
      <h2 className={styles.titulo}>Consultar Cliente</h2>

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
        itens={clientes}
        campos={[
          { key: 'NOME', label: 'Nome' },
          { key: 'CIDADE', label: 'Cidade' },
          { key: 'BAIRRO', label: 'Bairro' },
          { key: 'CNPJ_CPF', label: 'CPF/CNPJ' },
        ]}
        onDetalhes={(cliente) => setPopup({ tipo: 'detalhes', cliente })}
        onEditar={(cliente) => setPopup({ tipo: 'editar', cliente })}
        onExcluir={handleExcluirCliente}
      />

      {renderPopup()}
    </div>
  );
};

export default ConsultarCliente;
