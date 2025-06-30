import { useState, useEffect } from 'react';
import URL from '../service/url';

const useFornecedores = () => {
  const [fornecedores, setFornecedores] = useState([]);
  const [busca, setBusca] = useState('');
  const [formData, setFormData] = useState({});
  const [popup, setPopup] = useState({ tipo: '', fornecedor: null });

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchTodosFornecedores();
  }, []);

  const fetchTodosFornecedores = async () => {
    try {
      const res = await fetch(`${URL}/fornecedor`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      setFornecedores(data);
    } catch (error) {
      console.error('Erro ao buscar fornecedores:', error);
    }
  };

  const buscarFornecedor = async () => {
    if (!busca.trim()) {
      alert("Digite algo para buscar.");
      return;
    }

    try {
      const res = await fetch(`${URL}/fornecedor/${encodeURIComponent(busca)}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
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

  const excluirFornecedor = async (id) => {
    const confirm = window.confirm("Tem certeza que deseja excluir este fornecedor?");
    if (!confirm) return;

    try {
      const res = await fetch(`${URL}/fornecedor/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) throw new Error("Erro ao excluir fornecedor");

      alert("Fornecedor excluído com sucesso!");
      fetchTodosFornecedores();
    } catch (error) {
      alert("Erro ao excluir fornecedor");
    }
  };

  const atualizarFornecedor = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${URL}/fornecedor/${formData.ID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nome: formData.NOME,
          telefone: formData.TELEFONE,
        }),
      });

      if (!res.ok) throw new Error('Erro ao atualizar fornecedor');

      alert('Fornecedor atualizado com sucesso!');
      setPopup({ tipo: '', fornecedor: null });
      fetchTodosFornecedores();
    } catch (err) {
      alert('Erro ao atualizar fornecedor');
      console.error(err);
    }
  };

  return {
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
  };
};

export default useFornecedores;
