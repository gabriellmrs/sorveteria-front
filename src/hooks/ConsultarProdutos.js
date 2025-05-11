import { useState, useEffect } from 'react';
import URL from '../service/url';

const useProdutos = () => {
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

    const buscarProduto = async () => {
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

    const excluirProduto = async (id) => {
        const confirm = window.confirm("Tem certeza que deseja excluir este produto?");
        if (!confirm) return;

        try {
            const res = await fetch(`${URL}/produto/${id}`, {
                method: 'DELETE',
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

    const submitEdicao = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${URL}/produto/${formData.ID}`, {
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
            fetchTodosProdutos();
        } catch (err) {
            alert('Erro ao atualizar produto');
            console.error(err);
        }
    };

    useEffect(() => {
        if (popup.tipo === 'editar' && popup.produto) {
            setFormData({ ...popup.produto });
        }
    }, [popup]);

    return {
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
    };
};

export default useProdutos;
