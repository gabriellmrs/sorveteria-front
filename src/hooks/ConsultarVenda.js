import { useEffect, useState } from 'react';

const URL = 'http://localhost:5000'; // Substitua pelo seu backend

export const useConsultarVendas = () => {
    const [vendas, setVendas] = useState([]);
    const [filtros, setFiltros] = useState({
        ano: '',
        mes: '',
        dia: '',
        valorVenda: '',
        formaDePagamento: '',
    });
    const [mostrarFiltro, setMostrarFiltro] = useState(false);
    const [popup, setPopup] = useState({ tipo: '', venda: null });
    const [formData, setFormData] = useState({});

    useEffect(() => {
        fetchVendasDoDia();
    }, []);

    useEffect(() => {
        if (popup.tipo === 'editar' && popup.venda) {
            setFormData({ ...popup.venda });
        }
    }, [popup]);

    const fetchVendasDoDia = async () => {
        try {
            const res = await fetch(`${URL}/venda`);
            const data = await res.json();
            setVendas(data);
        } catch (error) {
            console.error('Erro ao buscar vendas do dia:', error);
        }
    };

    const handleFiltroChange = (e) => {
        const { name, value } = e.target;
        setFiltros((prev) => ({ ...prev, [name]: value }));
    };

    const handleBuscarClick = async () => {
        try {
            const res = await fetch(`${URL}/venda/filtro`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(filtros),
            });
            const data = await res.json();
            setVendas(data);
        } catch (error) {
            console.error('Erro ao buscar vendas com filtro:', error);
        }
    };

    const handleVoltarClick = () => {
        setFiltros({
            ano: '',
            mes: '',
            dia: '',
            valorVenda: '',
            formaDePagamento: '',
        });
        setMostrarFiltro(false);
        fetchVendasDoDia();
    };

    const handleExcluirVenda = async (id) => {
        const confirmacao = window.confirm('Tem certeza que deseja excluir esta venda?');
        if (!confirmacao) return;

        try {
            const res = await fetch(`${URL}/venda/${id}`, {
                method: 'DELETE',
            });

            if (!res.ok) throw new Error('Erro ao excluir venda');

            alert('Venda excluída com sucesso!');
            fetchVendasDoDia();
        } catch (error) {
            alert('Erro ao excluir venda');
        }
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${URL}/venda/${formData.ID}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error('Erro ao atualizar venda');

            alert('Venda atualizada com sucesso!');
            setPopup({ tipo: '', venda: null });
            fetchVendasDoDia();
        } catch (err) {
            alert('Erro ao atualizar venda');
        }
    };

    return {
        vendas,
        filtros,
        mostrarFiltro,
        popup,
        formData,
        setPopup,
        setMostrarFiltro,
        handleFiltroChange,
        handleBuscarClick,
        handleVoltarClick,
        handleExcluirVenda,
        handleEditChange,
        handleEditSubmit,
        setFormData,
    };
};
