import { useEffect, useState } from 'react';
import InputField from '../components/InputField/InputField';
import Button from '../components/Button/Button';
import Notification from '../components/Notification/Notification';
import URL from '../service/url.js';
import styles from '../styles/Cadastrar.module.css';

const RegistrarVendaCliente = () => {
  const [form, setForm] = useState({
    NOME: '',
    VALOR: '',
  });

  const [clientes, setClientes] = useState([]);
  const [vendas, setVendas] = useState([]);
  const [notificacao, setNotificacao] = useState(null);

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await fetch(`${URL}/clientes`);
        const data = await response.json();
        setClientes(data);
      } catch (err) {
        setNotificacao({
          type: 'error',
          title: 'Erro',
          message: 'Erro ao buscar clientes.',
        });
      }
    };

    fetchClientes();
    carregarVendas(); // Buscar as vendas ao carregar
  }, []);

  const carregarVendas = async () => {
    try {
      const response = await fetch(`${URL}/v-cliente`);
      if (response.ok) {
        const data = await response.json();
        setVendas(data);
      }
    } catch (err) {
      console.error("Erro ao buscar vendas do dia:", err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validarFormulario = () => {
    if (!form.NOME.trim()) {
      return {
        valido: false,
        titulo: 'Erro de Validação',
        mensagem: 'Selecione um cliente.',
      };
    }

    if (form.VALOR === '' || isNaN(parseFloat(form.VALOR))) {
      return {
        valido: false,
        titulo: 'Erro de Validação',
        mensagem: 'O campo valor deve ser um número válido.',
      };
    }

    return { valido: true };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validacao = validarFormulario();
    if (!validacao.valido) {
      setNotificacao({
        type: 'error',
        title: validacao.titulo,
        message: validacao.mensagem,
      });
      return;
    }

    try {
      const response = await fetch(`${URL}/v-cliente`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: form.NOME,
          valor: parseFloat(form.VALOR),
        }),
      });

      if (response.ok) {
        setNotificacao({
          type: 'success',
          title: 'Sucesso!',
          message: 'Venda registrada com sucesso.',
        });
        setForm({ NOME: '', VALOR: '' });
        carregarVendas(); // Atualiza a lista após registrar
      } else {
        const erro = await response.text();
        setNotificacao({
          type: 'error',
          title: 'Erro',
          message: erro || 'Erro ao registrar venda.',
        });
      }
    } catch (err) {
      setNotificacao({
        type: 'error',
        title: 'Erro',
        message: 'Falha na comunicação com o servidor.',
      });
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.titulo}>Registrar Venda</h1>

      <form onSubmit={handleSubmit} className={styles.form}>
        <label htmlFor="NOME" className={styles.label}>Cliente:</label>
        <select
          name="NOME"
          value={form.NOME}
          onChange={handleChange}
          className={styles.select}
        >
          <option value="">Selecione um cliente</option>
          {clientes.map((cliente) => (
            <option key={cliente.ID} value={cliente.NOME}>
              {cliente.NOME} - {cliente.CIDADE}/{cliente.BAIRRO}
            </option>
          ))}
        </select>

        <InputField
          type="text"
          name="VALOR"
          placeholder="Valor da compra"
          value={form.VALOR}
          onChange={handleChange}
        />

        <Button type="submit">REGISTRAR VENDA</Button>
      </form>

      {notificacao && (
        <Notification
          type={notificacao.type}
          title={notificacao.title}
          message={notificacao.message}
          onClose={() => setNotificacao(null)}
        />
      )}

      {/* Listagem de vendas do dia */}
      <div className={styles.historico}>
        <h3>📅 Vendas do Dia</h3>
        {vendas.length === 0 ? (
          <p>Nenhuma venda registrada hoje.</p>
        ) : (
          <table className={styles.tabela}>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Cidade</th>
                <th>Bairro</th>
                <th>Valor (R$)</th>
                <th>Data</th>
              </tr>
            </thead>
            <tbody>
              {vendas.map((venda, index) => (
                <tr key={index}>
                  <td>{venda.CLIENTE_NOME}</td>
                  <td>{venda.CIDADE}</td>
                  <td>{venda.BAIRRO}</td>
                  <td>
                    {Number(venda.VALOR_COMPRA).toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                  </td>
                  <td>
                    {venda.DATA_VENDA
                      ? new Date(venda.DATA_VENDA).toLocaleDateString('pt-BR')
                      : 'Data inválida'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default RegistrarVendaCliente;
