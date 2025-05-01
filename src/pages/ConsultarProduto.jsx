import { useEffect, useState } from 'react';
import { FaSearch, FaInfoCircle, FaEdit, FaTrash, FaTimes } from 'react-icons/fa';
import URL from '../service/url';
import styles from '../styles/Consultar.module.css';

const ConsultarProduto = () => {
    const [produtos, setProdutos] = useState([]);
    const [busca, setBusca] = useState('');
    const [popup, setPopup] = useState({ tipo: '', produto: null });
    const [formData, setFormData] = useState({});

    useEffect(() => {
        fetchTodosProdutos();
    }, []);

    const fetchTodosProdutos = async () => {
        try {
            const res = await fetch(`${URL}/produto`);
            const data = await res.json();
            setProdutos(data);
        } catch (error) {
            console.error('Erro ao buscar produtos:', error);
        }
    };

    const handleBuscarClick = async () => {
        if (!busca.trim()) {
            alert("Digite algo para buscar.");
            return;
        }

        try {
            const res = await fetch(`${URL}/produto/${encodeURIComponent(busca)}`);
            if (!res.ok) {
                const errorData = await res.json();
                alert(errorData.message || 'Erro na busca');
                return;
            }

            const data = await res.json();
            if (!data || (Array.isArray(data) && data.length === 0)) {
                alert("Nenhum produto encontrado.");
                return;
            }

            setProdutos(Array.isArray(data) ? data : [data]);
        } catch (error) {
            console.error('Erro ao buscar produto:', error);
            alert('Erro ao buscar produto');
        }
    };

    const handleVoltarListaClick = () => {
        setBusca('');
        fetchTodosProdutos();
    };

    const handleExcluirProduto = async (id) => {
        const confirm = window.confirm("Tem certeza que deseja excluir este produto?");
        if (!confirm) return;

        try {
            const res = await fetch(`${URL}/produto/${id}`, {
                method: 'DELETE'
            });

            if (!res.ok) throw new Error("Erro ao excluir produto");

            alert("Produto excluído com sucesso!");
            fetchTodosProdutos();
        } catch (error) {
            alert("Erro ao excluir produto");
        }
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${URL}/produto/${formData.ID}`, {  // ID na URL
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nome: formData.NOME,
                    valor: formData.VALOR,
                }),
            });
    
            if (!res.ok) throw new Error('Erro ao atualizar produto');
    
            alert('Produto atualizado com sucesso!');
            setPopup({ tipo: '', produto: null });
            fetchTodosProdutos();  // Atualiza a lista de produtos
        } catch (err) {
            alert('Erro ao atualizar produto');
            console.error(err);  // Mostra o erro no console
        }
    };
    

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
                            <form onSubmit={handleEditSubmit} className={styles.formEditar}>
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

    useEffect(() => {
        if (popup.tipo === 'editar' && popup.produto) {
            setFormData({ ...popup.produto });
        }
    }, [popup]);

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
                        onClick={handleBuscarClick}
                        title="Buscar"
                    >
                        <FaSearch />
                    </button>

                    <button
                        className={styles.botaoAcao}
                        onClick={handleVoltarListaClick}
                        title="Voltar à Lista"
                    >
                        ↩ 
                    </button>
                </div>
            </div>

            <div className={styles.listaClientes}>
                {produtos.map((produto) => (
                    <div key={produto.ID} className={styles.clienteItem}>
                        <div className={styles.clienteInfo}>
                            <p><strong>Nome:</strong> {produto.NOME}</p>
                            <p><strong>Preço:</strong> R$ {produto.VALOR}</p>
                        </div>
                        <div className={styles.botoes}>
                            <button
                                className={styles.info}
                                onClick={() => setPopup({ tipo: 'detalhes', produto })}
                            >
                                <FaInfoCircle />
                            </button>
                            <button
                                className={styles.editar}
                                onClick={() => setPopup({ tipo: 'editar', produto })}
                            >
                                <FaEdit />
                            </button>
                            <button
                                className={styles.excluir}
                                onClick={() => handleExcluirProduto(produto.ID)}
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

export default ConsultarProduto;
