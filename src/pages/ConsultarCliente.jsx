import { useEffect, useState } from 'react';
import { FaSearch, FaFilter, FaTimes } from 'react-icons/fa';
import URL from '../service/url';
import styles from '../styles/Consultar.module.css';
import ItemList from '../components/ItemList/ItemList'

const ConsultarCliente = () => {
    //const URL = 'http://localhost:5000';

    const [clientes, setClientes] = useState([]);
    const [busca, setBusca] = useState('');
    const [filtroSelecionado, setFiltroSelecionado] = useState('Nome A-Z');
    const [mostrarFiltro, setMostrarFiltro] = useState(false);
    const [popup, setPopup] = useState({ tipo: '', cliente: null });
    const [formData, setFormData] = useState({});

    const filtros = ['Nome A-Z', 'Cidade', 'Bairro', 'cpf_cnpj'];

    useEffect(() => {
        fetchTodosClientes();
    }, []);

    const fetchTodosClientes = async () => {
        try {
            const res = await fetch(`${URL}/clientes`);
            const data = await res.json();
            setClientes(data);
        } catch (error) {
            console.error('Erro ao buscar clientes:', error);
        }
    };

    const handleVoltarListaClick = () => {
        setBusca('');
        fetchTodosClientes();
    };

    const handleFiltroClick = (filtro) => {
        setFiltroSelecionado(filtro);
        setMostrarFiltro(false);
    };

    const handleBuscarClick = async () => {
        if (!busca.trim()) {
            alert("Digite algo para buscar.");
            return;
        }

        let endpoint = '';
        let body = {};

        switch (filtroSelecionado.toLowerCase()) {
            case 'nome a-z':
                endpoint = '/clientes/nome';
                body = { NOME: busca };
                break;
            case 'cidade':
                endpoint = '/clientes/cidade/cidade';
                body = { CIDADE: busca };
                break;
            case 'bairro':
                endpoint = '/clientes/bairro/bairro';
                body = { BAIRRO: busca };
                break;
            case 'cpf_cnpj':
                endpoint = '/clientes/cpf_cnpj/cpf_cnpj';
                body = { CNPJ_CPF: busca };
                break;
            default:
                alert('Filtro inválido');
                return;
        }

        try {
            const res = await fetch(`${URL}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });

            if (!res.ok) {
                const errorData = await res.json();
                alert(errorData.message || 'Erro na busca');
                return;
            }

            const data = await res.json();
            setClientes(Array.isArray(data) ? data : [data]);
        } catch (error) {
            console.error('Erro ao buscar cliente:', error);
            alert('Erro ao buscar cliente');
        }
    };

    const handleExcluirCliente = async (id) => {
        const confirm = window.confirm("Tem certeza que deseja excluir este cliente?");
        if (!confirm) return;

        try {
            const res = await fetch(`${URL}/clientes/${id}`, {
                method: 'DELETE'
            });

            if (!res.ok) {
                throw new Error("Erro ao excluir cliente");
            }

            alert("Cliente excluído com sucesso!");
            fetchTodosClientes();
        } catch (error) {
            alert("Erro ao excluir cliente");
        }
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${URL}/clientes/${formData.ID}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!res.ok) throw new Error('Erro ao atualizar cliente');

            alert('Cliente atualizado com sucesso!');
            setPopup({ tipo: '', cliente: null });
            fetchTodosClientes();
        } catch (err) {
            alert('Erro ao atualizar cliente');
        }
    };

    const renderPopup = () => {
        if (!popup.tipo || !popup.cliente) return null;

        return (
            <div className={styles.popupOverlay}>
                <div className={styles.popup}>
                    <button
                        className={styles.fecharPopup}
                        onClick={() => setPopup({ tipo: '', cliente: null })}
                    >
                        <FaTimes />
                    </button>

                    {popup.tipo === 'detalhes' && (
                        <>
                            <h3>Detalhes do Cliente</h3>
                            <p><strong>ID:</strong> {popup.cliente.ID}</p>
                            <p><strong>Nome:</strong> {popup.cliente.NOME}</p>
                            <p><strong>Estado:</strong> {popup.cliente.ESTADO}</p>
                            <p><strong>Cidade:</strong> {popup.cliente.CIDADE}</p>
                            <p><strong>Bairro:</strong> {popup.cliente.BAIRRO}</p>
                            <p><strong>Endereço:</strong> {popup.cliente.ENDERECO}</p>
                            <p><strong>Telefone:</strong> {popup.cliente.TELEFONE}</p>
                            <p><strong>CPF/CNPJ:</strong> {popup.cliente.CNPJ_CPF}</p>
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

    useEffect(() => {
        if (popup.tipo === 'editar' && popup.cliente) {
            setFormData({ ...popup.cliente });
        }
    }, [popup]);

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
                    <button
                        className={styles.botaoAcao}
                        onClick={() => setMostrarFiltro(!mostrarFiltro)}
                    >
                        <FaFilter />
                    </button>

                    <button
                        className={styles.botaoAcao}
                        onClick={handleBuscarClick}
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
