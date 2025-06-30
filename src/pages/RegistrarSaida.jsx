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

  const [erros, setErros] = useState({});
  const [notificacao, setNotificacao] = useState(null);
  const [saidas, setSaidas] = useState([]);

  const token = localStorage.getItem('token');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErros({ ...erros, [e.target.name]: null });
  };

  const validarFormulario = () => {
    const novosErros = {};
    const nome = form.NOME.trim();
    const descricao = form.DESCRICAO.trim();
    const valor = form.VALOR;

    if (!nome) {
      novosErros.NOME = 'O campo "Nome" é obrigatório.';
    } else if (/\d/.test(nome)) {
      novosErros.NOME = 'O nome não pode conter números.';
    }

    if (!descricao) {
      novosErros.DESCRICAO = 'O campo "Descrição" é obrigatório.';
    }

    if (valor === '') {
      novosErros.VALOR = 'O campo "Valor" é obrigatório.';
    } else {
      const valorNumerico = parseFloat(valor);
      if (isNaN(valorNumerico) || valorNumerico <= 0) {
        novosErros.VALOR = 'O valor deve ser um número positivo.';
      }
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const carregarSaidas = async () => {
    try {
      const response = await fetch(`${URL}/saida/dia`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
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

    if (!validarFormulario()) {
      setNotificacao({
        type: 'error',
        title: 'Erro de Validação',
        message: 'Corrija os erros nos campos e tente novamente.',
      });
      return;
    }

    try {
      const response = await fetch(`${URL}/saida`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
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
        setErros({});
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
          <div className={styles.inputGroup}>
            <InputField
              label="Nome"
              name="NOME"
              value={form.NOME}
              onChange={handleChange}
              placeholder="Fornecedor"
            />
            {erros.NOME && <p className={styles.erro}>{erros.NOME}</p>}
          </div>

          <div className={styles.inputGroup}>
            <InputField
              label="Valor (R$)"
              name="VALOR"
              value={form.VALOR}
              onChange={handleChange}
              placeholder="Ex: 50.00"
            />
            {erros.VALOR && <p className={styles.erro}>{erros.VALOR}</p>}
          </div>
        </div>

        <div className={styles.inputGroup}>
          <InputField
            label="Descrição"
            name="DESCRICAO"
            value={form.DESCRICAO}
            onChange={handleChange}
            placeholder="Descrição do gasto"
          />
          {erros.DESCRICAO && <p className={styles.erro}>{erros.DESCRICAO}</p>}
        </div>

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
