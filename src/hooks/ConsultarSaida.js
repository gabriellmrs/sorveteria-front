import { useState, useEffect } from 'react';
import URL from '../service/url.js';

export function useSaidas() {
  const [saidas, setSaidas] = useState([]);
  const [filtros, setFiltros] = useState({
    ano: '',
    mes: '',
    dia: '',
    valor: '',
    descricao: '',
    nome: '',
  });
  const [mostrarFiltro, setMostrarFiltro] = useState(false);
  const [popup, setPopup] = useState({ tipo: '', saida: null });
  const [formData, setFormData] = useState({});

  const token = localStorage.getItem('token');

  const fetchSaidasDoDia = async () => {
    try {
      const res = await fetch(`${URL}/saida`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      setSaidas(data);
    } catch (error) {
      console.error('Erro ao buscar saídas do dia:', error);
    }
  };

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros((prev) => ({ ...prev, [name]: value }));
  };

  const handleBuscarClick = async () => {
    try {
      const res = await fetch(`${URL}/saida/filtro`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(filtros),
      });
      const data = await res.json();
      setSaidas(data);
    } catch (error) {
      console.error('Erro ao buscar saídas com filtro:', error);
    }
  };

  const handleVoltarClick = () => {
    setFiltros({
      ano: '',
      mes: '',
      dia: '',
      valor: '',
      descricao: '',
      nome: '',
    });
    setMostrarFiltro(false);
    fetchSaidasDoDia();
  };

  const handleExcluirSaida = async (id) => {
    const confirmacao = window.confirm('Tem certeza que deseja excluir esta saída?');
    if (!confirmacao) return;

    try {
      const res = await fetch(`${URL}/saida/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) throw new Error('Erro ao excluir saída');

      alert('Saída excluída com sucesso!');
      fetchSaidasDoDia();
    } catch (error) {
      alert('Erro ao excluir saída');
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${URL}/saida/${formData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Erro ao atualizar saída');

      alert('Saída atualizada com sucesso!');
      setPopup({ tipo: '', saida: null });
      fetchSaidasDoDia();
    } catch (err) {
      alert('Erro ao atualizar saída');
    }
  };

  useEffect(() => {
    fetchSaidasDoDia();
  }, []);

  useEffect(() => {
    if (popup.tipo === 'editar' && popup.saida) {
      setFormData({
        id: popup.saida.ID,
        nome: popup.saida.NOME,
        valor: popup.saida.VALOR,
        descricao: popup.saida.DESCRICAO,
      });
    }
  }, [popup]);

  return {
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
  };
}
