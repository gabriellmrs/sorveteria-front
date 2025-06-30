import { useEffect, useState } from 'react';
import URL from '../service/url.js';

const useConsultarVendaAtacado = () => {
    const [vendas, setVendas] = useState([]);
    const [mostrarFiltro, setMostrarFiltro] = useState(false);
    const [filtros, setFiltros] = useState({
        ano: '',
        mes: '',
        dia: '',
        valor_compra: '',
        nome: '',
        cidade: '',
        bairro: '',
    });
    const [popup, setPopup] = useState({ tipo: '', venda: null });
    const [formData, setFormData] = useState({ valorVenda: '' });
    const [notification, setNotification] = useState(null);

    const token = localStorage.getItem('token');


    const buscarVendas = async () => {
        try {
            const response = await fetch(`${URL}/v-cliente/filtro`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(filtros),
            });
            if (!response.ok) throw new Error('Erro ao buscar vendas');
            const data = await response.json();
            setVendas(data);
        } catch {
            setNotification({
                type: 'error',
                title: 'Erro',
                message: 'Falha ao buscar as vendas.',
            });
        }
    };

    const handleFiltroChange = (e) => {
        const { name, value } = e.target;
        setFiltros((prev) => ({ ...prev, [name]: value }));
    };

    const handleBuscarClick = () => {
        buscarVendas();
    };

    const handleVoltarClick = () => {
        setMostrarFiltro((prev) => !prev);
    };

    const handleExcluirVenda = async (id) => {
        if (window.confirm('Deseja realmente excluir esta venda?')) {
            try {
                const response = await fetch(`${URL}/v-cliente/${id}`, {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if (!response.ok) throw new Error('Erro ao excluir venda');
                setNotification({
                    type: 'success',
                    title: 'Sucesso',
                    message: 'Venda excluída com sucesso!',
                });
                buscarVendas();
            } catch {
                setNotification({
                    type: 'error',
                    title: 'Erro',
                    message: 'Não foi possível excluir a venda.',
                });
            }
        }
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${URL}/v-cliente/${popup.venda.ID}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ valorCompra: formData.valorVenda }),
            });
            if (!response.ok) throw new Error('Erro ao atualizar venda');
            setPopup({ tipo: '', venda: null });
            setNotification({
                type: 'success',
                title: 'Sucesso',
                message: 'Venda atualizada com sucesso!',
            });
            buscarVendas();
        } catch {
            setNotification({
                type: 'error',
                title: 'Erro',
                message: 'Não foi possível atualizar a venda.',
            });
        }
    };

    useEffect(() => {
        buscarVendas();
    }, []);

    return {
        vendas,
        filtros,
        popup,
        formData,
        notification,
        mostrarFiltro,
        handleFiltroChange,
        handleBuscarClick,
        handleVoltarClick,
        handleExcluirVenda,
        handleEditChange,
        handleEditSubmit,
        setFormData,
        setPopup,
        setNotification,
    };
};

export default useConsultarVendaAtacado;
