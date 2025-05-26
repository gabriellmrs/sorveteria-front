import { useEffect, useState } from 'react';
import URL from '../service/url';

export const useVendedores = () => {
  const [vendedores, setVendedores] = useState([]);
  const [busca, setBusca] = useState('');
  const [filtroSelecionado, setFiltroSelecionado] = useState('Nome A-Z');
  const [mostrarFiltro, setMostrarFiltro] = useState(false);
  const [popup, setPopup] = useState({ tipo: '', vendedor: null });
  const [formData, setFormData] = useState({});

  const filtros = ['Nome A-Z', 'Bairro', 'Rua'];

  useEffect(() => {
    fetchTodosVendedores();
  }, []);

  const fetchTodosVendedores = async () => {
    try {
      const res = await fetch(`${URL}/vendedor`);
      const data = await res.json();
      setVendedores(data);
    } catch (error) {
      console.error('Erro ao buscar vendedores:', error);
    }
  };

  const handleBuscarClick = async () => {
    if (!busca) return fetchTodosVendedores();

    try {
      const res = await fetch(`${URL}/vendedor/${busca}`);
      const data = await res.json();
      setVendedores([data]); 
    } catch (err) {
      console.error('Erro na busca por vendedor:', err);
    }
  };

  const handleFiltroClick = (filtro) => {
    setFiltroSelecionado(filtro);
    setMostrarFiltro(false);
  };

  const handleVoltarListaClick = () => {
    setBusca('');
    fetchTodosVendedores();
  };

  const handleExcluirVendedor = async (id) => {
    const confirm = window.confirm("Tem certeza que deseja excluir este vendedor?");
    if (!confirm) return;

    try {
      const res = await fetch(`${URL}/vendedor/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      alert("Vendedor excluído com sucesso!");
      fetchTodosVendedores();
    } catch {
      alert("Erro ao excluir vendedor");
    }
  };

  const handleEditChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e) => {
  e.preventDefault();

  
  const payload = {
    nome: formData.NOME,
    bairro: formData.BAIRRO,
    rua: formData.RUA,
    numero_casa: formData.NUMERO_CASA,
    telefone: formData.TELEFONE,
  };

  try {
    const res = await fetch(`${URL}/vendedor/${popup.vendedor.ID}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error();

    alert('Vendedor editado com sucesso!'); 

    setPopup({ tipo: '', vendedor: null });
    fetchTodosVendedores();
  } catch (err) {
    console.error('Erro ao editar vendedor:', err);
    alert('Erro ao editar vendedor');
  }
};


  useEffect(() => {
    if (popup.tipo === 'editar' && popup.vendedor) {
      setFormData(popup.vendedor);
    }
  }, [popup]);

  return {
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
  };
};
