import { useEffect, useState } from 'react';
import { FaSearch, FaInfoCircle, FaEdit, FaTrash, FaTimes } from 'react-icons/fa';
import URL from '../service/url';
import styles from '../styles/Consultar.module.css';

const ConsultarFornecedor = () => {
    const [fornecedores, setFornecedores] = useState([]);
    const [busca, setBusca] = useState('');
    const [popup, setPopup] = useState({ tipo: '', fornecedor: null });
    const [formData, setFormData] = useState({});

    useEffect(() => {
        fetchTodosFornecedores();
    }, []);

    const fetchTodosFornecedores = async () => {
        try {
            const res = await fetch(`${URL}/fornecedor`);
            const data = await res.json();
            setFornecedores(data);
        } catch (error) {
            console.error('Erro ao buscar fornecedores:', error);
        }
    };

    const handleBuscarClick = async () => {
        if (!busca.trim()) {
            alert("Digite algo para buscar.");
            return;
        }

        try {
            const res = await fetch(`${URL}/fornecedor/${encodeURIComponent(busca)}`);
            if (!res.ok) {
                const errorData = await res.json();
                alert(errorData.message || 'Erro na busca');
                return;
            }

            const data = await res.json();
            if (!data || (Array.isArray(data) && data.length === 0)) {
                alert("Nenhum fornecedor encontrado.");
                return;
            }

            setFornecedores(Array.isArray(data) ? data : [data]);
        } catch (error) {
            console.error('Erro ao buscar fornecedor:', error);
            alert('Erro ao buscar fornecedor');
        }
    };

    const handleVoltarListaClick = () => {
        setBusca('');
        fetchTodosFornecedores();
    };

    const handleExcluirFornecedor = async (id) => {
        const confirm = window.confirm("Tem certeza que deseja excluir este fornecedor?");
        if (!confirm) return;

        try {
            const res = await fetch(`${URL}/fornecedor/${id}`, {
                method: 'DELETE'
            });

            if (!res.ok) throw new Error("Erro ao excluir fornecedor");

            alert("Fornecedor excluído com sucesso!");
            fetchTodosFornecedores();
        } catch (error) {
            alert("Erro ao excluir fornecedor");
        }
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${URL}/fornecedor/${formData.ID}`, {  // ID na URL
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nome: formData.NOME,
                    telefone: formData.TELEFONE,
                }),
            });

            if (!res.ok) throw new Error('Erro ao atualizar fornecedor');

            alert('Fornecedor atualizado com sucesso!');
            setPopup({ tipo: '', fornecedor: null });
            fetchTodosFornecedores();  // Atualiza a lista de fornecedores
        } catch (err) {
            alert('Erro ao atualizar fornecedor');
            console.error(err);  // Mostra o erro no console
        }
    };

    const renderPopup = () => {
        if (!popup.tipo || !popup.fornecedor) return null;

        return (
            <div className={styles.popupOverlay}>
                <div className={styles.popup}>
                    <button
                        className={styles.fecharPopup}
                        onClick={() => setPopup({ tipo: '', fornecedor: null })}
                    >
                        <FaTimes />
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
                                    <label>Telefone</label>
                                    <input
                                        name="TELEFONE"
                                        value={formData.TELEFONE || ''}
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
        if (popup.tipo === 'editar' && popup.fornecedor) {
            setFormData({ ...popup.fornecedor });
        }
    }, [popup]);

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
                {fornecedores.map((fornecedor) => (
                    <div key={fornecedor.ID} className={styles.clienteItem}>
                        <div className={styles.clienteInfo}>
                            <p><strong>Nome:</strong> {fornecedor.NOME}</p>
                            <p><strong>Telefone:</strong> {fornecedor.TELEFONE}</p>
                        </div>
                        <div className={styles.botoes}>
                            <button
                                className={styles.info}
                                onClick={() => setPopup({ tipo: 'detalhes', fornecedor })}
                            >
                                <FaInfoCircle />
                            </button>
                            <button
                                className={styles.editar}
                                onClick={() => setPopup({ tipo: 'editar', fornecedor })}
                            >
                                <FaEdit />
                            </button>
                            <button
                                className={styles.excluir}
                                onClick={() => handleExcluirFornecedor(fornecedor.ID)}
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

export default ConsultarFornecedor;
