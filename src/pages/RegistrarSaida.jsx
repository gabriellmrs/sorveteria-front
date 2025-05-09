import { useState, useEffect } from 'react';
import InputField from '../components/InputField/InputField.jsx';
import Button from '../components/Button/Button.jsx';
import Notification from '../components/Notification/Notification.jsx';
import URL from '../service/url.js';
import styles from '../styles/Cadastrar.module.css';

const RegistrarSaida = () => {
  const [form, setForm] = useState({
    NOME: '',
    DESCRICAO: '',
    VALOR: '',
  });

  const [notificacao, setNotificacao] = useState(null);
  const [saidas, setSaidas] = useState([]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validarFormulario = () => {
    if (!form.NOME.trim()) {
      return { valido: false, titulo: 'Erro de Validação', mensagem: 'O campo nome é obrigatório.' };
    }
    if (!form.VALOR || isNaN(parseFloat(form.VALOR))) {
      return { valido: false, titulo: 'Erro de Validação', mensagem: 'O valor deve ser um número válido.' };
    }
    return { valido: true };
  };

  const carregarSaidas = async () => {
    try {
      const response = await fetch(`${URL}/saida`);
      if (response.ok) {
        const data = await response.json();
        setSaidas(data);
      }
    } catch (error) {
      console.error("Erro ao carregar saídas:", error);
    }
  };

  useEffect(() => {
    carregarSaidas();
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
      const response = await fetch(`${URL}/saida`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: form.NOME.trim(),
          descricao: form.DESCRICAO.trim(),
          valor: parseFloat(form.VALOR),
        }),
      });

      if (response.ok) {
        setNotificacao({
          type: 'success',
          title: 'Sucesso!',
          message: 'Saída registrada com sucesso!',
        });

        setForm({ NOME: '', DESCRICAO: '', VALOR: '' });
        carregarSaidas();
      } else {
        const errorText = await response.text();
        setNotificacao({
          type: 'error',
          title: 'Erro',
          message: errorText || 'Erro ao registrar saída.',
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

      <h2 className={styles.titulo}>REGISTRAR SAÍDA DE CAIXA</h2>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.row}>
          <InputField
            label="Nome"
            name="NOME"
            value={form.NOME}
            onChange={handleChange}
            placeholder="Ex: Compra de Material"
          />

          <InputField
            label="Valor (R$)"
            name="VALOR"
            value={form.VALOR}
            onChange={handleChange}
            placeholder="Ex: 50.00"
          />
        </div>

        <InputField
          label="Descrição"
          name="DESCRICAO"
          value={form.DESCRICAO}
          onChange={handleChange}
          placeholder="Descrição opcional"
        />

        <Button type="submit">REGISTRAR</Button>
      </form>

      <div className={styles.historico}>
        <h3>📋 Histórico de Saídas</h3>
        {saidas.length === 0 ? (
          <p>Nenhuma saída registrada ainda.</p>
        ) : (
          <table className={styles.tabela}>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Descrição</th>
                <th>Valor</th>
                <th>Data</th>
              </tr>
            </thead>
            <tbody>
              {saidas.map((saida, index) => (
                <tr key={index}>
                  <td>{saida.NOME}</td>
                  <td>{saida.DESCRICAO || '-'}</td>
                  <td>R$ {Number(saida.VALOR).toFixed(2)}</td>
                  <td>{saida.DATA_SAIDA ? new Date(saida.DATA_SAIDA).toLocaleString() : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default RegistrarSaida;
