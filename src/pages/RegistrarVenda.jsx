import { useState, useEffect } from 'react';
import InputField from '../components/InputField/InputField.jsx';
import Button from '../components/Button/Button.jsx';
import Notification from '../components/Notification/Notification.jsx';
import URL from '../service/url.js';
import styles from '../styles/Cadastrar.module.css';

const RegistrarVenda = () => {
  const [form, setForm] = useState({
    VALOR_VENDA: '',
    VALOR_PAGO: '',
    FORMA_PAGAMENTO: '',
  });

  const [notificacao, setNotificacao] = useState(null);
  const [vendas, setVendas] = useState([]);

  const token = localStorage.getItem('token');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validarFormulario = () => {
    if (!form.VALOR_VENDA || isNaN(parseFloat(form.VALOR_VENDA))) {
      return { valido: false, titulo: 'Erro de Validação', mensagem: 'O valor da venda deve ser um número válido.' };
    }

    if (!form.VALOR_PAGO || isNaN(parseFloat(form.VALOR_PAGO))) {
      return { valido: false, titulo: 'Erro de Validação', mensagem: 'O valor pago deve ser um número válido.' };
    }

    if (!form.FORMA_PAGAMENTO) {
      return { valido: false, titulo: 'Erro de Validação', mensagem: 'Selecione uma forma de pagamento.' };
    }

    return { valido: true };
  };

  const carregarVendas = async () => {
    try {
      const response = await fetch(`${URL}/venda`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setVendas(data);
      }
    } catch (error) {
      console.error("Erro ao carregar vendas do dia:", error);
    }
  };


  useEffect(() => {
    carregarVendas();
  }, []);

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
      const response = await fetch(`${URL}/venda`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
         },
        body: JSON.stringify({
          valorVenda: parseFloat(form.VALOR_VENDA),
          valorPago: parseFloat(form.VALOR_PAGO),
          formaDePagamento: form.FORMA_PAGAMENTO,
        }),
      });

      if (response.ok) {
        setNotificacao({
          type: 'success',
          title: 'Sucesso!',
          message: 'Venda registrada com sucesso!',
        });

        setForm({
          VALOR_VENDA: '',
          VALOR_PAGO: '',
          FORMA_PAGAMENTO: '',
        });

        carregarVendas(); // ⏬ Atualiza o histórico após o registro
      } else {
        const errorText = await response.text();
        setNotificacao({
          type: 'error',
          title: 'Erro',
          message: errorText || 'Erro ao registrar venda.',
        });
      }
    } catch (err) {
      setNotificacao({
        type: 'error',
        title: 'Erro na requisição',
        message: 'Não foi possível conectar ao servidor.',
      });
    }
  };

  return (
    <div className={styles.container}>
      {notificacao && (
        <Notification
          type={notificacao.type}
          title={notificacao.title}
          message={notificacao.message}
          onClose={() => setNotificacao(null)}
        />
      )}

      <h2 className={styles.titulo}>REGISTRAR VENDA</h2>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.row}>
          <InputField
            label="Valor da Venda (R$)"
            name="VALOR_VENDA"
            value={form.VALOR_VENDA}
            onChange={handleChange}
            placeholder="Ex: 15.00"
          />

          <InputField
            label="Valor Pago (R$)"
            name="VALOR_PAGO"
            value={form.VALOR_PAGO}
            onChange={handleChange}
            placeholder="Ex: 20.00"
          />
        </div>

        <div className={styles.row}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Forma de Pagamento </label>
            <select
              className={styles.option}
              name="FORMA_PAGAMENTO"
              value={form.FORMA_PAGAMENTO}
              onChange={handleChange}
            >
              <option value="">Selecione</option>
              <option value="DINHEIRO">Dinheiro</option>
              <option value="CARTÃO">Cartão</option>
              <option value="PIX">PIX</option>
            </select>
          </div>
        </div>

        <Button type="submit">FINALIZAR</Button>
      </form>

      {/* ⬇ Histórico de Vendas */}
      <div className={styles.historico}>
        <h3>📋 Histórico de Vendas do Dia</h3>
        {vendas.length === 0 ? (
          <p>Nenhuma venda registrada hoje.</p>
        ) : (
          <table className={styles.tabela}>
            <thead>
              <tr>
                <th>Valor da Venda</th>
                <th>Valor Pago</th>
                <th>Forma de Pagamento</th>
                <th>Data</th>
                <th>Troco</th>
              </tr>
            </thead>
            {vendas.map((venda, index) => (
              <tr key={index}>
                <td>{Number(venda.VALOR_VENDA).toFixed(2)}</td>
                <td>{Number(venda.VALOR_PAGO).toFixed(2)}</td>
                <td>{venda.FORMA_PAGAMENTO}</td>
                <td>{new Date(venda.DATA_VENDA).toLocaleString()}</td>
                <td>{Number(venda.TROCO).toFixed(2)}</td>
              </tr>
            ))}
          </table>
        )}
      </div>
    </div>
  );
};

export default RegistrarVenda;
