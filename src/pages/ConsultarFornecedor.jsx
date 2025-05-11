import { useEffect } from 'react';
import { FaSearch, FaArrowLeft, FaTrash, FaEdit, FaEye } from 'react-icons/fa';
import styles from '../styles/Consultar.module.css';
import ItemList from '../components/ItemList/ItemList';
import useFornecedores from '../hooks/ConsultarFornecedores';

const ConsultarFornecedor = () => {
  const {
    fornecedores,
    busca,
    setBusca,
    formData,
    setFormData,
    popup,
    setPopup,
    fetchTodosFornecedores,
    buscarFornecedor,
    excluirFornecedor,
    atualizarFornecedor,
  } = useFornecedores();

  const handleVoltarListaClick = () => {
    setBusca('');
    fetchTodosFornecedores();
  };

  const renderPopup = () => {
    if (!popup.tipo || !popup.fornecedor) return null;

    return (
      <div className={styles.popupOverlay}>
        <div className={styles.popup}>
          <button className={styles.fecharPopup} onClick={() => setPopup({ tipo: '', fornecedor: null })}>
            &times;
          </button>

          {popup.tipo === 'detalhes' && (
            <>
              <h3>Detalhes do Fornecedor</h3>
              <p><strong>ID:</strong> {popup.fornecedor.ID}</p>
              <p><strong>Nome:</strong> {popup.fornecedor.NOME}</p>
              <p><strong>Telefone:</strong> {popup.fornecedor.TELEFONE}</p>
            </>
          )}

          {popup.tipo === 'editar' && (
            <>
              <h3>Editar Fornecedor</h3>
              <form onSubmit={atualizarFornecedor} className={styles.formEditar}>
                <div className={styles.formGroup}>
                  <label>Nome</label>
                  <input
                    name="NOME"
                    value={formData.NOME || ''}
                    onChange={(e) => setFormData((prev) => ({ ...prev, NOME: e.target.value }))}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Telefone</label>
                  <input
                    name="TELEFONE"
                    value={formData.TELEFONE || ''}
                    onChange={(e) => setFormData((prev) => ({ ...prev, TELEFONE: e.target.value }))}
                    required
                  />
                </div>
                <button type="submit" className={styles.botaoSalvar}>Salvar Alterações</button>
              </form>
            </>
          )}
        </div>
      </div>
    );
  };

  useEffect(() => {
    if (popup.tipo === 'editar' && popup.fornecedor) {
      setFormData({ ...popup.fornecedor });
    }
  }, [popup, setFormData]);

  return (
    <div className={styles.container}>
      <h2 className={styles.titulo}>Consultar Fornecedor</h2>

      <div className={styles.barraPesquisa}>
        <div className={styles.inputWrapper}>
          <FaSearch className={styles.iconeDentroInput} />
          <input
            type="text"
            placeholder="Buscar por nome..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>

        <div className={styles.boxButton}>
          <button className={styles.botaoAcao} onClick={buscarFornecedor} title="Buscar">
            <FaSearch />
          </button>
          <button className={styles.botaoAcao} onClick={handleVoltarListaClick} title="Voltar à Lista">
            <FaArrowLeft />
          </button>
        </div>
      </div>

      <ItemList
        itens={fornecedores}
        campos={[
          { key: 'NOME', label: 'Nome' },
          { key: 'TELEFONE', label: 'Telefone' },
        ]}
        acoes={[
          { icone: <FaEye />, onClick: (f) => setPopup({ tipo: 'detalhes', fornecedor: f }) },
          { icone: <FaEdit />, onClick: (f) => setPopup({ tipo: 'editar', fornecedor: f }) },
          { icone: <FaTrash />, onClick: (f) => excluirFornecedor(f.ID) },
        ]}
      />

      {renderPopup()}
    </div>
  );
};

export default ConsultarFornecedor;
