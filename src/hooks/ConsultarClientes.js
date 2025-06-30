// src/hooks/useClientes.js
import { useEffect, useState } from 'react';
import URL from '../service/url';

export const useClientes = () => {
  const [clientes, setClientes] = useState([]);
  const [busca, setBusca] = useState('');
  const [filtroSelecionado, setFiltroSelecionado] = useState('Nome A-Z');
  const [mostrarFiltro, setMostrarFiltro] = useState(false);
  const [popup, setPopup] = useState({ tipo: '', cliente: null });
  const [formData, setFormData] = useState({});

  const filtros = ['Nome A-Z', 'Cidade', 'Bairro', 'cpf_cnpj'];

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchTodosClientes();
  }, []);

  const fetchTodosClientes = async () => {
    try {
      const res = await fetch(`${URL}/clientes`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
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

    const filtrosMapeados = {
      'nome a-z': { endpoint: '/clientes/nome', bodyKey: 'NOME' },
      'cidade': { endpoint: '/clientes/cidade/cidade', bodyKey: 'CIDADE' },
      'bairro': { endpoint: '/clientes/bairro/bairro', bodyKey: 'BAIRRO' },
      'cpf_cnpj': { endpoint: '/clientes/cpf_cnpj/cpf_cnpj', bodyKey: 'CNPJ_CPF' },
    };

    const filtro = filtrosMapeados[filtroSelecionado.toLowerCase()];
    if (!filtro) {
      alert('Filtro inválido');
      return;
    }

    try {
      const res = await fetch(`${URL}${filtro.endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ [filtro.bodyKey]: busca }),
      });

      const data = await res.json();
      setClientes(Array.isArray(data) ? data : [data]);
    } catch (error) {
      alert("Erro ao buscar cliente");
    }
  };

  const handleExcluirCliente = async (id) => {
    const confirm = window.confirm("Tem certeza que deseja excluir este cliente?");
    if (!confirm) return;

    try {
      const res = await fetch(`${URL}/clientes/${id}`, {
        method: 'DELETE', headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error();
      alert("Cliente excluído com sucesso!");
      fetchTodosClientes();
    } catch {
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
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error();

      alert('Cliente atualizado com sucesso!');
      setPopup({ tipo: '', cliente: null });
      fetchTodosClientes();
    } catch {
      alert('Erro ao atualizar cliente');
    }
  };

  useEffect(() => {
    if (popup.tipo === 'editar' && popup.cliente) {
      setFormData({ ...popup.cliente });
    }
  }, [popup]);

  return {
    clientes,
    busca,
    setBusca,
    filtroSelecionado,
    setFiltroSelecionado,
    mostrarFiltro,
    setMostrarFiltro,
    popup,
    setPopup,
    formData,
    setFormData,
    filtros,
    handleBuscarClick,
    handleFiltroClick,
    handleVoltarListaClick,
    handleExcluirCliente,
    handleEditChange,
    handleEditSubmit,
    fetchTodosClientes,
  };
};
