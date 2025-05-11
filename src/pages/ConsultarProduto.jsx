import { FaSearch, FaTimes } from 'react-icons/fa';
import styles from '../styles/Consultar.module.css';
import ItemList from '../components/ItemList/ItemList';
import useProdutos from '../hooks/ConsultarProdutos';

const ConsultarProduto = () => {
    const {
        produtos,
        busca,
        setBusca,
        popup,
        setPopup,
        formData,
        handleEditChange,
        buscarProduto,
        excluirProduto,
        submitEdicao,
        fetchTodosProdutos
    } = useProdutos();

    const renderPopup = () => {
        if (!popup.tipo || !popup.produto) return null;

        return (
            <div className={styles.popupOverlay}>
                <div className={styles.popup}>
                    <button
                        className={styles.fecharPopup}
                        onClick={() => setPopup({ tipo: '', produto: null })}
                    >
                        <FaTimes />
                    </button>

                    {popup.tipo === 'detalhes' && (
                        <>
                            <h3>Detalhes do Produto</h3>
                            <p><strong>ID:</strong> {popup.produto.ID}</p>
                            <p><strong>Nome:</strong> {popup.produto.NOME}</p>
                            <p><strong>Preço:</strong> R$ {popup.produto.VALOR}</p>
                        </>
                    )}

                    {popup.tipo === 'editar' && (
                        <>
                            <h3>Editar Produto</h3>
                            <form onSubmit={submitEdicao} className={styles.formEditar}>
                                <div className={styles.formGroup}>
                                    <label>Nome</label>
                                    <input
                                        name="NOME"
                                        value={formData.NOME || ''}
                                        onChange={handleEditChange}
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Preço</label>
                                    <input
                                        name="VALOR"
                                        type="number"
                                        value={formData.VALOR || ''}
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
            <h2 className={styles.titulo}>Consultar Produto</h2>

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
                    <button
                        className={styles.botaoAcao}
                        onClick={buscarProduto}
                        title="Buscar"
                    >
                        <FaSearch />
                    </button>

                    <button
                        className={styles.botaoAcao}
                        onClick={() => {
                            setBusca('');
                            fetchTodosProdutos();
                        }}
                        title="Voltar à Lista"
                    >
                        ↩
                    </button>
                </div>
            </div>

            <ItemList
                itens={produtos}
                campos={[
                    { key: 'NOME', label: 'Nome' },
                    { key: 'VALOR', label: 'Preço', format: (v) => `R$ ${v}` },
                ]}
                onDetalhes={(produto) => setPopup({ tipo: 'detalhes', produto })}
                onEditar={(produto) => setPopup({ tipo: 'editar', produto })}
                onExcluir={excluirProduto}
            />

            {renderPopup()}
        </div>
    );
};

export default ConsultarProduto;
